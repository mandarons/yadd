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

import path from 'path';
import chai from 'chai';
import chaiHTTP from 'chai-http';
import fs from 'fs';
import axios from 'axios';
import yaml from 'js-yaml';
import server from '../src/index';
import { IServiceRecordAttributes } from '../src/db/services.schema';
import { Server } from 'http';
import * as configProxy from '../src/proxies/config.proxy';

chai.use(chaiHTTP);
const TEMP_DIR_PATH = path.resolve(path.join(__dirname, 'temp'));
const PUBLIC_FOLDER_PATH = path.resolve(path.join(__dirname, '..', 'public'));
const INDEX_FILE_PATH = path.resolve(path.join(PUBLIC_FOLDER_PATH, 'index.html'));
const indexFile = (create = true) => {
    if (create) {
        if (!fs.existsSync(INDEX_FILE_PATH)) {
            if (!fs.existsSync(PUBLIC_FOLDER_PATH)) {
                fs.mkdirSync(PUBLIC_FOLDER_PATH);
            }
            fs.writeFileSync(INDEX_FILE_PATH, '<html>This is index file</html>');
        }
    } else {
        fs.rmSync(PUBLIC_FOLDER_PATH, {
            recursive: true,
            force: true,
        });
    }
};
const waitForReacheable = async (app: any, url: string, timeoutInms: number) => {
    const timeoutThreshold = Date.now() + timeoutInms;
    while (true) {
        try {
            await axios.head(url);
            return app;
        } catch (error) {
            /* istanbul ignore next */
            if (Date.now() > timeoutThreshold) {
                throw new Error(error);
            }
            /* istanbul ignore next */
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
};
const startService = (service: any, url: string, port: number, timeoutInMilliseconds: number) => {
    return new Promise(((resolve, reject) => {
        const app = service.listen(port, () => console.log(`Listening on ${port}`));
        return waitForReacheable(app, url, timeoutInMilliseconds)
            .then(() => resolve(app))
            .catch(reject);
    }));
};
const stopService = (serviceInstance: any) => {
    serviceInstance.close(() => {
        console.info('service closed.');
        return new Promise(resolve => resolve(null));
    });
};
const startServer = async (timeoutInms = 5000) => startService(server.app, `http://localhost:8000`, 8000, timeoutInms);

const stopServer = (serverInstance: any) => stopService(serverInstance);

const randomRefreshInterval = (): number => {
    return parseInt(Math.random().toString(10).slice(-10));
};
const randomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const validURLs = ['http://google.com', 'http://yahoo.com', 'http://duckduckgo.com'];
const validLogoURLs = ['/icons/adguardhome.png', '/icons/adminer.png', '/icons/amazon.png'];
const randomService = (): IServiceRecordAttributes => {
    const serviceName = Math.random().toString(10).slice(-10);
    return {
        name: serviceName,
        shortName: serviceName.slice(-5),
        url: validURLs[randomNumberBetween(0, validURLs.length - 1)],
        logoURL: serviceName,
        hits: 0,
        lastOnline: null,
        online: false
    };
};
const randomString = (): string => Math.random().toString(10);
const randomServiceRecord = (): IServiceRecordAttributes => {
    return {
        shortName: Math.random().toString(10).slice(-5),
        name: Math.random().toString(10).slice(-10),
        url: validURLs[randomNumberBetween(0, validURLs.length - 1)],
        logoURL: validLogoURLs[randomNumberBetween(0, validLogoURLs.length - 1)],
        hits: 0,
        lastOnline: new Date(),
        online: false
    };
};
const compareServiceRecords = (serviceRecord1: IServiceRecordAttributes, serviceRecord2: IServiceRecordAttributes) => {
    return serviceRecord1.name === serviceRecord2.name &&
        serviceRecord1.shortName === serviceRecord2.shortName &&
        serviceRecord1.url === serviceRecord2.url &&
        serviceRecord1.logoURL === serviceRecord2.logoURL;
};
const randomServiceRecords = (size = 5): IServiceRecordAttributes[] => {
    const randomServiceRecords = [];
    for (let i = 0; i < size; ++i) {
        randomServiceRecords.push(randomServiceRecord());
    }
    return randomServiceRecords;
};
const compareServices = (service1: IServiceRecordAttributes, service2: IServiceRecordAttributes) => {
    return service1.logoURL === service2.logoURL &&
        service1.name === service2.name &&
        service1.shortName === service2.shortName &&
        service1.url === service2.url;
};
const randomServices = (size = 5): { [key: string]: IServiceRecordAttributes; } => {
    const services: { [key: string]: IServiceRecordAttributes; } = {};
    for (let i = 0; i < size; ++i) {
        const service = randomService();
        services[service.shortName] = service;
    }
    return services;
};
const createTempDir = (): void => {
    if (!fs.existsSync(TEMP_DIR_PATH)) {
        fs.mkdirSync(TEMP_DIR_PATH);
    }
};
const cleanUpTempDir = (): void => {
    fs.rmSync(TEMP_DIR_PATH, { recursive: true, force: true });
};
const cleanUpConfigFile = (): void => {
    // fs.rmSync(configFilePath, { force: true });
};
const checkForSuccess = (response: any) => {
    response.status.should.be.equal(200);
    response.body.status.should.be.equal('success');
    return response;
};
const checkForError = (response: any, code: number) => {
    response.status.should.be.equal(code);
    response.body.status.should.be.equal('error');
    return response;
};
const postData = async (service: Server, endpoint: string, data: object) => {
    return chai.request(service)
        .post(endpoint)
        .send(data);
};
const enableAuth = async (enable = true) => {
    configProxy.default.server.auth.enable = enable;
    fs.writeFileSync(configProxy.getConfigYamlPath(), yaml.dump(configProxy.default));
};

export default {
    INDEX_FILE_PATH,
    TEMP_DIR_PATH,
    randomString,
    randomRefreshInterval,
    randomNumberBetween,
    createTempDir,
    cleanUpTempDir,
    cleanUpConfigFile,
    randomService,
    randomServices,
    compareServices,
    randomServiceRecord,
    randomServiceRecords,
    compareServiceRecords,
    startServer,
    stopServer,
    indexFile,
    checkForSuccess,
    checkForError,
    postData,
    enableAuth
};