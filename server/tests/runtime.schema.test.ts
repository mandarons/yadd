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
import utils from './data-generator.utils';
import * as servicesModel from '../src/db/services.schema';
import { expect } from 'chai';

describe('Runtime Schema', async () => {
    beforeEach(async () => {
        await servicesModel.Services.sync({ force: true });
    });
    afterEach(async () => {
        await servicesModel.Services.drop();
        sinon.restore();
    });
    it('should create a new service record', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        const result = await servicesModel.addService(serviceRecordData);
        (result.values as object).should.include.keys(Object.keys(serviceRecordData));
    });
    it('should not create a duplicate service record', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        let result = await servicesModel.addService(serviceRecordData);
        (result.values as object).should.include.keys(Object.keys(serviceRecordData));
        result = await servicesModel.addService(serviceRecordData);
        result.success.should.be.false;
        (result.errorMessage as string).should.contain('shortName must be unique');
    });
    it('should return empty array if no services are created', async () => {
        let result = await servicesModel.getAllServices();
        result.success.should.be.true;
        (result.values as servicesModel.IServiceRecordAttributes[]).length.should.be.equal(0);
    });
    it('should return an array of services', async () => {
        const expectedServices = utils.randomServiceRecords();
        expectedServices.map(async s => {
            await servicesModel.addService(s);
            return s;
        });
        let result = await servicesModel.getAllServices();
        result.success.should.be.true;
        const actual = result.values as servicesModel.IServiceRecordAttributes[];
        actual.length.should.be.equal(expectedServices.length);
        for (let i = 0; i < expectedServices.length; ++i) {
            utils.compareServiceRecords(expectedServices[i], actual[i]).should.be.true;
        }
    });
    it('should return error in case of failure for getting all services', async () => {
        const expectedServices = utils.randomServiceRecords();
        expectedServices.map(async s => {
            await servicesModel.addService(s);
            return s;
        });
        sinon.stub(servicesModel.Services, 'findAll').throws({ errors: [{ message: 'Exception occurred.' }] });
        let result = await servicesModel.getAllServices();
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should find an existing service record', async () => {
        const serviceRecord = utils.randomServiceRecord();
        let result = await servicesModel.addService(serviceRecord);
        result.success.should.be.true;
        result = await servicesModel.findService(serviceRecord.shortName);
        result.success.should.be.true;
        utils.compareServiceRecords((result.values as servicesModel.IServiceRecordAttributes), serviceRecord);
    });
    it('should not find a non-existing service record', async () => {
        const serviceRecord = utils.randomServiceRecord();
        let result = await servicesModel.findService(serviceRecord.shortName);
        result.success.should.be.true;
        expect(result.values).to.be.undefined;
    });
    it('should handle exception on find service record', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        sinon.stub(servicesModel.Services, 'findOne').throws({ errors: [{ message: 'Exception occurred.' }] });
        const result = await servicesModel.findService(serviceRecordData.shortName);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should update an existing service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        let result = await servicesModel.addService(serviceRecordData);
        result.success.should.be.true;
        let actual: servicesModel.IServiceRecordInstance = result.values as servicesModel.IServiceRecordInstance;
        actual.name.should.be.equal(serviceRecordData.name);

        serviceRecordData.name = 'changed-name';
        result = await servicesModel.updateService(serviceRecordData);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(1);
        result = await servicesModel.findService(serviceRecordData.shortName);
        actual = result.values as servicesModel.IServiceRecordInstance;
        actual.name.should.be.equal(serviceRecordData.name);
    });
    it('should not update a non-existing service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        const result = await servicesModel.updateService(serviceRecordData);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(0);
    });
    it('should handle exception on update', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        sinon.stub(servicesModel.Services, 'update').throws({ errors: [{ message: 'Exception occurred.' }] });
        const result = await servicesModel.updateService(serviceRecordData);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should delete an existing service record', async () => {
        const expected = utils.randomServiceRecord();
        let result = await servicesModel.addService(expected);
        result.success.should.be.true;
        result = await servicesModel.deleteService(expected.shortName);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).deletedRows.should.be.equal(1);
        result = await servicesModel.findService(expected.shortName);
        result.success.should.be.true;
        let actual = result.values as servicesModel.IServiceRecordInstance;
        expect(actual).to.be.undefined;
    });
    it('should not delete a non-existing service record', async () => {
        const expected = utils.randomServiceRecord();
        let result = await servicesModel.deleteService(expected.shortName);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).deletedRows.should.be.equal(0);
    });
    it('should handle exception on delete', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        sinon.stub(servicesModel.Services, 'destroy').throws({ errors: [{ message: 'Exception occurred.' }] });
        const result = await servicesModel.deleteService(serviceRecordData.shortName);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should update lastOnline', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        const lastOnline = new Date();
        const result = await servicesModel.updateLastOnline(serviceRecordData.shortName, true, lastOnline);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(1);
        const foundEntry = (await servicesModel.Services.findOne({
            where: {
                shortName: serviceRecordData.shortName
            }
        }))!.toJSON();
        (foundEntry as servicesModel.IServiceRecordInstance).lastOnline!.toISOString().should.be.equal(lastOnline!.toISOString());
    });
    it('should not update lastOnline for invalid service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        const lastOnline = new Date();
        const result = await servicesModel.updateLastOnline(serviceRecordData.shortName, true, lastOnline);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(0);
    });
    it('should handle exception for updating lastOnline', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        sinon.stub(servicesModel.Services, 'update').throws({ errors: [{ message: 'Exception occurred.' }] });
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        const lastOnline = new Date();
        const result = await servicesModel.updateLastOnline(serviceRecordData.shortName, true, lastOnline);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should get lastOnline', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        const lastOnline = new Date();
        let result = await servicesModel.updateLastOnline(serviceRecordData.shortName, true, lastOnline);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(1);

        result = await servicesModel.getStatus(serviceRecordData.shortName);
        result.success.should.be.true;
        (result.data as servicesModel.IServiceRecordInstance)!.lastOnline!.toISOString().should.be.equal(lastOnline.toISOString());
    });
    it('should get lastOnline as null for invalid service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        const lastOnline = new Date();
        let result = await servicesModel.updateLastOnline(serviceRecordData.shortName, true, lastOnline);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(1);

        result = await servicesModel.getStatus(serviceRecordData.shortName + 'invalid');
        result.success.should.be.true;
        expect((result.data as servicesModel.IServiceRecordInstance).lastOnline).to.be.null;
    });
    it('should handle exception for get lastOnline', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        const lastOnline = new Date();
        let result = await servicesModel.updateLastOnline(serviceRecordData.shortName, true, lastOnline);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(1);
        sinon.stub(servicesModel.Services, 'findOne').throws({ errors: [{ message: 'Exception occurred.' }] });
        result = await servicesModel.getStatus(serviceRecordData.shortName);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should get hits', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        let result = await servicesModel.incrementHits(serviceRecordData.shortName);
        result.success.should.be.true;
        result = await servicesModel.getHits(serviceRecordData.shortName);
        result.success.should.be.true;
        (result.data as servicesModel.IServiceRecordInstance)!.hits.should.be.equal(1);
    });
    it('should not get hits for non-existant service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        let result = await servicesModel.getHits(serviceRecordData.shortName);
        result.success.should.be.true;
        expect((result.data as servicesModel.IServiceRecordInstance)!.hits).to.be.null;
    });
    it('should handle exception on get hits', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        let result = await servicesModel.incrementHits(serviceRecordData.shortName);
        result.success.should.be.true;
        sinon.stub(servicesModel.Services, 'findOne').throws({ errors: [{ message: 'Exception occurred.' }] });
        result = await servicesModel.getHits(serviceRecordData.shortName);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should increment hits', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        let result = await servicesModel.incrementHits(serviceRecordData.shortName);
        result.success.should.be.true;
        result = await servicesModel.getHits(serviceRecordData.shortName);
        (result.data as servicesModel.IServiceRecordInstance)!.hits.should.be.equal(1);
    });
    it('should not increment hits for non-existent service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        let result = await servicesModel.incrementHits(serviceRecordData.shortName);
        result.success.should.be.true;
        (result.data as { [key: string]: number; }).affectedRows.should.be.equal(0);
    });
    it('should handle exception on increment hits', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        sinon.stub(servicesModel.Services, 'update').throws({ errors: [{ message: 'Exception occurred.' }] });
        let result = await servicesModel.incrementHits(serviceRecordData.shortName);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
    it('should get url by shortName', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        const result = await servicesModel.findURLByShortName(serviceRecordData.shortName);
        result.success.should.be.true;
        (result.data as servicesModel.IServiceRecordInstance)!.url.should.be.equal(serviceRecordData.url);
    });
    it('should not get url by shortName for non-existing service', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        const result = await servicesModel.findURLByShortName(serviceRecordData.shortName);
        result.success.should.be.true;
        expect((result.data as servicesModel.IServiceRecordInstance)!.url).to.be.undefined;
    });
    it('should handle excpetion while getting url by shortName', async () => {
        const serviceRecordData = utils.randomServiceRecord();
        (await servicesModel.addService(serviceRecordData)).success.should.be.true;
        sinon.stub(servicesModel.Services, 'findOne').throws({ errors: [{ message: 'Exception occurred.' }] });
        const result = await servicesModel.findURLByShortName(serviceRecordData.shortName);
        result.success.should.be.false;
        result.errorMessage!.should.be.equal('Exception occurred.');
    });
});