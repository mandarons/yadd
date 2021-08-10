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
import * as serviceModel from '../db/services.schema';
import utils from './route.utils';

const Router = express.Router();

Router.get('/services', async (req, res) => {
    // Return list of services
    const fromDB = await serviceModel.getAllServices();
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    }
    const services = fromDB.values as serviceModel.IServiceRecordAttributes[];
    return utils.successResponse(res, `${services.length} services found.`, {
        services
    });
});

Router.get('/service', async (req, res) => {
    // Get an existing service
    if ('' === req.body.shortName || req.body.shortName === undefined) {
        return utils.errorResponse(res, 400, 'Missing data.', {
            data: req.body
        });
    }
    const fromDB = await serviceModel.findService(req.body.shortName);
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    }
    const service = fromDB.values as serviceModel.IServiceRecordAttributes;
    if (service !== undefined) {
        return utils.successResponse(res, 'Service found.', {
            service
        });
    }
    return utils.errorResponse(res, 404, 'Service not found.', {
        data: req.body
    });
});

Router.post('/service', async (req, res) => {
    // Post a new service
    if (req.body.name === undefined || req.body.shortName === undefined || req.body.logoURL === undefined || req.body.url === undefined ||
        req.body.name === '' || req.body.shortName === '' || req.body.logoURL === '' || req.body.url === '' || !utils.isValidService(req.body)) {
        return utils.errorResponse(res, 400, 'Missing data.', { ...req.body });
    }
    const fromDB = await serviceModel.addService({
        name: req.body.name,
        shortName: req.body.shortName,
        url: req.body.url,
        logoURL: req.body.logoURL
    } as serviceModel.IServiceRecordAttributes);
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    }
    return utils.successResponse(res, `Service ${req.body.name} has been added.`);
});

Router.delete('/service', async (req, res) => {
    // Delete an existing service
    if (req.body.shortName === '' || req.body.shortName === undefined) {
        return utils.errorResponse(res, 400, 'Missing required data.', { ...req.body });
    }
    const fromDB = await serviceModel.deleteService(req.body.shortName);
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    }
    return utils.successResponse(res, `Service ${req.body.shortName} has been removed.`, { ...fromDB.data });
});

Router.put('/service', async (req, res) => {
    // Update an existing service
    if (false === utils.isValidService(req.body.service) || undefined === req.body.shortName || '' === req.body.shortName) {
        return utils.errorResponse(res, 400, 'Missing required data.', { ...req.body });
    }
    if (req.body.shortName !== req.body.service.shortName) {
        return utils.errorResponse(res, 403, 'shortName cannot be changed.', { ...req.body });
    }
    const fromDB = await serviceModel.updateService({
        name: req.body.service.name,
        shortName: req.body.service.shortName,
        url: req.body.service.url,
        logoURL: req.body.service.logoURL
    });
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    }
    return utils.successResponse(res, `Service ${req.body.shortName} has been updated.`, { ...fromDB.data });
});

Router.get('/status', async (req, res) => {
    if (req.query.shortName === undefined || req.query.shortName === '') {
        return utils.errorResponse(res, 403, 'Missing or incorrect data.', { ...req.query });
    }
    const fromDB = await serviceModel.getStatus(req.query.shortName as string);
    if (!fromDB.success) {
        return utils.errorResponse(res, 500, fromDB.errorMessage as string);
    };
    const data = (fromDB.data as { [key: string]: boolean | Date | null; })!;
    return utils.successResponse(res, req.query.shortName + (data.lastOnline ? ' was online.' : ' was never online.'), {
        lastOnline: data.lastOnline,
        online: data.online
    });
});

export default Router;