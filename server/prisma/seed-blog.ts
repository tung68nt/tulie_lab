import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const BLOG_POSTS = [
    {
        title: "Tăng năng suất 200% với AI Automation",
        slug: "tang-nang-suat-200-voi-ai-automation",
        excerpt: "Khám phá cách sử dụng công cụ AI để tự động hóa các tác vụ lặp lại hàng ngày, giúp bạn có thêm thời gian cho những việc quan trọng hơn.",
        content: `
# Tăng năng suất làm việc với AI

Trong kỷ nguyên số, **AI Automation** không còn là khái niệm xa lạ. 

## Tại sao cần Automation?
- Tiết kiệm thời gian
- Giảm sai sót
- Tập trung vào sáng tạo

## Các công cụ phổ biến
1. Zapier
2. Make (Integromat)
3. n8n

Hãy bắt đầu ngay hôm nay!
        `,
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        isPublished: true,
        publishedAt: new Date(),
        author: {
            create: {
                name: "Admin Tulie",
                email: "admin@tulie.vn",
                role: "ADMIN"
            }
        },
        category: {
            create: {
                name: "AI & Technology",
                slug: "ai-technology"
            }
        }
    },
    {
        title: "Hướng dẫn Vibe Coding cho người mới",
        slug: "huong-dan-vibe-coding-cho-nguoi-moi",
        excerpt: "Vibe Coding là gì? Tại sao nó lại trở thành xu hướng lập trình mới? Bài viết này sẽ giải đáp tất cả.",
        content: `
# Vibe Coding là gì?

Vibe Coding là phương pháp lập trình tập trung vào trạng thái dòng chảy (Flow State).

## Các yếu tố chính
- Môi trường làm việc (Setup)
- Âm nhạc (Lo-fi, Synthwave)
- Công cụ tối ưu (Cursor, VS Code themes)

## Lợi ích
Giúp lập trình viên giảm stress và tăng sự sáng tạo.
        `,
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        isPublished: true,
        publishedAt: new Date()
    }
];

async function main() {
    console.log('🌱 Seeding blog posts...');

    // Ensure author exists if we are connecting
    // For simplicity in this seed, we try to create users/categories if they unique constraints allow,
    // or we just reuse existing ones.
    // However, finding existing relations is safer.

    // 1. Get or Create Author (Instructor)
    let author = await prisma.instructor.findFirst({ where: { slug: 'admin-tulie' } });
    if (!author) {
        author = await prisma.instructor.create({
            data: {
                name: "Admin Tulie",
                slug: "admin-tulie",
                title: "Expert",
                bio: "Official Admin Account",
                avatar: "https://github.com/shadcn.png"
            }
        });
        console.log('Created instructor');
    }

    // 2. Get or Create Category
    let category = await prisma.category.findFirst({ where: { slug: 'ai-technology' } });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "AI & Technology",
                slug: "ai-technology"
            }
        });
        console.log('Created category');
    }

    for (const post of BLOG_POSTS) {
        // Remove nested creates from the const to manually handle relations
        const { author: _a, category: _c, ...postData } = post as any;

        await prisma.blogPost.upsert({
            where: { slug: postData.slug },
            update: {
                ...postData,
                authorId: author.id,
                categoryId: category.id
            },
            create: {
                ...postData,
                authorId: author.id,
                categoryId: category.id
            }
        });
        console.log(`✅ Upserted post: ${postData.title}`);
    }

    console.log('🎉 Blog seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Blog seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
