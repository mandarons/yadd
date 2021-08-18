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

import axios from 'axios';
import * as constants from './constants';

const login = async (username: string, password: string): Promise<constants.IProxyResponse> => {
    const returnValue = constants.createEmptyProxyResponse();
    try {
        const response = await axios.post(constants.LOGIN_ENDPOINT, { username, password });
        if (response.status === 200) {
            returnValue.success = true;
        } else {
            returnValue.errorMessage = response.status === 401 ? 'Invalid credentials.' : 'Internal error.';
        }
    } catch (err) {
        console.error(`Login failure.`, err);
        returnValue.errorMessage = err.response.data.message || `Exception occurred. Failed to login.`;
    }
    return returnValue;
};

const logout = async (): Promise<void> => {
    try {
        await axios.get(constants.LOGOUT_ENDPOINT);
    } catch (err) {
        console.error(`Logout failure.`, err);
    }
};

const status = async (): Promise<constants.IProxyResponse> => {
    const returnValue = constants.createEmptyProxyResponse();
    try {
        const response = await axios.get(constants.STATUS_ENDPOINT);
        if (response.status === 200) {
            returnValue.success = true;
            returnValue.data = response.data.data;
        } else {
            returnValue.errorMessage = 'Internal error.';
        }
    } catch (err) {
        console.error(`Auth status check failure.`, err);
        returnValue.errorMessage = err.response.data.message || `Exception occurred. Failed to check auth status.`;
    }
    return returnValue;
};

export {
    login,
    logout,
    status
};