
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const basic = await prisma.product.upsert({
        where: { slug: 'goi-thanh-vien-basic' },
        update: {},
        create: {
            title: 'Gói Thành Viên Basic',
            slug: 'goi-thanh-vien-basic',
            type: 'SUBSCRIPTION',
            price: 0,
            description: 'Gói thành viên cơ bản',
            thumbnail: 'https://placehold.co/600x400',
            specs: {},
            isVisible: true
        }
    });
    console.log('Upserted Basic:', basic);

    const premium = await prisma.product.upsert({
        where: { slug: 'goi-thanh-vien-premium' },
        update: {},
        create: {
            title: 'Gói Thành Viên Premium',
            slug: 'goi-thanh-vien-premium',
            type: 'SUBSCRIPTION',
            price: 0,
            description: 'Gói thành viên cao cấp',
            thumbnail: 'https://placehold.co/600x400',
            specs: {},
            isVisible: true
        }
    });
    console.log('Upserted Premium:', premium);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
