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

import childProcess from "child_process";
import path from 'path';
import axios from 'axios';

const serverURL = 'http://localhost:3334',
    serverPath = path.resolve(`${__dirname}/../build/src/index.js`);

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retry = async (promiseFactory: any, retryCount: number): Promise<any> => {
    try {
        console.log('Done retrying.');
        return await promiseFactory();
    } catch (error) {
        if (retryCount <= 0) {
            throw error;
        }
        console.log(`retrying ${retryCount} ...`);
        await sleep(1000);
        return await retry(promiseFactory, retryCount - 1);
    }
};

const waitForReacheable = async (url = serverURL, timeoutInMilliseconds: number) => {
    const timeoutThreshold = Date.now() + timeoutInMilliseconds;
    while (true) {
        try {
            await axios.get(url);
            return true;
        } catch (err) {
            if (Date.now() > timeoutThreshold) {
                throw new Error(`URL ${url} not reachable after ${timeoutInMilliseconds} ms.`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
};

const spawnServer = async (scriptPath: string, env: { [key: string]: string; }, timeoutInMilliseconds: number) => {
    return new Promise(((resolve, reject) => {
        // const server = childProcess.spawn(process.execPath, ['--inspect', '--inspect-brk', scriptPath], {env});
        const server = childProcess.spawn(process.execPath, [scriptPath], { env });
        server.stdout.pipe(process.stdout);
        server.stderr.pipe(process.stderr);
        server.on('error', (err: any) => {
            console.error('server: on error');
            return reject(err);
        });
        return waitForReacheable(serverURL, timeoutInMilliseconds)
            .then(() => resolve(server))
            .catch(reject);
    }));
};

const startServer = async (env = {}, scriptPath = serverPath, timeoutInMilliseconds = 5000) => {
    return await spawnServer(scriptPath, { ...process.env, ...env }, timeoutInMilliseconds);
};

const stopServer = async (serverInstance: any): Promise<void> => {
    if (serverInstance) {
        await serverInstance.kill();
        return new Promise(resolve => serverInstance.on('close', () => resolve()));
    }
};



export {
    startServer,
    stopServer,
    retry,
    sleep,
    serverURL
};