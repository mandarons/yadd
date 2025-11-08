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
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

	try {
		const response = await fetch(url, {
			signal: controller.signal,
			method: 'HEAD', // Use HEAD to reduce bandwidth
			headers: {
				'User-Agent': 'YADD-Monitor/1.0'
			}
		});

		return response.ok;
	} catch (error) {
		// Service is down or unreachable
		return false;
	} finally {
		// Always clear timeout to prevent memory leaks
		clearTimeout(timeoutId);
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

	// Fetch all latest service checks in a single query to avoid N+1 pattern
	const latestChecks = await prisma.serviceCheck.groupBy({
		by: ['serviceId'],
		_max: {
			checkedAt: true
		}
	});

	// Build a map of the latest checks for each service
	const latestCheckMap = new Map<
		string,
		{ id: number; serviceId: number; isUp: boolean; service: { shortName: string } }
	>();

	if (latestChecks.length > 0) {
		const latestCheckIds = await prisma.serviceCheck.findMany({
			where: {
				OR: latestChecks.map((check) => ({
					serviceId: check.serviceId,
					checkedAt: check._max.checkedAt
				}))
			},
			select: {
				id: true,
				serviceId: true,
				isUp: true,
				service: {
					select: {
						shortName: true
					}
				}
			}
		});

		for (const check of latestCheckIds) {
			latestCheckMap.set(check.service.shortName, check);
		}
	}

	// Use a transaction to batch all database operations
	const updatedData = await prisma.$transaction(
		checkResults.map((result) => {
			const latestCheck = latestCheckMap.get(result.shortName);

			if (latestCheck && latestCheck.isUp === result.isUp) {
				// Status unchanged, just update the timestamp
				return prisma.serviceCheck.update({
					where: { id: latestCheck.id },
					data: { checkedAt: result.checkedAt }
				});
			} else {
				// Status changed or no previous check, create a new record
				return prisma.serviceCheck.create({
					data: {
						isUp: result.isUp,
						checkedAt: result.checkedAt,
						service: { connect: { shortName: result.shortName } }
					}
				});
			}
		})
	);

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
