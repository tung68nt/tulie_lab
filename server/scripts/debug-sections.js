const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching Home/Landing page sections...');

    // Try to find the page by slug
    const page = await prisma.landingPage.findFirst({
        where: {
            OR: [
                { slug: 'home' },
                { slug: '/' },
                { isActive: true }
            ]
        },
        include: {
            sections: true
        }
    });

    if (!page) {
        console.log('No active landing page found.');
        return;
    }

    console.log(`Found Page: ${page.title} (Slug: ${page.slug})`);
    console.log('--- SECTIONS ---');

    page.sections.forEach(s => {
        console.log(`ID: ${s.id}`);
        console.log(`Type: ${s.type}`);
        console.log(`Title: ${s.title}`);
        console.log(`Subtitle: ${s.subtitle}`);
        console.log(`Content Preview: ${JSON.stringify(s.items).substring(0, 100)}...`);
        console.log('----------------');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
