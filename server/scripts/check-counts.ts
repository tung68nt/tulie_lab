
import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const courseCount = await prisma.course.count();
        const productCount = await prisma.product.count();
        console.log(`Course count: ${courseCount}`);
        console.log(`Product count: ${productCount}`);

        if (courseCount > 0) {
            const courses = await prisma.course.findMany({ take: 3, select: { title: true, isPublished: true, deploymentStatus: true } });
            console.log('Sample courses:', JSON.stringify(courses, null, 2));
        }
    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
