import { PrismaClient, ClassificationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed for product classifications...');

    const types = ['TEMPLATE', 'APP', 'LICENSE', 'SUBSCRIPTION'];
    const fields = ['ACCOUNTING', 'HR', 'MARKETING', 'BUSINESS', 'CREATIVE', 'OTHER'];

    console.log('Seeding Product Types...');
    for (const name of types) {
        await prisma.productClassification.upsert({
            where: { name_type: { name, type: ClassificationType.PRODUCT_TYPE } },
            update: {},
            create: {
                name,
                type: ClassificationType.PRODUCT_TYPE,
                isActive: true,
            },
        });
    }

    console.log('Seeding Product Fields...');
    for (const name of fields) {
        await prisma.productClassification.upsert({
            where: { name_type: { name, type: ClassificationType.PRODUCT_FIELD } },
            update: {},
            create: {
                name,
                type: ClassificationType.PRODUCT_FIELD,
                isActive: true,
            },
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
