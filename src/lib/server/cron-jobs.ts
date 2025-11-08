import cron from 'node-cron';
import prisma from '$lib/prisma';

/**
 * Default schedule for service status checks (every 30 seconds)
 */
const DEFAULT_SCHEDULE = '*/30 * * * * *';

/**
 * Timeout for HTTP requests (in milliseconds)
 */
const FETCH_TIMEOUT = 5000;

/**
 * Result type for service check
 */
type ServiceCheckResult = {
	id: number;
	shortName: string;
	checkedAt: Date;
	isUp: boolean;
};

/**
 * Checks if a service URL is reachable
 * @param url - The URL to check
 * @returns Promise<boolean> - true if service is up, false otherwise
 */
async function checkServiceStatus(url: string): Promise<boolean> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

		const response = await fetch(url, {
			signal: controller.signal,
			method: 'HEAD', // Use HEAD to reduce bandwidth
			headers: {
				'User-Agent': 'YADD-Monitor/1.0'
			}
		});

		clearTimeout(timeoutId);
		return response.ok;
	} catch (error) {
		// Service is down or unreachable
		return false;
	}
}

/**
 * Main job that checks all services and updates their status
 * @returns Promise<ServiceCheckResult[]> - Array of updated service check records
 */
const job = async (): Promise<ServiceCheckResult[]> => {
	const allServices = await prisma.service.findMany();

	const checkResults = await Promise.all(
		allServices.map(async (service) => {
			const isUp = await checkServiceStatus(service.url);
			const status = isUp ? 'up' : 'down';
			console.log(`${service.name} is ${status}.`);

			return {
				shortName: service.shortName,
				isUp,
				checkedAt: new Date()
			};
		})
	);

	const updatedData: ServiceCheckResult[] = [];

	for (const result of checkResults) {
		// Check latest record to avoid unnecessary writes if status hasn't changed
		const latestServiceCheck = await prisma.serviceCheck.findFirst({
			where: { service: { shortName: result.shortName } },
			orderBy: { checkedAt: 'desc' }
		});

		if (latestServiceCheck?.isUp === result.isUp) {
			// Status unchanged, just update the timestamp
			const updated = await prisma.serviceCheck.update({
				where: { id: latestServiceCheck.id },
				data: { checkedAt: result.checkedAt }
			});
			updatedData.push(updated);
		} else {
			// Status changed, create a new record
			const created = await prisma.serviceCheck.create({
				data: {
					isUp: result.isUp,
					checkedAt: result.checkedAt,
					service: { connect: { shortName: result.shortName } }
				}
			});
			updatedData.push(created);
		}
	}

	return updatedData;
};

/**
 * Enables automatic service status refresh on a schedule
 * @returns cron.ScheduledTask - The scheduled cron task
 */
const enableServiceStatusRefresh = () =>
	cron.schedule(DEFAULT_SCHEDULE, job, { name: 'service-status-refresh' });

export default {
	job,
	enableServiceStatusRefresh
};
