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

import { Model, Optional, DataTypes } from 'sequelize';
import db from './sql.connection';
import { IDatabaseResponse } from './sql.connection';

export interface IServiceRecordAttributes {
    shortName: string;
    name: string;
    url: string;
    logoURL: string;
    hits: number;
    lastOnline: Date | null;
    online: boolean;
};
interface IServiceRecordCreationAttributes extends Optional<IServiceRecordAttributes, 'shortName'> { };
export interface IServiceRecordInstance extends Model<IServiceRecordAttributes, IServiceRecordCreationAttributes>, IServiceRecordAttributes {
    createdAt?: Date;
    updatedAt?: Date;
};
const Services = db.define<IServiceRecordInstance>('services', {
    shortName: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(10),
        unique: true
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    url: {
        allowNull: false,
        type: DataTypes.STRING(255)
    },
    logoURL: {
        allowNull: true,
        type: DataTypes.STRING(255)
    },
    hits: {
        allowNull: false,
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    lastOnline: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
    },
    online: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});
Services.beforeCreate((service, options) => {
    service.hits = 0;
    service.lastOnline = null;
});
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
    Services.sync();
}
const addService = async (runtimeData: IServiceRecordAttributes): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const createdEntry = await Services.create(runtimeData, { raw: false });
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
const findService = async (shortName: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const foundEntry = await Services.findOne({ where: { shortName } });
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
const updateService = async (serviceRecordData: object): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const updatedEntry = await Services.update(serviceRecordData, {
            where: {
                shortName: (serviceRecordData as { shortName: string; }).shortName
            }
        });
        returnValue.success = true;
        returnValue.data = { affectedRows: updatedEntry[0] };
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const deleteService = async (shortName: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const result = await Services.destroy({ where: { shortName } });
        returnValue.success = true;
        returnValue.data = { deletedRows: result };
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const getAllServices = async (): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const updatedEntry = await Services.findAll({});
        returnValue.success = true;
        returnValue.values = updatedEntry.map(e => e.toJSON());
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const updateLastOnline = async (shortName: string, online: boolean, lastOnline: Date = new Date()): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const updateData = online ? { lastOnline, online } : { online };
        const updatedEntry = await Services.update(updateData, { where: { shortName } });
        returnValue.success = true;
        returnValue.data = { affectedRows: updatedEntry[0] };
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const getStatus = async (shortName: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const updatedEntry = await Services.findOne({ where: { shortName } });
        returnValue.success = true;
        returnValue.values = updatedEntry ? updatedEntry!.toJSON() : undefined;
        returnValue.data = {
            lastOnline: updatedEntry ? (returnValue.values as IServiceRecordInstance).lastOnline : null,
            online: updatedEntry ? (returnValue.values as IServiceRecordInstance).online : false
        };
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const getHits = async (shortName: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const updatedEntry = await Services.findOne({ where: { shortName } });
        returnValue.success = true;
        returnValue.values = updatedEntry ? updatedEntry!.toJSON() : undefined;
        returnValue.data = { hits: updatedEntry ? (returnValue.values as IServiceRecordInstance).hits : null };
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const incrementHits = async (shortName: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const currentHits = ((await getHits(shortName)).data as IServiceRecordInstance)!.hits;
        const updatedEntry = await Services.update({ hits: currentHits + 1 }, {
            where: { shortName }
        });
        returnValue.success = true;
        returnValue.data = { affectedRows: updatedEntry[0] };
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
const findURLByShortName = async (shortName: string): Promise<IDatabaseResponse> => {
    let returnValue: IDatabaseResponse = { success: false };
    try {
        const foundEntry = await Services.findOne({ where: { shortName } });
        returnValue.success = true;
        if (foundEntry) {
            returnValue.values = foundEntry!.toJSON();
            returnValue.data = { url: (returnValue.values as IServiceRecordInstance).url };
        } else {
            returnValue.data = { url: undefined };
        }
    } catch (error) {
        returnValue = {
            success: false,
            errorMessage: error.errors[0].message,
            data: error
        };
    }
    return returnValue;
};
export {
    Services,
    addService,
    findService,
    updateService,
    deleteService,
    getAllServices,
    updateLastOnline,
    getStatus,
    getHits,
    incrementHits,
    findURLByShortName
};
