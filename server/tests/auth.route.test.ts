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
import sinon from 'sinon';
import utils from './data-generator.utils';
import express from 'express';
import authController from '../src/controllers/auth.controller';
chai.should();

describe('/api/auth Route ', async () => {
    let service: any = null;
    before(async () => {
        utils.indexFile(true);
        utils.enableAuth(true);
        service = await utils.startServer();
    });
    after(async () => {
        utils.indexFile(false);
        await utils.stopServer(service);
    });
    afterEach(async () => {
        sinon.restore();
    });
    it('/api/auth/login should return success for valid credentials', async () => {
        const response = utils.checkForSuccess(await utils.postData(service, '/api/auth/login', { username: 'admin', password: 'admin' }));
        const cookieArray = response.header['set-cookie'][0].split(/=(.+)/).filter((e: string) => e);
        cookieArray.length.should.be.equal(2);
        cookieArray[0].should.be.equal('token');
        cookieArray[1].should.not.be.empty;
    });
    it('/api/auth/login should return error for invalid credentials', async () => {
        utils.checkForError(await utils.postData(service, '/api/auth/login',
            { username: 'admin', password: 'incorrect' }), 401);
        utils.checkForError(await utils.postData(service, '/api/auth/login',
            { username: 'incorrect', password: 'admin' }), 401);
        utils.checkForError(await utils.postData(service, '/api/auth/login',
            { username: '', password: '' }), 401);
        utils.checkForError(await utils.postData(service, '/api/auth/login',
            {}), 401);
    });
    it('/api/auth/login should return 500 for internal error', async () => {
        sinon.stub(authController.passport, 'authenticate').callsFake((strategy, options, callback) => {
            callback!(new Error('Error'), false);
            return (req: express.Request, res: express.Response, next: express.NextFunction) => { };
        });
        const response = await utils.postData(service, '/api/auth/login',
            { username: 'admin', password: 'admin' });
        response.status.should.be.equal(500);
        response.body.status.should.be.equal('error');
    });
    it('should logout an existing admin on /api/auth/logout', async () => {
        let response = utils.checkForSuccess(await utils.postData(service, '/api/auth/login', { username: 'admin', password: 'admin' }));
        const cookieArray = response.header['set-cookie'][0].split(/=(.+)/).filter((e: string) => e);
        cookieArray.length.should.be.equal(2);
        cookieArray[0].should.be.equal('token');
        cookieArray[1].should.not.be.empty;
        response = utils.checkForSuccess(await (await chai.request(service).get('/api/auth/logout').set('Cookie', response.header['set-cookie'][0])));
        response.header['set-cookie'][0].should.include('token=;');
    });
    it('should logout a non-existing, missing user on /api/auth/logout', async () => {
        utils.checkForSuccess(await (await chai.request(service).get('/api/auth/logout')));
    });
});