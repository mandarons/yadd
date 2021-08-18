
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

import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CookieStrategy } from 'passport-cookie';
import appConfig from '../proxies/config.proxy';
import { VerifiedCallback } from 'passport-jwt';

passport.use('localLogin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username: string, password: string, done) => {
    if (username === 'admin') {
        if (password === appConfig.server.auth.adminPassword) {
            const token = jwt.sign({ password: appConfig.server.auth.adminPassword }, appConfig.server.auth.secretKey, {
                algorithm: 'HS256',
                expiresIn: appConfig.server.authTokenExpiration
            });
            return done(null, token);
        }
    }
    done(null, false);
}));

passport.use(new CookieStrategy({
    cookieName: 'token',
    signed: true
}, async (token: string, done: VerifiedCallback) => {
    const decodedToken: any = jwt.verify(token, appConfig.server.auth.secretKey);
    done(null, decodedToken.password === appConfig.server.auth.adminPassword);
}));

export default {
    jwt,
    passport
};