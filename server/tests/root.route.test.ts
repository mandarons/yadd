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
import fs from 'fs';
import * as servicesModel from '../src/db/services.schema';
import utils from './data-generator.utils';
chai.should();
chai.use(chaiHTTP);

describe('Root route', async () => {
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
        utils.cleanUpConfigFile();
        sinon.restore();
    });
    it('/favicon.ico should redirect to /', async () => {
        const response = await chai.request(server)
            .get('/favicon.ico');
        response.status.should.be.equal(204);
    });
    it('/ should return index file', async () => {
        const response = await chai.request(server)
            .get('/');
        response.status.should.be.equal(200);
        response.type.should.be.equal('text/html');
        response.text.should.be.equal(fs.readFileSync(utils.INDEX_FILE_PATH, { encoding: "utf8" }).toString());
    });
    it('/:name should redirect to named URL', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.be.equal(200);

        response = await chai.request(server)
            .get(`/${service.shortName}`);
        response.status.should.be.equal(200);
        response.type.should.be.equal('text/html');
        response.text.should.include(`<meta http-equiv="refresh" content="0; URL=${service.url}" />`);
        // response.redirects.length.should.be.greaterThan(0);
        // response.redirects[0].startsWith(service.url).should.be.true;
    });
    it('/:invalid_name should return error', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.be.equal(200);

        response = await chai.request(server)
            .get(`/${service.shortName}-invalid`);
        response.status.should.be.equal(404);
        response.redirects.length.should.be.equal(0);
    });
    it('/:name should return error in case of exception', async () => {
        const service = utils.randomServiceRecord();
        let response = await chai.request(server)
            .post('/api/service')
            .send(service);
        response.status.should.be.equal(200);
        sinon.stub(servicesModel, 'findURLByShortName').returns(new Promise(resolve => resolve({ success: false })));
        response = await chai.request(server)
            .get(`/${service.shortName}`);
        response.status.should.be.equal(500);
    });
});

