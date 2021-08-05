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

import cron from 'node-cron';
import isReachable from 'is-reachable';
import configSchema from '../db/config.schema';
import { getAllServices, IServiceRecordAttributes, updateLastOnline } from '../db/services.schema';

const enableServiceStatusRefresh = async () => {
    let result = ((await configSchema.getStatusCheckInterval()).values as { [key: string]: string; })!.value;

    return cron.schedule(result, async () => {
        const allServices = (await getAllServices()).values as [IServiceRecordAttributes];
        await Promise.all(allServices.map(async service => {
            try {
                if (await isReachable(service.url)) {
                    return updateLastOnline(service.shortName, new Date());
                }
                return new Promise(resolve => resolve(false));
            } catch (error) {
                console.log(`Service ${service.shortName} is offline.`);
                return new Promise(resolve => resolve(false));
            }
        }));
    });
};

export default {
    enableServiceStatusRefresh
};

