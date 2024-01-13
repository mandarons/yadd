import cron from 'node-cron';
import isReachable from 'is-reachable';
import prisma from '$lib/prisma';
const DEFAULT_SCHEDULE = '*/30 * * * * *';
const job = async () => {
	const allServices = await prisma.service.findMany();
	const dataToUpdate: {
		where: { shortName: string };
		data: { lastOnline?: Date; isUp: boolean };
	}[] = [];
	await Promise.all(
		allServices.map(async (service) => {
			try {
				if (await isReachable(service.url)) {
					console.log(`${service.name} is up.`);
					dataToUpdate.push({
						where: { shortName: service.shortName },
						data: { lastOnline: new Date(), isUp: true }
					});
				} else {
					console.log(`${service.name} is down.`);
					dataToUpdate.push({
						where: { shortName: service.shortName },
						data: { isUp: false }
					});
				}
			} catch (error) {
				console.error(error);
			}
			return new Promise((resolve) => resolve(false));
		})
	);
	return await Promise.all(
		dataToUpdate.map(
			async (data) => await prisma.service.update({ where: data.where, data: data.data })
		)
	);
};

const enableServiceStatusRefresh = () => cron.schedule(DEFAULT_SCHEDULE, job);

export default {
	job,
	enableServiceStatusRefresh
};
