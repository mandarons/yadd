
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';

export type TConfigSchema = {
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

const configFolderPath: string = path.resolve(path.join(__dirname, '..', '..', '..', 'config'));

const configYamlMap: { [key: string]: string; } = {
    'production': path.resolve(path.join(configFolderPath, 'config.yaml')).toString(),
    'test': path.resolve(path.join(configFolderPath, 'test-config.yaml')).toString(),
    'development': path.resolve(path.join(configFolderPath, 'dev-config.yaml')).toString()
};

const getConfigYamlPath = (): string => {
    const currentEnv = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV.toLowerCase() : 'development';
    return configYamlMap[currentEnv];
};

const appConfig: TConfigSchema = yaml.load(fs.readFileSync(getConfigYamlPath(), 'utf-8')) as TConfigSchema;
console.log('Loaded config file: ' + getConfigYamlPath());

export default appConfig;
export {
    getConfigYamlPath
};