
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Fetching Products ---');
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products total.`);

    products.forEach(p => {
        console.log(`- [${p.isPublished ? 'PUBLISHED' : 'DRAFT'}] ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}, Field: ${p.field}`);
    });

    console.log('\n--- Fetching Courses ---');
    const courses = await prisma.course.findMany();
    console.log(`Found ${courses.length} courses total.`);
    courses.forEach(c => {
        console.log(`- [${c.isPublished ? 'PUBLISHED' : 'DRAFT'}] ID: ${c.id}, Title: ${c.title}, Slug: ${c.slug}, DeploymentStatus: ${c.deploymentStatus}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
