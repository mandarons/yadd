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

import express from 'express';
import authController from '../controllers/auth.controller';
import ms from 'ms';
import appConfig from '../proxies/config.proxy';
import utils from './route.utils';

const Router = express.Router();

Router.post('/login', (req: express.Request, res: express.Response) => {
    authController.passport.authenticate('localLogin', {}, (err, data) => {
        if (err) {
            utils.errorResponse(res, 500, 'Internal error.', { err });
        } else if (data) {
            res.cookie('token', data, {
                httpOnly: true,
                signed: true,
                maxAge: ms(appConfig.server.auth!.tokenExpiration)
            });
            utils.successResponse(res, 'Logged in.');
        } else {
            utils.errorResponse(res, 401, 'Invalid credentials.');
        }
    })(req, res);
});

Router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('token');
    return utils.successResponse(res, 'Logged out.');
});

Router.get('/status', (req, res) => {
    utils.successResponse(res, `Auth is ${appConfig.server.auth.enable ? 'enabled.' : 'disabled.'}`, { enabled: appConfig.server.auth.enable });
});

export default Router;