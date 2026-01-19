const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PAGES_TO_SEED = [
    {
        slug: 'vibe-coding',
        title: 'Vibe Coding',
        description: 'Học lập trình theo phong cách mới',
        sections: JSON.stringify([
            { id: 'hero-1', type: 'hero', title: 'Vibe Coding', subtitle: 'Học lập trình theo phong cách mới', isVisible: true, order: 1 }
        ]),
        type: 'LANDING'
    },
    {
        slug: 'ai',
        title: 'Ứng dụng AI',
        description: 'Khám phá sức mạnh AI',
        sections: JSON.stringify([
            { id: 'hero-1', type: 'hero', title: 'Ứng dụng AI', subtitle: 'Khám phá sức mạnh trí tuệ nhân tạo', isVisible: true, order: 1 }
        ]),
        type: 'LANDING'
    },
    {
        slug: 'google-sheets',
        title: 'Google Sheets & Apps Script',
        description: 'Làm chủ Google Sheets',
        sections: JSON.stringify([
            { id: 'hero-1', type: 'hero', title: 'Google Sheets & Apps Script', subtitle: 'Tự động hóa công việc', isVisible: true, order: 1 }
        ]),
        type: 'LANDING'
    },
    {
        slug: 'pricing',
        title: 'Bảng giá & Gói thành viên',
        description: 'Các gói thành viên',
        sections: JSON.stringify([
            { id: 'hero-1', type: 'hero', title: 'Bảng giá', subtitle: 'Chọn gói phù hợp với bạn', isVisible: true, order: 1 }
        ]),
        type: 'LANDING'
    },
    {
        slug: 'calendar',
        title: 'Lịch hoạt động',
        description: 'Lịch sự kiện và khóa học',
        sections: JSON.stringify([
            { id: 'hero-1', type: 'hero', title: 'Lịch hoạt động', subtitle: 'Đừng bỏ lỡ các sự kiện nổi bật', isVisible: true, order: 1 }
        ]),
        type: 'LANDING'
    }
];

async function main() {
    console.log('Seeding landing pages with raw SQL...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50));

    for (const page of PAGES_TO_SEED) {
        try {
            // Check if exists
            const existing = await prisma.$queryRawUnsafe(
                `SELECT id FROM "LandingPage" WHERE slug = $1`,
                page.slug
            );

            if (existing && (existing as any[]).length > 0) {
                // Update
                await prisma.$executeRawUnsafe(
                    `UPDATE "LandingPage" SET title = $1, description = $2, sections = $3::jsonb, "updatedAt" = NOW() WHERE slug = $4`,
                    page.title, page.description, page.sections, page.slug
                );
                console.log(`Updated: ${page.slug}`);
            } else {
                // Insert
                await prisma.$executeRawUnsafe(
                    `INSERT INTO "LandingPage" (id, slug, title, description, sections, "isActive", "createdAt", "updatedAt", type)
           VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb, true, NOW(), NOW(), 'LANDING')`,
                    page.slug, page.title, page.description, page.sections
                );
                console.log(`Created: ${page.slug}`);
            }
        } catch (err: any) {
            console.error(`Error for ${page.slug}:`, err.message);
        }
    }

    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
