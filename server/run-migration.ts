import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const sqlPath = path.join(__dirname, '../prisma/migrations/ebook_migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');

        // Split combined statements if necessary, or just run it as one block if database supports
        // PostgreSQL usually supports executing multiple statements in one query String
        await prisma.$executeRawUnsafe(sql);

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
