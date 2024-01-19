import cronJobs from './cron-jobs';
import seedData from '../../../prisma/data.json';
import { describe, beforeAll, afterAll, beforeEach, afterEach, it, vi, expect } from 'vitest';
import prisma from '$lib/prisma';
describe('Cron Jobs Controller', async () => {
	const mockFetchReturn = (ok: boolean) => ({
		json: () => new Promise((resolve) => resolve(ok)),
		headers: new Headers(),
		ok,
		redirected: false,
		status: 0,
		statusText: '',
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
});
