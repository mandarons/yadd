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
import appConfig from '../proxies/config.proxy';

const successResponse = (res: express.Response, message: string, data: object = {}): express.Response => {
    return res.status(200).json({
        status: 'success',
        message,
        data
    });
};
const errorResponse = (res: express.Response, code: number, message: string, data: object = {}): express.Response => {
    return res.status(code).json({
        status: 'error',
        message,
        data
    });
};

const isValidService = (data: object): boolean => {
    return data !== undefined && data.hasOwnProperty('name') && data.hasOwnProperty('shortName') && data.hasOwnProperty('url') && data.hasOwnProperty('logoURL');
};

const authMiddleware = (success: express.RequestHandler) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (appConfig.server.auth.enable) {
        return success(req, res, next);
    }
    return next();
};

export default {
    successResponse,
    errorResponse,
    isValidService,
    authMiddleware
};