import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Deep Database Search ---');

    const models = ['Product', 'Category', 'Course', 'LandingPage', 'Bundle'];
    const targets = ['BÁN LẺ SẢN PHẨM', 'GÓI THÀNH VIÊN', 'MEMBERSHIP'];

    for (const model of models) {
        console.log(`Searching model: ${model}...`);
        // @ts-ignore
        const records = await prisma[model.charAt(0).toLowerCase() + model.slice(1)].findMany();

        for (const record of records) {
            const str = JSON.stringify(record).toUpperCase();
            for (const target of targets) {
                if (str.includes(target)) {
                    console.log(`MATCH found in ${model} (ID: ${record.id})`);
                    console.log(`Data: ${JSON.stringify(record, null, 2)}`);
                }
            }
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
