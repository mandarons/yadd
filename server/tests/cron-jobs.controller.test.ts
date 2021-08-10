/*
MIT License

Copyright (c) 2021 Mandar Patil (mandarons@pm.me)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import sinon from 'sinon';
import dataGeneratorUtils from './data-generator.utils';
import utils from '../src/controllers/utils';
import { addService, Services } from '../src/db/services.schema';
import cronJobs from '../src/controllers/cron-jobs';

describe('Cron Jobs Controller', async () => {
    before(async () => {
        await Services.sync({ force: true });
    });
    after(async () => {
        await Services.drop();
    });
    beforeEach(async () => {
    });
    afterEach(async () => {
        sinon.restore();
    });
    it('should record service online if it is online', async () => {
        const expectedServices = dataGeneratorUtils.randomServiceRecords();
        expectedServices.map(async s => {
            await addService(s);
            return s;
        });
        sinon.stub(utils, 'isReachable').returns(new Promise(resolve => resolve(true)));
        const actual = await cronJobs.job();
        actual.should.not.be.null;
    });
    it('should record service offline if it is offline', async () => {
        const expectedServices = dataGeneratorUtils.randomServiceRecords();
        expectedServices.map(async s => {
            await addService(s);
            return s;
        });
        sinon.stub(utils, 'isReachable').returns(new Promise(resolve => resolve(false)));
        const actual = await cronJobs.job();
        actual.should.not.be.null;
    });
    it('should record service offline in case of isReachable error', async () => {
        const expectedServices = dataGeneratorUtils.randomServiceRecords();
        expectedServices.map(async s => {
            await addService(s);
            return s;
        });
        sinon.stub(utils, 'isReachable').throws(new Error('Error in isReachable'));
        const actual = await cronJobs.job();
        actual.should.not.be.null;
    });
});