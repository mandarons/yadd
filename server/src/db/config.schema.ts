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

import { Model, Optional, DataTypes } from "sequelize";
import db, { IDatabaseResponse } from './sql.connection';

const KEY_STATUS_CHECK_REFRESH_INTERVAL = 'statusCheckRefreshInterval';
const DEFAULT_STATUS_CHECK_REFRESH_INTERVAL = '5 * * * * *'; // 30 seconds
const validConfigKeys = [
    KEY_STATUS_CHECK_REFRESH_INTERVAL
];
export interface IConfigRecordAttributes {
    key: string;
    value: string;
};
interface IConfigRecordCreationAttributes extends Optional<IConfigRecordAttributes, 'key'> { };
export interface IConfigRecordInstance extends Model<IConfigRecordAttributes, IConfigRecordCreationAttributes>, IConfigRecordAttributes {
    createdAt?: Date;
    updatedAt?: Date;
};

const Config = db.define<IConfigRecordInstance>('config', {
    key: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(255),
        unique: true
    },
    value: {
        allowNull: true,
        type: DataTypes.STRING(1024)
    }
});


const createRecord = async (key: string, value: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const createdEntry = await Config.create({ key, value });
        returnValue.success = true;
        returnValue.values = createdEntry.toJSON();
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};

const updateRecord = async (key: string, value: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const updatedEntry = await Config.update({ value }, { where: { key } });
        returnValue.success = true;
        returnValue.values = updatedEntry[0] !== null ? { affectedRows: updatedEntry[0] } : undefined;
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const getAllConfig = async (): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const foundEntries = await Config.findAll({});
        returnValue.success = true;
        returnValue.values = foundEntries ? foundEntries.map(e => e.toJSON()) : undefined;
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message || error.message,
            data: error
        };
    }
    return returnValue;
};
const setStatusCheckInterval = async (interval: string = DEFAULT_STATUS_CHECK_REFRESH_INTERVAL):
    Promise<IDatabaseResponse> => {
    return updateRecord(KEY_STATUS_CHECK_REFRESH_INTERVAL, interval);
};
const getStatusCheckInterval = async (): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const foundEntry = await Config.findOne({ where: { key: KEY_STATUS_CHECK_REFRESH_INTERVAL } });
        returnValue.success = true;
        returnValue.values = foundEntry ? foundEntry.toJSON() : undefined;
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message || error.message,
            data: error
        };
    }
    return returnValue;
};

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
    Config.sync();
    (async () => {
        const fromDB = await getStatusCheckInterval();
        if (fromDB.values === undefined) {
            await createRecord(KEY_STATUS_CHECK_REFRESH_INTERVAL, DEFAULT_STATUS_CHECK_REFRESH_INTERVAL);
        }
    })();
};

export default {
    Config,
    createRecord,
    validConfigKeys,
    setStatusCheckInterval,
    getStatusCheckInterval,
    KEY_STATUS_CHECK_REFRESH_INTERVAL,
    DEFAULT_STATUS_CHECK_REFRESH_INTERVAL_IN_MS: DEFAULT_STATUS_CHECK_REFRESH_INTERVAL,
    getAllConfig
};