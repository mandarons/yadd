import { PrismaClient } from '@prisma/client';
import data from './data.json' assert { type: 'json' };
const prisma = new PrismaClient();

const main = async () => {
	console.log('Starting seed ...');
	for (const service of data) {
		const s = await prisma.service.create({
			data: { ...service, ServiceCheck: { create: { isUp: false, checkedAt: new Date() } } }
		});
		console.log(`Created service ${s.name}`);
	}
	console.log('Finished seed.');
};

main()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
