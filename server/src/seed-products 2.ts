import { PrismaClient, ProductType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding products...');

    const products = [
        {
            title: 'Vibe Portfolio Template',
            slug: 'vibe-portfolio-template',
            description: 'Mẫu Portfolio cá nhân phong cách "Vibe Coding" tối giản, hiện đại với hiệu ứng glassmorphism và tối ưu hóa SEO. Hoàn hảo cho các Developer và Creator.',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
            price: 499000,
            compareAtPrice: 990000,
            type: ProductType.TEMPLATE,
            isPublished: true,
            tags: ['React', 'Next.js', 'Tailwind', 'Vibe'],
            previewUrl: 'https://vibe-portfolio-demo.vercel.app'
        },
        {
            title: 'SaaS Dashboard UI Kit',
            slug: 'saas-dashboard-ui-kit',
            description: 'Bộ giao diện Dashboard quản trị hệ thống SaaS chuyên nghiệp. Bao gồm 50+ component, biểu đồ real-time và hệ thống Design System đồng nhất.',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
            price: 890000,
            compareAtPrice: 1500000,
            type: ProductType.TEMPLATE,
            isPublished: true,
            tags: ['Dashboard', 'Admin', 'UI Kit', 'Saas'],
            previewUrl: 'https://saas-dashboard-demo.vercel.app'
        },
        {
            title: 'E-commerce Mobile App Script',
            slug: 'ecommerce-mobile-app-script',
            description: 'Source code hoàn chỉnh ứng dụng thương mại điện tử đa nền tảng (iOS & Android). Tích hợp thanh toán, giỏ hàng và quản lý đơn hàng.',
            thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop',
            price: 2490000,
            compareAtPrice: 3500000,
            type: ProductType.APP,
            isPublished: true,
            tags: ['React Native', 'Mobile', 'Ecommerce'],
            previewUrl: 'https://expo.dev/@demo/ecommerce-vibe'
        },
        {
            title: 'Vibe Blog Starter Kit',
            slug: 'vibe-blog-starter-kit',
            description: 'Nền tảng Blog cá nhân mạnh mẽ với MDX, hệ thống tag thông minh và giao diện đọc bài cực kỳ tinh tế. Tích hợp sẵn Newsletter và Analytics.',
            thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
            price: 590000,
            compareAtPrice: 1200000,
            type: ProductType.TEMPLATE,
            isPublished: true,
            tags: ['Next.js', 'MDX', 'Blog', 'Vibe'],
            previewUrl: 'https://vibe-blog-demo.vercel.app'
        },
        {
            title: 'Ultimate Landing Page License',
            slug: 'ultimate-landing-page-license',
            description: 'Bản quyền sử dụng trọn đời bộ Landing Page chuyển đổi cao cho Startup. Bao gồm thiết kế độc quyền, mã nguồn tối ưu và hỗ trợ lắp đặt.',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
            price: 1990000,
            compareAtPrice: 4500000,
            type: ProductType.LICENSE,
            isPublished: true,
            tags: ['License', 'Marketing', 'Landing Page'],
            previewUrl: 'https://thelab.tulie.vn'
        },
        {
            title: 'AI Avatar Generator Script',
            slug: 'ai-avatar-generator-script',
            description: 'Hệ thống tạo Avatar bằng AI tích hợp Stable Diffusion. Cho phép người dùng tạo ảnh chân dung nghệ thuật chỉ từ vài tấm ảnh chụp.',
            thumbnail: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?q=80&w=1000&auto=format&fit=crop',
            price: 3500000,
            compareAtPrice: 7000000,
            type: ProductType.APP,
            isPublished: true,
            tags: ['AI', 'Python', 'React', 'Avatar'],
            previewUrl: 'https://ai-avatar-demo.vercel.app'
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: product,
            create: product,
        });
    }

    console.log('Products seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
