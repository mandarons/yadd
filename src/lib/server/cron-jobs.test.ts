import dataGeneratorUtils from './db/test-utils';
import { addService, Services } from './db/services.schema';
import isReachable from 'is-reachable';
import cronJobs from './cron-jobs';
import {describe, beforeAll, afterAll, beforeEach, afterEach, it, vi, expect} from 'vitest';
describe('Cron Jobs Controller', async () => {
    beforeAll(async () => {
        await Services.sync({ force: true });
    });
    afterAll(async () => {
        await Services.drop();
    });
    beforeEach(async () => {
    });
    afterEach(async () => {
        vi.resetAllMocks();
    });
    it('should record service online if it is online', async () => {
        const expectedServices = dataGeneratorUtils.randomServiceRecords();
        expectedServices.map(async s => {
            await addService(s);
            return s;
        });
        vi.fn(isReachable).mockResolvedValueOnce(true);
        const actual = await cronJobs.job();
        expect(actual).not.toBeNull();
    });
    it('should record service offline if it is offline', async () => {
        const expectedServices = dataGeneratorUtils.randomServiceRecords();
        expectedServices.map(async s => {
            await addService(s);
            return s;
        });
        vi.fn(isReachable).mockResolvedValueOnce(false);
        const actual = await cronJobs.job();
        expect(actual).not.toBeNull();
    });
    it('should record service offline in case of isReachable error', async () => {
        const expectedServices = dataGeneratorUtils.randomServiceRecords();
        expectedServices.map(async s => {
            await addService(s);
            return s;
        });
        vi.fn(isReachable).mockRejectedValueOnce(new Error('Error in isReachable'));
        const actual = await cronJobs.job();
        expect(actual).not.toBeNull();
    });
});