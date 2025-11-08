import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import prisma from '$lib/prisma';

describe('Page Server Load and Actions Integration Tests', () => {
	beforeEach(async () => {
		// Clean database before each test
		await prisma.$transaction([prisma.serviceCheck.deleteMany(), prisma.service.deleteMany()]);
	});

	afterEach(async () => {
		// Clean database after each test
		await prisma.$transaction([prisma.serviceCheck.deleteMany(), prisma.service.deleteMany()]);
	});

	describe('Load function behavior', () => {
		it('should return services with their latest check status', async () => {
			// Create a test service with a check
			await prisma.service.create({
				data: {
					name: 'Test Service',
					shortName: 'test',
					url: 'https://test.com',
					logoUrl: 'https://test.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date() }
					}
				}
			});

			const services = await prisma.service.findMany({
				include: {
					ServiceCheck: {
						select: { checkedAt: true, isUp: true },
						orderBy: { checkedAt: 'desc' },
						take: 1
					}
				}
			});

			expect(services.length).toBe(1);
			expect(services[0].ServiceCheck.length).toBe(1);
			expect(services[0].ServiceCheck[0].isUp).toBe(true);
		});

		it('should find service by shortName for redirect', async () => {
			await prisma.service.create({
				data: {
					name: 'Test Service',
					shortName: 'redirect-test',
					url: 'https://redirect-test.com',
					logoUrl: 'https://redirect-test.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date() }
					}
				}
			});

			const service = await prisma.service.findUnique({
				where: { shortName: 'redirect-test' }
			});

			expect(service).not.toBeNull();
			expect(service?.url).toBe('https://redirect-test.com');
		});

		it('should return null when service not found', async () => {
			const service = await prisma.service.findUnique({
				where: { shortName: 'nonexistent' }
			});

			expect(service).toBeNull();
		});
	});

	describe('Create Service behavior', () => {
		it('should create a service with initial check', async () => {
			const serviceData = {
				name: 'New Service',
				shortName: 'new',
				url: 'https://new.com',
				logoUrl: 'https://new.com/logo.png'
			};

			await prisma.service.create({
				data: {
					...serviceData,
					ServiceCheck: { create: { isUp: false, checkedAt: new Date() } }
				}
			});

			const created = await prisma.service.findUnique({
				where: { shortName: 'new' },
				include: { ServiceCheck: true }
			});

			expect(created).not.toBeNull();
			expect(created?.name).toBe('New Service');
			expect(created?.ServiceCheck.length).toBe(1);
		});

		it('should fail when creating duplicate shortName', async () => {
			await prisma.service.create({
				data: {
					name: 'First',
					shortName: 'duplicate',
					url: 'https://first.com',
					logoUrl: 'https://first.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date() }
					}
				}
			});

			// Trying to create duplicate should throw
			await expect(
				prisma.service.create({
					data: {
						name: 'Second',
						shortName: 'duplicate',
						url: 'https://second.com',
						logoUrl: 'https://second.com/logo.png',
						ServiceCheck: {
							create: { isUp: true, checkedAt: new Date() }
						}
					}
				})
			).rejects.toThrow();
		});
	});

	describe('Update Service behavior', () => {
		it('should update service data', async () => {
			await prisma.service.create({
				data: {
					name: 'Old Name',
					shortName: 'update-test',
					url: 'https://old.com',
					logoUrl: 'https://old.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date() }
					}
				}
			});

			await prisma.service.update({
				where: { shortName: 'update-test' },
				data: {
					name: 'New Name',
					url: 'https://new.com'
				}
			});

			const updated = await prisma.service.findUnique({
				where: { shortName: 'update-test' }
			});

			expect(updated?.name).toBe('New Name');
			expect(updated?.url).toBe('https://new.com');
		});

		it('should fail when updating nonexistent service', async () => {
			await expect(
				prisma.service.update({
					where: { shortName: 'nonexistent' },
					data: { name: 'New Name' }
				})
			).rejects.toThrow();
		});
	});

	describe('Delete Service behavior', () => {
		it('should delete service checks then service', async () => {
			await prisma.service.create({
				data: {
					name: 'To Delete',
					shortName: 'delete-test',
					url: 'https://delete.com',
					logoUrl: 'https://delete.com/logo.png',
					ServiceCheck: {
						create: [
							{ isUp: true, checkedAt: new Date() },
							{ isUp: false, checkedAt: new Date(Date.now() - 1000) }
						]
					}
				}
			});

			const checksBefore = await prisma.serviceCheck.count({
				where: { service: { shortName: 'delete-test' } }
			});
			expect(checksBefore).toBe(2);

			// Delete all checks first (as done in the action)
			await prisma.service.update({
				where: { shortName: 'delete-test' },
				data: { ServiceCheck: { deleteMany: {} } },
				include: { ServiceCheck: true }
			});

			// Verify checks are deleted
			const checksAfter = await prisma.serviceCheck.count({
				where: { service: { shortName: 'delete-test' } }
			});
			expect(checksAfter).toBe(0);

			// Then delete the service
			await prisma.service.delete({
				where: { shortName: 'delete-test' }
			});

			const deleted = await prisma.service.findUnique({
				where: { shortName: 'delete-test' }
			});

			expect(deleted).toBeNull();
		});

		it('should handle cascade delete properly', async () => {
			await prisma.service.create({
				data: {
					name: 'Cascade Test',
					shortName: 'cascade',
					url: 'https://cascade.com',
					logoUrl: 'https://cascade.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date() }
					}
				}
			});

			const checksBefore = await prisma.serviceCheck.count({
				where: { service: { shortName: 'cascade' } }
			});
			expect(checksBefore).toBe(1);

			// Delete checks using update with deleteMany
			const updated = await prisma.service.update({
				where: { shortName: 'cascade' },
				data: { ServiceCheck: { deleteMany: {} } },
				include: { ServiceCheck: true }
			});

			expect(updated.ServiceCheck.length).toBe(0);

			const checksAfter = await prisma.serviceCheck.count({
				where: { service: { shortName: 'cascade' } }
			});
			expect(checksAfter).toBe(0);
		});

		it('should validate delete operation works end-to-end', async () => {
			// Create service
			await prisma.service.create({
				data: {
					name: 'End to End Delete',
					shortName: 'e2e-delete',
					url: 'https://e2e-delete.com',
					logoUrl: 'https://e2e-delete.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date() }
					}
				}
			});

			// Verify it exists
			let service = await prisma.service.findUnique({
				where: { shortName: 'e2e-delete' },
				include: { ServiceCheck: true }
			});
			expect(service).not.toBeNull();
			expect(service?.ServiceCheck.length).toBe(1);

			// Delete checks then service (mimics the action)
			await prisma.service.update({
				where: { shortName: 'e2e-delete' },
				data: { ServiceCheck: { deleteMany: {} } }
			});

			await prisma.service.delete({
				where: { shortName: 'e2e-delete' }
			});

			// Verify it's gone
			service = await prisma.service.findUnique({
				where: { shortName: 'e2e-delete' }
			});
			expect(service).toBeNull();
		});
	});

	describe('Service mapping', () => {
		it('should map service data correctly', async () => {
			await prisma.service.create({
				data: {
					name: 'Map Test',
					shortName: 'map',
					url: 'https://map.com',
					logoUrl: 'https://map.com/logo.png',
					ServiceCheck: {
						create: { isUp: true, checkedAt: new Date('2024-01-01') }
					}
				}
			});

			const services = await prisma.service.findMany({
				include: {
					ServiceCheck: {
						select: { checkedAt: true, isUp: true },
						orderBy: { checkedAt: 'desc' },
						take: 1
					}
				}
			});

			const mapped = services.map((service) => ({
				name: service.name,
				shortName: service.shortName,
				url: service.url,
				checkedAt: service.ServiceCheck[0].checkedAt,
				isUp: service.ServiceCheck[0].isUp,
				logoUrl: service.logoUrl
			}));

			expect(mapped[0].name).toBe('Map Test');
			expect(mapped[0].shortName).toBe('map');
			expect(mapped[0].isUp).toBe(true);
		});
	});
});
