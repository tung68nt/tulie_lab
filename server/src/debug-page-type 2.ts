
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Page Types ---');

    // @ts-ignore
    const page = await prisma.landingPage.findUnique({
        where: { slug: 'full-test-page' },
        select: { slug: true, type: true, title: true }
    });
    console.log('Page Details:', page);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
