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

export interface IService {
    name: string;
    shortName: string;
    url: string;
    logoURL: string;
    online?: boolean;
    lastOnline?: string | null;
};
export const SEVICES_ACTION_TYPES = {
    FETCHING_ALL: 'FETCHING_ALL',
    FETCH_ALL_SUCCESS: 'FETCH_ALL_SUCCESS',
    FETCH_ALL_FAILED: 'FETCH_ALL_FAILED'
};
export interface IServicesState {
    services: IService[];
    fetching: boolean;
    invalidated: boolean;
};
export interface IServiceAction {
    type: string;
    services: IService[];
};

export interface IProxyResponse {
    success: boolean;
    services: IService[] | null;
    service: IService | null;
    status: { online: boolean; lastOnline: string | null; } | null;
    errorMessage: string | null;
}
export const createEmptyProxyResponse = (): IProxyResponse => {
    return {
        success: false,
        services: null,
        service: null,
        status: null,
        errorMessage: null
    };
};

const API_ROOT = '/api';
export const SERVICES_ENDPOINT = `${API_ROOT}/services`;
export const SERVICE_ENDPOINT = `${API_ROOT}/service`;
export const STATUS_ENDPOINT = `${API_ROOT}/status`;
