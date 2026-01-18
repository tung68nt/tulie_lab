
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking courses in database...');
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            price: true
        }
    });
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(c => {
        console.log(`- [${c.id}] ${c.title} (Published: ${c.isPublished}, Price: ${c.price})`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
