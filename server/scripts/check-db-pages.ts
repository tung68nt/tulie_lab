const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Checking LandingPage table...');
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 60));

    const count = await prisma.landingPage.count();
    console.log(`Total pages: ${count}`);

    if (count > 0) {
        const pages = await prisma.landingPage.findMany({
            select: { slug: true, title: true, type: true }
        });
        console.log('Pages:');
        pages.forEach((p: any) => console.log(`  - [${p.type || 'LANDING'}] ${p.slug}: ${p.title}`));
    } else {
        console.log('No landing pages found in database!');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
