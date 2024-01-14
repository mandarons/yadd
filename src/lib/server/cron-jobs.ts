import cron from 'node-cron';
import isReachable from 'is-reachable';
import prisma from '$lib/prisma';
const DEFAULT_SCHEDULE = '*/30 * * * * *';
const job = async () => {
	const allServices = await prisma.service.findMany();
	const dataToUpdate: {
		where: { shortName: string };
		data: { checkedAt: Date; isUp: boolean };
	}[] = [];
	// for each service, check if it's reachable

	await Promise.all(
		allServices.map(async (service) => {
			try {
				if (await isReachable(service.url)) {
					console.log(`${service.name} is up.`);
					dataToUpdate.push({
						where: { shortName: service.shortName },
						data: { checkedAt: new Date(), isUp: true }
					});
				} else {
					console.log(`${service.name} is down.`);
					dataToUpdate.push({
						where: { shortName: service.shortName },
						data: { isUp: false, checkedAt: new Date() }
					});
				}
			} catch (error) {
				console.error(error);
			}
			return new Promise((resolve) => resolve(false));
		})
	);
	return await Promise.all(
		dataToUpdate.map(async (data) => {
			// Check latest record to see if it's the same as the current status to avoid unnecessary writes
			const latestServiceCheck = await prisma.serviceCheck.findFirst({
				where: { service: { shortName: data.where.shortName } },
				orderBy: { checkedAt: 'desc' }
			});
			if (latestServiceCheck?.isUp === data.data.isUp)
				return await prisma.serviceCheck.update({
					where: { id: latestServiceCheck.id },
					data: { checkedAt: new Date() }
				});
			return await prisma.serviceCheck.create({
				data: { ...data.data, service: { connect: { shortName: data.where.shortName } } }
			});
		})
	);
};

const enableServiceStatusRefresh = () =>
	cron.schedule(DEFAULT_SCHEDULE, job, { name: 'service-status-refresh' });

export default {
	job,
	enableServiceStatusRefresh
};
