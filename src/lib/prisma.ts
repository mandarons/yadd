import { PrismaClient } from '@prisma/client';

// Bun automatically loads .env files
if (!process.env.DATABASE_URL) {
	process.env.DATABASE_URL = 'file:../yadd.db';
}

const prisma = new PrismaClient();
export default prisma;
