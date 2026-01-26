import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toSentenceCase(str: string): string {
    if (!str) return str;
    // Specifically target the strings from screenshots
    if (str === 'BÁN LẺ SẢN PHẨM') return 'Bán lẻ sản phẩm';
    if (str === 'GÓI THÀNH VIÊN (MEMBERSHIP)') return 'Gói thành viên (Membership)';

    // Fallback for other potential all-caps strings
    if (str === str.toUpperCase() && str.length > 5) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
}

async function main() {
    console.log('--- Starting Final Database Repair ---');

    // 1. Fix LandingPages
    const pages = await prisma.landingPage.findMany();
    console.log(`Processing ${pages.length} landing pages...`);

    for (const page of pages) {
        if (!page.sections) continue;

        let sections: any[];
        try {
            sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
        } catch (e) {
            console.error(`Failed to parse sections for page ${page.slug}`);
            continue;
        }

        let modified = false;
        const newSections = sections.map((section: any) => {
            const oldTitle = section.title;
            section.title = toSentenceCase(section.title);
            if (oldTitle !== section.title) modified = true;

            if (section.items && Array.isArray(section.items)) {
                section.items = section.items.map((item: any) => {
                    const oldItemTitle = item.title;
                    item.title = toSentenceCase(item.title);
                    if (oldItemTitle !== item.title) modified = true;
                    return item;
                });
            }
            return section;
        });

        if (modified) {
            console.log(`Updating all-caps titles in page: ${page.slug}`);
            await prisma.landingPage.update({
                where: { id: page.id },
                data: {
                    sections: JSON.stringify(newSections)
                }
            });
        }
    }

    // 2. Fix Products
    const products = await prisma.product.findMany();
    console.log(`Processing ${products.length} products...`);
    for (const product of products) {
        const newTitle = toSentenceCase(product.title);
        if (newTitle !== product.title) {
            console.log(`Updating product title: "${product.title}" -> "${newTitle}"`);
            await prisma.product.update({
                where: { id: product.id },
                data: { title: newTitle }
            });
        }
    }

    // 3. Fix Categories
    const categories = await prisma.category.findMany();
    console.log(`Processing ${categories.length} categories...`);
    for (const cat of categories) {
        const newName = toSentenceCase(cat.name);
        if (newName !== cat.name) {
            console.log(`Updating category name: "${cat.name}" -> "${newName}"`);
            await prisma.category.update({
                where: { id: cat.id },
                data: { name: newName }
            });
        }
    }

    console.log('--- Database Repair Finished ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
