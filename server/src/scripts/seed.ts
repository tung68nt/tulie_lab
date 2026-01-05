
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const courses = [
        {
            title: 'Fullstack Next.js 14',
            slug: 'fullstack-nextjs-14',
            description: 'Xây dựng một hệ thống LMS hoàn chỉnh từ đầu với Next.js 14, Prisma, Stripe và Tailwind.',
            price: 1200000,
            isPublished: true,
            lessons: {
                create: [
                    { title: 'Giới thiệu', slug: 'intro', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                    { title: 'Thiết lập dự án', slug: 'setup', position: 2, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
                ]
            }
        },
        {
            title: 'React Mastery',
            slug: 'react-mastery',
            description: 'Đi sâu vào React hooks, patterns và tối ưu hóa hiệu năng.',
            price: 800000,
            isPublished: true,
            lessons: {
                create: [
                    { title: 'Chuyên sâu về Hooks', slug: 'hooks', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
                ]
            }
        },
        {
            title: 'Node.js Microservices',
            slug: 'nodejs-microservices',
            description: 'Mở rộng backend với kiến trúc microservices sử dụng NestJS và RabbitMQ.',
            price: 0,
            isPublished: true,
            lessons: {
                create: [
                    { title: 'Microservices 101', slug: 'microservices-101', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
                ]
            }
        },
    ];

    for (const course of courses) {
        const existing = await prisma.course.findUnique({ where: { slug: course.slug } });
        if (!existing) {
            await prisma.course.create({ data: course });
            console.log(`Created course: ${course.title}`);
        } else {
            console.log(`Course exists: ${course.title}`);
        }
    }

    // Seed System Settings for Home Page
    const homeContent = {
        home_hero_title: 'Làm chủ Tương lai Công nghệ',
        home_hero_subtitle: 'Khai phá tiềm năng của bạn với các khóa học chuyên sâu về AI, Fullstack Development và Vibe Coding.',
        home_why_us_title: 'Nền tảng tốt nhất cho việc học ứng dụng.',
        home_why_us_content: 'Chúng tôi tập trung vào nội dung chất lượng cao, thực tế mà bạn có thể sử dụng ngay trong các dự án và sự nghiệp của mình.',
    };

    await prisma.systemSetting.upsert({
        where: { key: 'home_hero_title' },
        update: {},
        create: { key: 'home_hero_title', value: homeContent.home_hero_title, type: 'text' }
    });
    // Add others if needed...

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
