
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Column Existence ---');
    try {
        const columns: any[] = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Product'
        `;
        console.log('Columns in Product table:');
        columns.forEach(col => {
            console.log(`- ${col.column_name} (${col.data_type})`);
        });

        const hasAccess = columns.some(c => c.column_name === 'membershipAccess');
        console.log(`\nHas 'membershipAccess': ${hasAccess ? 'YES' : 'NO'}`);

    } catch (e: any) {
        console.error('Query failed:', e.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
