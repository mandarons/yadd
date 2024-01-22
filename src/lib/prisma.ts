import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) {
	process.env['DATABASE_URL'] = 'file:../yadd.db';
}
const prisma = new PrismaClient();
export default prisma;
