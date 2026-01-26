
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Publishing all Products ---');
    const result = await prisma.product.updateMany({
        data: {
            isPublished: true
        }
    });
    console.log(`Updated ${result.count} products to be published.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
