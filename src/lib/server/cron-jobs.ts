import cron from 'node-cron';
// import isReachable from 'is-reachable';
import prisma from '$lib/prisma';
const DEFAULT_SCHEDULE = '*/30 * * * * *';
const job = async (): Promise<
	{ id: number; shortName: string; checkedAt: Date; isUp: boolean }[]
> => {
	const allServices = await prisma.service.findMany();

	const result: {
		where: { shortName: string };
		data: { checkedAt: Date; isUp: boolean };
	}[] = await Promise.all(
		allServices.map(async (service) => {
			const dataToPush = {
				where: { shortName: service.shortName },
				data: { checkedAt: new Date(), isUp: false }
			};
			try {
				if ((await fetch(service.url)).ok) {
					console.log(`${service.name} is up.`);
					dataToPush.data.isUp = true;
					return new Promise((resolve) => resolve(dataToPush));
				}
			} catch (error) {
				console.error(error);
			}
			console.log(`${service.name} is down.`);
			return new Promise((resolve) => resolve(dataToPush));
		})
	);
	const updatedData = [];
	for (const data of result) {
		// Check latest record to see if it's the same as the current status to avoid unnecessary writes
		const latestServiceCheck = await prisma.serviceCheck.findFirst({
			where: { service: { shortName: data.where.shortName } },
			orderBy: { checkedAt: 'desc' }
		});
		if (latestServiceCheck?.isUp === data.data.isUp) {
			updatedData.push(
				await prisma.serviceCheck.update({
					where: { id: latestServiceCheck?.id },
					data: { checkedAt: new Date() }
				})
			);
		} else {
			updatedData.push(
				await prisma.serviceCheck.create({
					data: { ...data.data, service: { connect: { shortName: data.where.shortName } } }
				})
			);
		}
	}
	return updatedData;
};

const enableServiceStatusRefresh = () =>
	cron.schedule(DEFAULT_SCHEDULE, job, { name: 'service-status-refresh' });

export default {
	job,
	enableServiceStatusRefresh
};
