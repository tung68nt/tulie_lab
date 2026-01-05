import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const { count } = await prisma.activityLog.updateMany({
            where: { action: 'VIEW_PAGE' },
            data: { action: 'view_page' }
        });
        console.log(`Successfully updated ${count} records from 'VIEW_PAGE' to 'view_page'.`);
    } catch (error) {
        console.error('Error updating records:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
