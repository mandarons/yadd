import { describe, it, expect, beforeAll } from 'vitest';
import prisma from './prisma';

describe('Prisma Client', () => {
	beforeAll(() => {
		// Ensure DATABASE_URL is set for tests
		if (!process.env.DATABASE_URL) {
			process.env.DATABASE_URL = 'file:./test.db';
		}
	});

	it('should create a Prisma client instance', () => {
		expect(prisma).toBeDefined();
		expect(prisma.$connect).toBeDefined();
		expect(prisma.$disconnect).toBeDefined();
	});

	it('should be able to query the database', async () => {
		const services = await prisma.service.findMany();
		expect(Array.isArray(services)).toBe(true);
	});

	it('should handle database operations', async () => {
		// Create a test service
		const testService = await prisma.service.create({
			data: {
				name: 'Test Prisma Service',
				shortName: 'test-prisma',
				url: 'https://test-prisma.com',
				logoUrl: 'https://test-prisma.com/logo.png',
				ServiceCheck: {
					create: { isUp: true, checkedAt: new Date() }
				}
			}
		});

		expect(testService).toBeDefined();
		expect(testService.name).toBe('Test Prisma Service');

		// Clean up
		await prisma.service.delete({ where: { shortName: 'test-prisma' } });
	});
});
