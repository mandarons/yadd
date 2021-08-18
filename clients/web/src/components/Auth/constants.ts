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

export interface IAuth {
    username: string;
    enabled: boolean;
};

export const AUTH_ACTION_TYPES = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    STATUS_SUCCESS: 'STATUS_SUCCESS',
    STATUS_FAILED: 'STATUS_FAILED'
};

export interface IAuthState {
    username: string;
    enabled: boolean;
    loggedIn: boolean;
};

export interface IAuthAction {
    type: string;
    payload: IStatusResponse | {};
};

export interface IStatusResponse {
    enabled: boolean;
};
export interface IProxyResponse {
    success: boolean;
    errorMessage: string | null;
    data: IStatusResponse | {};
};

export const createEmptyProxyResponse = (): IProxyResponse => {
    return {
        success: false,
        errorMessage: null,
        data: {}
    };
};

const API_ROOT = '/api';
export const AUTH_ENDPOINT = `${API_ROOT}/auth`;
export const LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/login`;
export const LOGOUT_ENDPOINT = `${AUTH_ENDPOINT}/logout`;
export const STATUS_ENDPOINT = `${AUTH_ENDPOINT}/status`;
