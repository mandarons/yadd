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
import yaml from 'js-yaml';
import fs from 'fs';

interface IConfigSchema {
    server:
    {
        port: number;
        authTokenExpiration: string;
        statusCheckRefreshInterval: string;
        auth:
        {
            enable: boolean;
            adminPassword: string;
            tokenExpiration: string;
            secretKey: string;
        };
    };
};

const configFolderPath: string = path.resolve(path.join(__dirname, '..', '..', 'config'));

const configYamlMap: { [key: string]: string; } = {
    'production': path.resolve(path.join(configFolderPath, 'config.yaml')).toString(),
    'test': path.resolve(path.join(configFolderPath, 'test-config.yaml')).toString(),
    'development': path.resolve(path.join(configFolderPath, 'dev-config.yaml')).toString()
};

const getConfigYamlPath = (): string => {
    const currentEnv = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV.toLowerCase() : 'development';
    return configYamlMap[currentEnv];
};

const appConfig: IConfigSchema = yaml.load(fs.readFileSync(getConfigYamlPath(), 'utf-8')) as IConfigSchema;
console.log('Loaded config file: ' + getConfigYamlPath());

export default appConfig;
export {
    IConfigSchema,
    getConfigYamlPath
};