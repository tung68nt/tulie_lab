import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'mau-day-du-tinh-nang';
    console.log(`Checking Landing Page with slug: ${slug}`);

    const page = await prisma.landingPage.findUnique({
        where: { slug }
    });

    if (!page) {
        console.error('Page not found!');
        return;
    }

    console.log('Current Page Data:', JSON.stringify(page, null, 2));

    console.log('--- Attempting Update ---');
    const testPrice = 199000;

    try {
        const updated = await prisma.landingPage.update({
            where: { id: page.id },
            data: {
                upsellPrice: testPrice
            }
        });
        console.log('Update Success!');
        console.log('Updated Upsell Price:', updated.upsellPrice);
    } catch (error) {
        console.error('Update Failed:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
