import cron from 'node-cron';
import isReachable from 'is-reachable';
import { getAllServices, IServiceRecordAttributes, updateLastOnline } from '$lib/server/db/services.schema';
import appConfig from '$lib/server/config';

const job = async () => {
    const allServices = (await getAllServices()).values as [IServiceRecordAttributes];
    return await Promise.all(allServices.map(async service => {
        try {
            if (await isReachable(service.url)) {
                return updateLastOnline(service.shortName, true);
            }
            await updateLastOnline(service.shortName, false);
        } catch (error:any) {
            console.error(`Error occurred: ${error.toString()}.`);
        }
        return new Promise(resolve => resolve(false));
    }));
};


const enableServiceStatusRefresh = () => cron.schedule(appConfig.server.statusCheckRefreshInterval, job);

export default {
    job,
    enableServiceStatusRefresh
};