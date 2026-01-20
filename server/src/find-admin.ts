
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Finding Admin User ---');
        const admin = await prisma.user.findFirst({
            where: { role: Role.ADMIN },
            select: { email: true, password: true }
        });
        console.log('Admin Email:', admin?.email);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
