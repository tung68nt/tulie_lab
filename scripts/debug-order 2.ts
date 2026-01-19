
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

async function main() {
    console.log('--- Debugging Order ---');

    // Find the order from the screenshot (or latest if not found, but let's try to search by approximate ID or just latest)
    // The ID in screenshot is ORD-1768401980803-2. 
    // This looks like a generated code. The DB ID might be different. 
    // Usually 'code' field stores this.

    const orderCode = 'ORD-1768401980803-2';

    const order = await prisma.order.findUnique({
        where: { code: orderCode },
        include: {
            items: {
                include: {
                    product: true,
                    course: true
                }
            },
            user: {
                include: {
                    subscriptions: true
                }
            }
        } as any
    });

    if (!order) {
        console.log(`Order ${orderCode} not found. Fetching latest order...`);
        const latestOrder = await prisma.order.findFirst({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                        course: true
                    }
                },
                user: {
                    include: {
                        subscriptions: true
                    }
                }
            } as any
        });

        if (!latestOrder) {
            console.log('No orders found in database.');
            return;
        }

        logOrder(latestOrder);
    } else {
        logOrder(order);
    }
}

function logOrder(order: any) {
    console.log(`Order Found: ${order.code} (ID: ${order.id})`);
    console.log(`User: ${order.user.email} (ID: ${order.user.id})`);
    console.log(`Status: ${order.status}`);

    console.log('\n--- Order Items ---');
    order.items.forEach((item: any, index: number) => {
        console.log(`Item ${index + 1}:`);
        console.log(`  - Price: ${item.price}`);
        console.log(`  - Product ID: ${item.productId}`);
        console.log(`  - Course ID: ${item.courseId}`);
        if (item.product) {
            console.log(`  - PRODUCT DETAILS:`);
            console.log(`    - Title: ${item.product.title}`);
            console.log(`    - Type: ${item.product.type}`);
        } else {
            console.log(`  - PRODUCT IS NULL`);
        }
    });

    console.log('\n--- User Subscriptions ---');
    if (order.user.subscriptions.length === 0) {
        console.log('No subscriptions found for this user.');
    } else {
        order.user.subscriptions.forEach((sub: any) => {
            console.log(`Subscription ID: ${sub.id}`);
            console.log(`  - Status: ${sub.status}`);
            console.log(`  - Dates: ${sub.startDate.toISOString()} - ${sub.endDate.toISOString()}`);
            console.log(`  - Product ID: ${sub.productId}`);
        });
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
