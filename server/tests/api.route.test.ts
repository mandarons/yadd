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

import chai from 'chai';
import chaiHTTP from 'chai-http';
import sinon from 'sinon';
import utils from './data-generator.utils';
import { IServiceRecordAttributes } from '../src/db/services.schema';
import * as servicesModel from '../src/db/services.schema';
import cronJobs from '../src/controllers/cron-jobs';
import controllerUtils from '../src/controllers/utils';

chai.use(chaiHTTP);

describe('/api route', async () => {
    let server: any = null;
    before(async () => {
        utils.indexFile(true);
        server = await utils.startServer();
    });
    after(async () => {
        utils.indexFile(false);
        await utils.stopServer(server);
    });
    beforeEach(async () => {
        await servicesModel.Services.sync({ force: true });
        utils.cleanUpConfigFile();
    });
    afterEach(async () => {
        await servicesModel.Services.drop();
        sinon.restore();
        utils.cleanUpConfigFile();
    });
    it('/service POST should create a new service', async () => {
        const service = utils.randomServiceRecord();
        const response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
    });
    it('/service POST should not create a duplicate service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(500);
        response.body.status.should.be.equal('error');
    });
    it('/service POST should return error for invalid service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send({});
        response.status.should.to.be.equal(400);
        response.body.status.should.be.equal('error');

        sinon.stub(servicesModel, 'addService').returns(new Promise(resolve => resolve({ success: false })));
        response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.be.equal(500);
        response.body.status.should.be.equal('error');
    });
    it('/service GET should get an existing service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .get('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        utils.compareServices(response.body.data.service, service).should.be.true;
    });
    it('/service GET should return error in case of exception', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        sinon.stub(servicesModel, 'findService').returns(new Promise(resolve => resolve({ success: false })));
        response = await chai.request(server)
            .get('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(500);
        response.body.status.should.be.equal('error');
    });
    it('/service GET should return error for invalid data', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .get('/api/service')
            .send({});
        response.status.should.to.be.equal(400);
        response.body.status.should.be.equal('error');
    });
    it('/service PUT should update an existing service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        service.name = 'changed';
        response = await chai.request(server)
            .put('/api/service')
            .send({
                shortName: service.shortName,
                service
            });
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .get('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        utils.compareServices(response.body.data.service, service).should.be.true;
    });
    it('/service PUT should not update a non-existing service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        service.shortName = 'non-existent';
        service.name = 'changed';
        response = await chai.request(server)
            .put('/api/service')
            .send({
                shortName: service.shortName,
                service
            });
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        response.body.data.affectedRows.should.be.equal(0);
    });
    it('/service PUT should return error for invalid data', async () => {
        const service = utils.randomServiceRecord();
        service.url = 'changed';
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .put('/api/service')
            .send({});
        response.status.should.to.be.equal(400);
        response.body.status.should.be.equal('error');

        sinon.stub(servicesModel, 'updateService').returns(new Promise(resolve => resolve({ success: false })));
        response = await chai.request(server)
            .put('/api/service')
            .send({
                shortName: service.shortName,
                service: service
            });
        response.status.should.to.be.equal(500);
        response.body.status.should.be.equal('error');
    });
    it('/service PUT should return error for changing shortName', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        response = await chai.request(server)
            .put('/api/service')
            .send({
                shortName: 'changed',
                service
            });
        response.status.should.to.be.equal(403);
        response.body.status.should.be.equal('error');
        response.body.message.should.be.equal('shortName cannot be changed.');
    });

    it('/services GET should return list of services', async () => {
        const services = utils.randomServiceRecords();
        services.forEach(async s => {
            let response = await chai.request(server)
                .post('/api/service')
                .send(s);
            response.status.should.to.be.equal(200);
            response.body.status.should.be.equal('success');
        });
        let response = await chai.request(server)
            .get('/api/services');
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        response.body.data.services.forEach((s: IServiceRecordAttributes, i: number) => {
            utils.compareServices(s, services[i]).should.be.true;
        });
    });
    it('/services GET should return error in case of internal exception', async () => {
        const services = utils.randomServiceRecords();
        services.forEach(async s => {
            let response = await chai.request(server)
                .post('/api/service')
                .send(s);
            response.status.should.to.be.equal(200);
            response.body.status.should.be.equal('success');
        });
        sinon.stub(servicesModel, 'getAllServices').returns(new Promise(resolve => resolve({ success: false })));
        let response = await chai.request(server)
            .get('/api/services');
        response.status.should.to.be.equal(500);
        response.body.status.should.be.equal('error');
    });
    it('/status GET should return online status of service with shortName', async () => {
        const service = utils.randomServiceRecord();
        const response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        sinon.stub(controllerUtils, 'isReachable').returns(new Promise(resolve => resolve(true)));
        await cronJobs.job();
        const actual = await chai.request(server)
            .get('/api/status').query({
                shortName: service.shortName
            });
        actual.status.should.be.equal(200);
        actual.body.status.should.be.equal('success');
        actual.body.data.online.should.be.true;
    });
    it('/status GET should return offline status of service with shortName', async () => {
        const service = utils.randomServiceRecord();
        const response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        sinon.stub(controllerUtils, 'isReachable').returns(new Promise(resolve => resolve(false)));
        await cronJobs.job();
        const actual = await chai.request(server)
            .get('/api/status').query({
                shortName: service.shortName
            });
        actual.status.should.be.equal(200);
        actual.body.status.should.be.equal('success');
        actual.body.data.online.should.be.false;
    });
    it('/status GET should return error for missing shortName', async () => {
        const service = utils.randomServiceRecord();
        const response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        const actual = await chai.request(server)
            .get('/api/status').query({});
        actual.status.should.be.equal(403);
        actual.body.status.should.be.equal('error');
        actual.body.message.should.be.equal('Missing or incorrect data.');
    });
    it('/status GET should return error for internal exception', async () => {
        const service = utils.randomServiceRecord();
        const response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        sinon.stub(servicesModel, 'getStatus').returns(new Promise(resolve => resolve({ success: false, errorMessage: 'Error occurred.' })));
        const actual = await chai.request(server)
            .get('/api/status').query({ shortName: service.shortName });
        actual.status.should.be.equal(500);
        actual.body.status.should.be.equal('error');
        actual.body.message.should.be.equal('Error occurred.');
    });
    it('/service DELETE should delete an existing service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .delete('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .get('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(404);
        response.body.status.should.be.equal('error');
    });
    it('/service DELETE should not delete a non-existing service', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .delete('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');
        response.body.data.deletedRows.should.be.equal(0);
    });
    it('/service DELETE should return error for invalid data', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.to.be.equal(200);
        response.body.status.should.be.equal('success');

        response = await chai.request(server)
            .delete('/api/service')
            .send({});
        response.status.should.to.be.equal(400);
        response.body.status.should.be.equal('error');

        sinon.stub(servicesModel, 'deleteService').returns(new Promise(resolve => resolve({ success: false })));
        response = await chai.request(server)
            .delete('/api/service')
            .send({
                shortName: service.shortName
            });
        response.status.should.to.be.equal(500);
        response.body.status.should.be.equal('error');
    });
});

