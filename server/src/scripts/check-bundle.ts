
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBundleTable() {
    try {
        console.log('Attempting to count bundles...');
        const count = await prisma.bundle.count();
        console.log(`Success! Bundle table exists. Count: ${count}`);

        // Check if we can create one (permissions/constraints)
        // await prisma.bundle.create({ data: { name: 'Test Bundle', slug: 'test-bundle-' + Date.now(), originalPrice: 100, salePrice: 90 }});
        // console.log('Create test success');
    } catch (error) {
        console.error('Error accessing Bundle table:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBundleTable();
