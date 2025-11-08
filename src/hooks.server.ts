import prisma from '$lib/prisma';
import cronJobs from '$lib/server/cron-jobs';

const scheduledTasks = (async () => await cronJobs.enableServiceStatusRefresh())();
const tearDown = async () => {
	console.log('Tearing down scheduled tasks...');
	(await scheduledTasks).stop();
	console.log('Disconnecting from database...');
	await prisma.$disconnect();
	console.log('Done.');
};

process.on('SIGINT', tearDown);
process.on('SIGTERM', tearDown);
