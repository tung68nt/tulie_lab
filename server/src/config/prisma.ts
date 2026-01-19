import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Ensure connection string has pgbouncer=true if using Supabase Pooler (port 6543)
let url = process.env.DATABASE_URL;
if (url && url.includes(':6543') && !url.includes('pgbouncer=true')) {
    console.log('🔌 Automatically appending ?pgbouncer=true to DATABASE_URL');
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: url || ''
        }
    }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
