import prisma from '../src/config/prisma';
import { PrismaUserRepository } from '../src/modules/system/users/repositories/prisma-user.repository';
import { UserService } from '../src/modules/system/users/users.service';

const userId = '41d0e279-5e2d-4003-827b-fa90128271e4';

async function main() {
    console.log(`Checking user: ${userId}`);
    const userRepository = new PrismaUserRepository();
    const userService = new UserService(userRepository);

    try {
        const user = await userService.getUserDetailsForAdmin(userId);
        if (!user) {
            console.log('User not found');
            // Try to fetch a user with enrollments or orders
            const dataUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { enrollments: { some: {} } },
                        { orders: { some: {} } }
                    ]
                }
            });
            if (dataUser) {
                console.log(`Fallback: Testing with user with data: ${dataUser.id}`);
                const fallbackUser = await userService.getUserDetailsForAdmin(dataUser.id);
                console.log('Fallback user stats:', fallbackUser?.stats);
            } else {
                const anyUser = await prisma.user.findFirst();
                if (anyUser) {
                    const fallbackUser = await userService.getUserDetailsForAdmin(anyUser.id);
                    console.log('Fallback user (no data) stats:', fallbackUser?.stats);
                }
            }
        } else {
            console.log('User found:', user.email);
            console.log('Stats:', JSON.stringify(user.stats, null, 2));
        }
    } catch (error: any) {
        console.error('CRASH DETECTED:');
        console.error(error);
        if (error.stack) console.error(error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

main();
