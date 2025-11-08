import cronJobs from './cron-jobs';
import seedData from '../../../prisma/data.json';
import { describe, beforeAll, afterAll, beforeEach, afterEach, it, vi, expect } from 'bun:test';
import prisma from '../prisma';

describe('Cron Jobs Controller', async () => {
	const mockFetchReturn = (ok: boolean) => ({
		json: () => new Promise((resolve) => resolve(ok)),
		headers: new Headers(),
		ok,
		redirected: false,
		status: ok ? 200 : 500,
		statusText: ok ? 'OK' : 'Internal Server Error',
		type: 'error',
		url: '',
		clone: function (): Response {
			throw new Error('Function not implemented.');
		},
		body: null,
		bodyUsed: false,
		arrayBuffer: function (): Promise<ArrayBuffer> {
			throw new Error('Function not implemented.');
		},
		blob: function (): Promise<Blob> {
			throw new Error('Function not implemented.');
		},
		formData: function (): Promise<FormData> {
			throw new Error('Function not implemented.');
		},
		text: function (): Promise<string> {
			throw new Error('Function not implemented.');
		}
	});

	beforeAll(async () => {
		await prisma.$transaction([prisma.serviceCheck.deleteMany(), prisma.service.deleteMany()]);
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	beforeEach(async () => {
		global.fetch = vi.fn();
	});

	afterEach(async () => {
		await prisma.$transaction([prisma.serviceCheck.deleteMany(), prisma.service.deleteMany()]);
		global.fetch.mockReset();
		vi.resetAllMocks();
	});

	it('should record service online if it is online', async () => {
		for (const s of seedData) {
			await prisma.service.create({ data: { ...s } });
		}
		fetch.mockResolvedValue(mockFetchReturn(true));
		const actual = await cronJobs.job();
		expect(actual.length).toEqual(seedData.length);
		actual.map((a) => expect(a.id).not.toBeNull());
		actual.map((a) => expect(a.isUp).toBe(true));
	});

	it('should record service offline if it is offline', async () => {
		for (const s of seedData) {
			await prisma.service.create({ data: { ...s } });
		}
		fetch.mockResolvedValue(mockFetchReturn(false));
		const actual = await cronJobs.job();
		expect(actual.length).toEqual(seedData.length);
		actual.map((a) => expect(a.id).not.toBeNull());
		actual.map((a) => {
			return expect(a.isUp).toBe(false);
		});
	});

	it('should handle fetch errors gracefully', async () => {
		await prisma.service.create({
			data: {
				name: 'Test Service',
				shortName: 'test-error',
				url: 'https://test-error.com',
				logoUrl: 'https://test-error.com/logo.png'
			}
		});

		fetch.mockRejectedValue(new Error('Network error'));
		const actual = await cronJobs.job();
		expect(actual.length).toEqual(1);
		expect(actual[0].isUp).toBe(false);
	});

	it('should update timestamp when status unchanged', async () => {
		// Create service with initial check
		await prisma.service.create({
			data: {
				name: 'Test Service',
				shortName: 'test-unchanged',
				url: 'https://test-unchanged.com',
				logoUrl: 'https://test-unchanged.com/logo.png',
				ServiceCheck: {
					create: { isUp: true, checkedAt: new Date(Date.now() - 10000) }
				}
			}
		});

		// Mock fetch to return same status
		fetch.mockResolvedValue(mockFetchReturn(true));

		const before = await prisma.serviceCheck.findFirst({
			where: { service: { shortName: 'test-unchanged' } }
		});

		const actual = await cronJobs.job();

		const after = await prisma.serviceCheck.findFirst({
			where: { service: { shortName: 'test-unchanged' } },
			orderBy: { checkedAt: 'desc' }
		});

		expect(actual.length).toEqual(1);
		expect(actual[0].isUp).toBe(true);
		expect(before?.id).toBe(after?.id); // Same record
		expect(after?.checkedAt.getTime()).toBeGreaterThan(before?.checkedAt.getTime()!);
	});

	it('should create new record when status changes', async () => {
		// Create service with initial check (online)
		await prisma.service.create({
			data: {
				name: 'Test Service',
				shortName: 'test-change',
				url: 'https://test-change.com',
				logoUrl: 'https://test-change.com/logo.png',
				ServiceCheck: {
					create: { isUp: true, checkedAt: new Date(Date.now() - 10000) }
				}
			}
		});

		// Mock fetch to return different status (offline)
		fetch.mockResolvedValue(mockFetchReturn(false));

		const beforeCount = await prisma.serviceCheck.count({
			where: { service: { shortName: 'test-change' } }
		});

		const actual = await cronJobs.job();

		const afterCount = await prisma.serviceCheck.count({
			where: { service: { shortName: 'test-change' } }
		});

		expect(actual.length).toEqual(1);
		expect(actual[0].isUp).toBe(false);
		expect(afterCount).toBe(beforeCount + 1); // New record created
	});

	it('should call enableServiceStatusRefresh and create scheduled task', () => {
		const task = cronJobs.enableServiceStatusRefresh();
		expect(task).toBeDefined();
		expect(task.stop).toBeDefined();
		task.stop();
	});

	it('should handle empty service list', async () => {
		const actual = await cronJobs.job();
		expect(actual.length).toEqual(0);
	});

	it('should use HEAD method for HTTP requests', async () => {
		await prisma.service.create({
			data: {
				name: 'Test',
				shortName: 'test-head',
				url: 'https://test-head.com',
				logoUrl: 'https://test-head.com/logo.png'
			}
		});

		fetch.mockResolvedValue(mockFetchReturn(true));
		await cronJobs.job();

		expect(fetch).toHaveBeenCalledWith(
			'https://test-head.com',
			expect.objectContaining({
				method: 'HEAD',
				headers: expect.objectContaining({
					'User-Agent': 'YADD-Monitor/1.0'
				})
			})
		);
	});
});
