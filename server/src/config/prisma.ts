import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const url = process.env.DATABASE_URL;

// Safe instantiation of PrismaClient
export const prisma = (() => {
    try {
        if (!url) {
            console.warn('⚠️  Prisma URL is missing. Client will fail on first query.');
        }
        return globalForPrisma.prisma || new PrismaClient({
            datasources: {
                db: {
                    url: url || ''
                }
            },
            log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error'],
        });
    } catch (err) {
        console.error('❌ Critical error during PrismaClient instantiation:', err);
        return null as any;
    }
})();

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma;

export default prisma;
