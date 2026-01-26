import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Repair & Diagnostics ---');

    // 1. Diagnose SePay API Key
    const envKey = process.env.SEPAY_API_KEY;
    console.log('SePay API Key from ENV:', envKey ? `${envKey.substring(0, 5)}...${envKey.slice(-5)} (Length: ${envKey.length})` : 'MISSING');

    if (envKey && (envKey.startsWith('"') || envKey.endsWith('"') || envKey.startsWith("'") || envKey.endsWith("'"))) {
        console.warn('WARNING: SePay API Key contains quotes! This will cause authentication failure.');
    }

    // 2. Fix All-Caps Titles in Landing Pages
    console.log('\nScanning Landing Pages for all-caps titles...');
    const pages = await prisma.landingPage.findMany();

    for (const page of pages) {
        if (!page.sections) continue;

        let sections: any[];
        try {
            sections = JSON.parse(page.sections as string);
        } catch (e) {
            console.error(`Failed to parse sections for page ${page.slug}`);
            continue;
        }

        let modified = false;

        const fixText = (text: string) => {
            if (!text) return text;
            // Specifically target the strings from screenshots
            if (text === 'BÁN LẺ SẢN PHẨM') {
                modified = true;
                return 'Bán lẻ sản phẩm';
            }
            if (text === 'GÓI THÀNH VIÊN (MEMBERSHIP)') {
                modified = true;
                return 'Gói thành viên (Membership)';
            }
            return text;
        };

        const newSections = sections.map((section: any) => {
            section.title = fixText(section.title);
            if (section.items && Array.isArray(section.items)) {
                section.items = section.items.map((item: any) => ({
                    ...item,
                    title: fixText(item.title)
                }));
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

    console.log('--- Finished ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
