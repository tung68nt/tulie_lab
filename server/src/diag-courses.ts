
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Checking Courses ---');
        const courses = await prisma.course.findMany({
            select: { id: true, title: true, slug: true }
        });
        console.table(courses);

        if (courses.length > 0 && courses[0]) {
            const firstId = courses[0].id;
            console.log(`\n--- Fetching Full Detail for ID: ${firstId} ---`);
            const details = await prisma.course.findUnique({
                where: { id: firstId },
                include: {
                    instructor: true,
                    lessons: {
                        include: {
                            attachments: true
                        }
                    }
                }
            });
            console.log('Success!', !!details);
            if (details) {
                console.log('Lessons count:', details.lessons.length);
            }
        } else {
            console.log('No courses found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
