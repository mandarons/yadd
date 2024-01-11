import fs from 'fs';
import yaml from 'js-yaml';
import config, { getConfigYamlPath } from '$lib/server/config';
import { describe, it, beforeAll, beforeEach, expect } from 'vitest';

describe('Config Proxy ', async () => {
    let expectedConfig: object = {};

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        expectedConfig = yaml.load(fs.readFileSync(getConfigYamlPath()).toString()) as object;
    });

    beforeEach(() => {
        process.env.NODE_ENV = 'test';
    });

    it('should load config.yaml for production environment', async () => {
        process.env.NODE_ENV = 'production';
        expect(getConfigYamlPath()).toContain('/config.yaml');
    });

    it('should load tests-config.yaml for tests environment', async () => {
        expect(getConfigYamlPath()).toContain('/test-config.yaml');
    });

    it('should load dev-config.yaml for non-production, non-tests environment', async () => {
        delete process.env.NODE_ENV;
        expect(getConfigYamlPath()).toContain('/dev-config.yaml');
    });

    it('should load configuration file', async () => {
        expect(config).toEqual(expectedConfig);
    });
});