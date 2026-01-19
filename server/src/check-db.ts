
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Checking Landing Pages ---');
        const landingPages = await prisma.landingPage.findMany({
            select: { id: true, title: true, slug: true, updatedAt: true, isActive: true }
        });
        console.table(landingPages);

        if (landingPages.length > 0) {
            const firstPage = await prisma.landingPage.findFirst();
            console.log('Sample Section Data (First 100 chars):', JSON.stringify(firstPage?.sections).substring(0, 100));
        }

        console.log('\n--- Checking System Settings (Payment Configs?) ---');
        const settings = await prisma.systemSetting.findMany({
            select: { key: true, updatedAt: true }
        });
        console.table(settings);

        console.log('\n--- Checking Recent Orders (Last 24h) ---');
        const recentOrders = await prisma.order.findMany({
            where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            select: { id: true, code: true, amount: true, status: true, createdAt: true }
        });
        console.table(recentOrders);

    } catch (error) {
        console.error('Error connecting to DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
