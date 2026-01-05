import dotenv from 'dotenv';
import path from 'path';
// Load .env from server directory (one level up from scripts)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@tulie.vn';
    console.log(`Searching for user: ${email}...`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log(`User ${email} not found.`);
        // List all users to help debug
        const allUsers = await prisma.user.findMany();
        console.log('Available users:', allUsers.map(u => u.email));
        return;
    }

    const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });

    console.log(`User ${email} updated to ADMIN successfully.`);
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
