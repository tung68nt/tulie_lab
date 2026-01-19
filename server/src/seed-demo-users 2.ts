
import 'dotenv/config';
import { PrismaClient, ProductType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
    console.log('🌱 Seeding Demo Users...\n');

    const password = await bcrypt.hash('123456', 10);

    // 1. Create Products
    console.log('📦 Ensuring Products exist...');

    // Yearly Subscription Product
    const subProduct = await prisma.product.upsert({
        where: { slug: 'yearly-shop-membership' },
        update: {},
        create: {
            title: 'Gói Thành viên Năm (Shop)',
            slug: 'yearly-shop-membership',
            description: 'Truy cập không giới hạn kho tài nguyên số Tulie Academy trong 1 năm.',
            price: 1990000,
            type: 'SUBSCRIPTION',
            isPublished: true,
            thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
        }
    });

    // Digital Product (Template)
    const templateProduct = await prisma.product.upsert({
        where: { slug: 'premium-business-template' },
        update: {},
        create: {
            title: 'Premium Business Landing Page Template',
            slug: 'premium-business-template',
            description: 'Template Landing Page chuyên nghiệp cho doanh nghiệp, tối ưu chuyển đổi cao.',
            price: 299000,
            type: 'TEMPLATE',
            isPublished: true,
            fileUrl: 'https://example.com/download/template.zip',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        }
    });

    // 2. Create "Single Purchase" User
    console.log('\n👤 Creating Demo User: Single Purchase...');
    const singleUserEmail = 'demo_single@tulielab.vn';

    // Delete if exists to reset
    await prisma.user.deleteMany({ where: { email: { in: [singleUserEmail, 'demo_member@tulielab.vn'] } } });

    const singleUser = await prisma.user.create({
        data: {
            email: singleUserEmail,
            password: password,
            role: 'USER',
            isActive: true,
            profile: {
                create: {
                    name: 'Demo Single User',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
                }
            }
        }
    });

    // Create PAID Order for Single Product
    await prisma.order.create({
        data: {
            userId: singleUser.id,
            code: `ORD-${Date.now()}-1`,
            amount: templateProduct.price,
            status: 'PAID',
            items: {
                create: {
                    productId: templateProduct.id,
                    price: templateProduct.price
                }
            }
        }
    });
    console.log(`   ✅ Created ${singleUserEmail} with purchased product: ${templateProduct.title}`);


    // 3. Create "Member" User
    console.log('\n👤 Creating Demo User: Member...');
    const memberEmail = 'demo_member@tulielab.vn';

    const memberUser = await prisma.user.create({
        data: {
            email: memberEmail,
            password: password,
            role: 'USER',
            isActive: true,
            profile: {
                create: {
                    name: 'Demo Member User',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
                }
            }
        }
    });

    // Create PAID Order for Subscription
    await prisma.order.create({
        data: {
            userId: memberUser.id,
            code: `ORD-${Date.now()}-2`,
            amount: subProduct.price,
            status: 'PAID',
            items: {
                create: {
                    productId: subProduct.id,
                    price: subProduct.price
                }
            }
        }
    });

    // Create Active Subscription
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    await prisma.subscription.create({
        data: {
            userId: memberUser.id,
            productId: subProduct.id,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: oneYearFromNow
        }
    });
    console.log(`   ✅ Created ${memberEmail} with active subscription until ${oneYearFromNow.toISOString()}`);

    console.log('\n🎉 Demo users created successfully!');
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
