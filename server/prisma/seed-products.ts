
import { PrismaClient, ProductType, ProductField } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding products...');

    const products = [
        {
            title: 'Hệ thống Quản lý Nhân sự (HRM) - Google Sheets',
            slug: 'hrm-google-sheets-template',
            description: 'Giải pháp quản lý nhân sự toàn diện trên Google Sheets. Bao gồm quản lý hồ sơ, chấm công, tính lương và đánh giá KPI.',
            price: new Decimal(450000),
            compareAtPrice: new Decimal(900000),
            type: ProductType.TEMPLATE,
            field: ProductField.HR,
            thumbnail: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=800&h=450&fit=crop',
            isPublished: true,
            tags: ['hr', 'dashboard', 'template', 'google-sheets']
        },
        {
            title: 'Automation Email Marketing Script',
            slug: 'email-marketing-apps-script',
            description: 'Google Apps Script tự động gửi email cá nhân hóa từ danh sách Google Sheets. Tích hợp theo dõi lượt mở và click.',
            price: new Decimal(250000),
            compareAtPrice: new Decimal(500000),
            type: ProductType.APP,
            field: ProductField.MARKETING,
            thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop',
            isPublished: true,
            tags: ['marketing', 'automation', 'apps-script']
        },
        {
            title: 'AI Content Generator Template',
            slug: 'ai-content-generator-v2',
            description: 'Module tích hợp ChatGPT vào Google Sheets để tự động tạo nội dung blog, mạng xã hội và mô tả sản phẩm.',
            price: new Decimal(350000),
            compareAtPrice: new Decimal(700000),
            type: ProductType.APP,
            field: ProductField.CREATIVE,
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
            isPublished: true,
            tags: ['ai', 'creative', 'automation']
        },
        {
            title: 'Hệ thống Quản lý Tài chính Đa kênh',
            slug: 'finance-manager-standard',
            description: 'Theo dõi dòng tiền, doanh thu, chi phí từ nhiều nguồn. Tự động tổng hợp báo cáo P&L theo tháng/quý.',
            price: new Decimal(1200000),
            compareAtPrice: new Decimal(1800000),
            type: ProductType.TEMPLATE,
            field: ProductField.BUSINESS,
            thumbnail: 'https://images.unsplash.com/photo-1454165833767-027e089d38bb?w=800&h=450&fit=crop',
            isPublished: true,
            tags: ['finance', 'business', 'template']
        },
        {
            title: 'Landing Page Builder Script',
            slug: 'landing-page-builder-script',
            description: 'Tự động tạo hàng loạt landing page chuẩn SEO từ dữ liệu cấu hình trong Google Sheets.',
            price: new Decimal(0),
            type: ProductType.APP,
            field: ProductField.CREATIVE,
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
            isPublished: true,
            tags: ['landing-page', 'tool', 'free']
        }
    ];

    for (const productData of products) {
        await prisma.product.upsert({
            where: { slug: productData.slug },
            update: productData,
            create: productData
        });
        console.log(`✅ Upserted product: ${productData.title}`);
    }

    console.log('🎉 Product seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
