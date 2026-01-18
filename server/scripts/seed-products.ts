
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config({ path: '/Users/tungnguyen/Documents/code/academy_tulie/server/.env' });

const prisma = new PrismaClient() as any;

async function main() {
    console.log('Using database URL:', process.env.DATABASE_URL);

    // 1. Create Digital Products
    const digitalProducts = [
        {
            title: 'Bộ Template React Admin Dashboard',
            slug: 'react-admin-dashboard-template',
            shortDescription: 'Template quản trị chuyên nghiệp với React & Tailwind.',
            description: 'Giao diện quản trị hiện đại, đầy đủ tính năng, dark mode, responsive.',
            price: 499000,
            salePrice: 299000,
            thumbnail: 'https://ui-avatars.com/api/?name=Admin+Template&background=0D8ABC&color=fff&size=512',
            type: 'DIGITAL',
            versions: [
                { version: '1.0.0', changelog: 'Initial release', fileUrl: 'https://example.com/files/admin-v1.zip' },
                { version: '1.1.0', changelog: 'Added dark mode support', fileUrl: 'https://example.com/files/admin-v1.1.zip' },
                { version: '2.0.0', changelog: 'Upgraded to Next.js 14', fileUrl: 'https://example.com/files/admin-v2.zip' }
            ]
        },
        {
            title: 'Ebook: Làm chủ Next.js 14',
            slug: 'mastering-nextjs-14',
            shortDescription: 'Sách hướng dẫn chi tiết từ cơ bản đến nâng cao.',
            description: 'Học Next.js 14 Server Actions, App Router, và tối ưu hiệu suất.',
            price: 199000,
            salePrice: 99000,
            thumbnail: 'https://ui-avatars.com/api/?name=NextJS+Ebook&background=000&color=fff&size=512',
            type: 'DIGITAL',
            versions: [
                { version: '1.0', changelog: 'First edition', fileUrl: 'https://example.com/files/ebook-v1.pdf' }
            ]
        },
        {
            title: 'Icon Set Premium 3D',
            slug: 'premium-3d-icons',
            shortDescription: 'Bộ 100+ icon 3D chất lượng cao.',
            description: 'Định dạng PNG, BLEND. Phù hợp cho thiết kế UI/UX hiện đại.',
            price: 350000,
            salePrice: null,
            thumbnail: 'https://ui-avatars.com/api/?name=3D+Icons&background=ff00ff&color=fff&size=512',
            type: 'DIGITAL',
            versions: [
                { version: '1.0', changelog: 'Release 100 icons', fileUrl: 'https://example.com/files/icons-v1.zip' }
            ]
        }
    ];

    for (const p of digitalProducts) {
        const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
        if (!existing) {
            console.log(`Creating product: ${p.title}`);
            const product = await prisma.product.create({
                data: {
                    title: p.title,
                    slug: p.slug,
                    description: p.description,
                    price: p.price,
                    compareAtPrice: p.salePrice,
                    thumbnail: p.thumbnail,
                    type: p.type as any,
                    status: 'PUBLISHED',
                    tags: ['PROMOTED']
                }
            });

            // Add versions
            for (const v of p.versions) {
                await prisma.productVersion.create({
                    data: {
                        productId: product.id,
                        version: v.version,
                        changelog: v.changelog,
                        fileUrl: v.fileUrl
                    }
                });
            }
        } else {
            console.log(`Product already exists: ${p.title}`);
        }
    }

    // 2. Ensure Subscription Product Exists
    const subProduct = {
        title: 'Gói Hội Viên Premium (1 Năm)',
        slug: 'membership-premium-1-year',
        price: 1990000,
        type: 'SUBSCRIPTION',
    };

    const existingSub = await prisma.product.findFirst({
        where: { type: 'SUBSCRIPTION' }
    });

    if (!existingSub) {
        console.log(`Creating Subscription Product: ${subProduct.title}`);
        await prisma.product.create({
            data: {
                title: subProduct.title,
                slug: subProduct.slug,
                shortDescription: 'Truy cập không giới hạn tất cả sản phẩm số.',
                description: 'Quyền lợi hội viên Premium 1 năm.',
                price: subProduct.price,
                type: 'SUBSCRIPTION',
                status: 'PUBLISHED',
                thumbnail: 'https://ui-avatars.com/api/?name=VIP&background=FFD700&color=000&size=512'
            }
        });
    } else {
        console.log(`Subscription Product already exists: ${existingSub.title}`);
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
