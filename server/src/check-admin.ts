
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
    const email = 'admin@tulie.vn';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
    });

    if (!user) {
        console.log(`❌ User ${email} NOT FOUND`);
    } else {
        console.log(`✅ User found: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
    }
}

checkAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
