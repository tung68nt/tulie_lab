import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding blog categories and updating posts...');

    // 1. Create Categories
    const categories = [
        { name: 'Vibe Coding', slug: 'vibe-coding' },
        { name: 'Trí tuệ nhân tạo (AI)', slug: 'ai' },
        { name: 'Kỹ năng lập trình', slug: 'programming-skills' },
        { name: 'Kinh nghiệm thực chiến', slug: 'real-world-experience' }
    ];

    const createdCategories = [];
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        });
        createdCategories.push(category);
        console.log(`✅ Category: ${category.name}`);
    }

    // 2. Assign categories to existing blog posts
    const posts = await prisma.blogPost.findMany();

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const categoryId = createdCategories[i % createdCategories.length].id;

        await prisma.blogPost.update({
            where: { id: post.id },
            data: { categoryId }
        });
        console.log(`✅ Assigned category to post: ${post.title}`);
    }

    console.log('🎉 Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
