
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking SYSTEM pages...');
    const pages = await prisma.landingPage.findMany({
        where: { type: 'SYSTEM' },
        select: { id: true, title: true, slug: true, type: true, isActive: true }
    });
    console.log('Found pages:', pages.length);
    console.table(pages);
}

check()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
