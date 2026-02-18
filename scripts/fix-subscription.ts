
import { PrismaClient } from '@prisma/client';
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const prisma = new PrismaClient() as any;

async function main() {
    console.log('--- Fixing User Subscription ---');

    const orderCode = 'ORD-1768401980803-2';

    // 1. Find the order
    const order = await prisma.order.findUnique({
        where: { code: orderCode },
        include: { user: true, items: { include: { product: true } } }
    });

    if (!order) {
        console.log(`Order ${orderCode} not found. Cannot fix.`);
        // Try finding latest paid order
        const latestInfo = await prisma.order.findFirst({
            where: { status: 'COMPLETED' }, // or PAID
            orderBy: { createdAt: 'desc' },
            include: { user: true, items: true }
        });
        if (latestInfo) {
            console.log(`Found latest completed order: ${latestInfo.code}`);
            // Proceed with this user
            await fixUser(latestInfo.user.id);
        }
        return;
    }

    console.log(`Found order ${order.code} for user ${order.user.email}`);
    await fixUser(order.user.id);
}

async function fixUser(userId: string) {
    // 2. Check if subscription exists
    const existing = await prisma.subscription.findFirst({
        where: {
            userId: userId,
            status: 'ACTIVE',
            endDate: { gt: new Date() }
        }
    });

    if (existing) {
        console.log('User already has an active subscription.');
    } else {
        console.log('Creating manual subscription for user...');

        // Find a subscription product or create one
        let product = await prisma.product.findFirst({
            where: { type: 'SUBSCRIPTION' }
        });

        if (!product) {
            console.log('No subscription product found. Creating one...');
            product = await prisma.product.create({
                data: {
                    title: 'Gói Hội Viên Premium (Fix)',
                    slug: 'membership-premium-fix',
                    price: 1990000,
                    type: 'SUBSCRIPTION',
                    status: 'PUBLISHED'
                }
            });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        await prisma.subscription.create({
            data: {
                userId: userId,
                productId: product.id,
                startDate: startDate,
                endDate: endDate,
                status: 'ACTIVE'
            }
        });
        console.log('Subscription created successfully!');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
