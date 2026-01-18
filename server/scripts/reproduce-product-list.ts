
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../src/modules/shop/products/repositories/prisma-product.repository';
import { ProductService } from '../src/modules/shop/products/products.service';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing listProducts...');
    const repo = new PrismaProductRepository();
    // primitive mock of repo if needed, but we can verify integration with real DB if prisma client works
    // However, PrismaProductRepository imports 'prisma' from config/prisma. 
    // We should probably rely on the implementation in the codebase.

    // Let's just bypass the service class instantiation dependency for a second 
    // and call the repository logic directly or use the service if manageable.
    // The repository uses a singleton 'prisma' from config. 

    try {
        const products = await repo.findAll({ limit: 100 });
        console.log('Products fetched successfully:', products.data.length);
        console.log(JSON.stringify(products.data[0], null, 2));
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
