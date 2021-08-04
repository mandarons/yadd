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
import { IService, STATUS_ENDPOINT, SERVICES_ENDPOINT, SERVICE_ENDPOINT, IProxyResponse, createEmptyProxyResponse } from './constants';

const getAllServices = async (): Promise<IProxyResponse> => {
    const returnValue: IProxyResponse = createEmptyProxyResponse();
    try {
        const response = await axios.get(SERVICES_ENDPOINT);
        if (response.status === 200) {
            returnValue.services = response.data.data.services as IService[];
            returnValue.success = true;
        } else {
            returnValue.errorMessage = `Failed to retrieve services - status code: ${response.status}.`;
        }
    } catch (err) {
        // TODO: handle correctly
        console.error('Failed to retrieve services.', err);
        returnValue.errorMessage = err.response.data.message || 'Failed to retrieve services.';
    }
    return returnValue;
};

const postService = async (service: IService): Promise<IProxyResponse> => {
    const returnValue: IProxyResponse = createEmptyProxyResponse();
    try {
        const response = await axios.post(SERVICE_ENDPOINT, service);
        if (response.status === 200) {
            returnValue.success = true;
        } else {
            returnValue.errorMessage = `Failed to create the service - status code: ${response.status}.`;
        }
    } catch (err) {
        // TODO: handle correctly
        console.error('Failed to create the service.', err);
        returnValue.errorMessage = err.response.data.message || `Exception occurred. Failed to create the service.`;
    }
    return returnValue;
};

const putService = async (shortName: string, service: IService): Promise<IProxyResponse> => {
    const returnValue: IProxyResponse = createEmptyProxyResponse();
    try {
        const response = await axios.put(SERVICE_ENDPOINT, { shortName, service });
        if (response.status === 200) {
            returnValue.success = true;
        } else {
            returnValue.errorMessage = `Failed to update the service - status code: ${response.status}.`;
        }
    } catch (err) {
        // TODO: handle correctly
        console.error('Failed to update the service.', err);
        returnValue.errorMessage = err.response.data.message || `Exception occurred. Failed to update the service.`;
    }
    return returnValue;
};

const deleteService = async (shortName: string): Promise<IProxyResponse> => {
    const returnValue: IProxyResponse = createEmptyProxyResponse();
    try {
        const response = await axios.delete(SERVICE_ENDPOINT, { data: { shortName } });
        if (response.status === 200) {
            returnValue.success = true;
        } else {
            returnValue.errorMessage = `Failed to delete the service - status code: ${response.status}.`;
        }
    } catch (err) {
        // TODO: handle correctly
        console.error('Failed to delete the service.', err);
        returnValue.errorMessage = err.response.data.message || `Exception occurred. Failed to delete the service.`;
    }
    return returnValue;
};

const getServiceStatus = async (shortName: string): Promise<IProxyResponse> => {
    let returnValue: IProxyResponse = createEmptyProxyResponse();
    returnValue.status = { online: false, lastOnline: null };
    try {
        const response = await axios.get(STATUS_ENDPOINT, { params: { shortName } });
        if (response.status === 200) {
            returnValue.success = true;
            returnValue.status.online = response.data.data.online;
            returnValue.status.lastOnline = response.data.data.lastOnline;
        } else {
            returnValue.errorMessage = `Failed to get the status - code: ${response.status}.`;
        }
    } catch (err) {
        console.error('Failed to get the service status.', err);
        returnValue.errorMessage = err.response.data.message || `Exception occurred. Failed to get the service status.`;
    }
    return returnValue;
};
export {
    getAllServices,
    postService,
    putService,
    deleteService,
    getServiceStatus
};