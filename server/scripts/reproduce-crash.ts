import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

// Mock dependencies for UserService
// We can't easily instantiate a full UserService with DI container here without complex setup
// So we replicate the "getUserDetailsForAdmin" logic directly, OR we try to import it.
// Importing it requires the container infrastructure which might fail in a standalone script.
// BETTER APPROACH: Simulate the exact queries made in getUserDetailsForAdmin to see which one breaks.

async function main() {
    console.log('🚀 Diagnosing User Detail Error...');

    // 1. Find a candidate user (preferably one with data)
    const user = await prisma.user.findFirst({
        where: { role: 'USER' },
        include: { orders: true, enrollments: true }
    });

    if (!user) {
        console.log('No users found in DB.');
        return;
    }

    console.log(`Testing with User ID: ${user.id} (${user.email})`);

    // 2. Replicate Query 1: Main User Fetch
    console.log('Step 1: Fetching main user profile...');
    try {
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                profile: true,
                subscriptions: {
                    include: { product: true },
                    orderBy: { endDate: 'desc' }
                },
                enrollments: {
                    include: { course: { select: { id: true, title: true, slug: true, thumbnail: true } } },
                    orderBy: { createdAt: 'desc' }
                },
                orders: {
                    include: {
                        items: {
                            include: {
                                course: { select: { id: true, title: true } },
                                product: {
                                    include: {
                                        versions: { orderBy: { createdAt: 'desc' }, take: 1 }
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                progress: {
                    select: { lessonId: true, isCompleted: true, updatedAt: true },
                    orderBy: { updatedAt: 'desc' },
                    take: 100
                }
            }
        });
        console.log('✅ Main user fetch successful.');
    } catch (e: any) {
        console.error('❌ Main user fetch FAILED:', e);
    }

    // 3. Replicate Query 2: Activities & Security
    console.log('Step 2: Fetching usage logs...');
    try {
        await Promise.all([
            prisma.activityLog.findMany({ where: { userId: user.id }, take: 10 }),
            prisma.securityLog.findMany({ where: { userId: user.id }, take: 10 })
        ]);
        console.log('✅ Logs fetch successful.');
    } catch (e: any) {
        console.error('❌ Logs fetch FAILED:', e);
    }

    // 4. Replicate Logic: Transactions (This is the most likely suspect based on recent changes)
    console.log('Step 3: Fetching transactions...');
    try {
        const rawOrders = (await prisma.order.findMany({ where: { userId: user.id } })) || [];
        const orderCodes = rawOrders.map(o => o.code).filter(Boolean) as string[]; // Assertion

        console.log(`Found order codes: ${orderCodes.join(', ')}`);

        if (orderCodes.length > 0) {
            const txs = await prisma.paymentTransaction.findMany({
                where: { code: { in: orderCodes } },
                orderBy: { createdAt: 'desc' }
            });
            console.log(`✅ Transactions fetch successful. Found ${txs.length} txs.`);
        } else {
            console.log('✅ No transactions to fetch (no codes).');
        }
    } catch (e: any) {
        console.error('❌ Transactions fetch FAILED:', e);
    }

    // 5. Replicate Logic: Lesson Count
    console.log('Step 4: Counting lessons...');
    try {
        const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id } });
        const courseIds = enrollments.map(e => e.courseId);
        if (courseIds.length > 0) {
            await prisma.lesson.count({ where: { courseId: { in: courseIds } } });
            console.log('✅ Lesson count successful.');
        }
    } catch (e: any) {
        console.error('❌ Lesson count FAILED:', e);
    }

    console.log('Diagnostics complete.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
