import dotenv from 'dotenv';
import path from 'path';
// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@tulie.vn';
    const password = 'password123';

    console.log(`Creating/Updating admin user...`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upsert user: Create if new, Update if exists
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Tulie Admin'
        },
        create: {
            email,
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Tulie Admin'
        }
    });

    console.log(`\nSUCCESS: Admin user ready.`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${user.role}`);
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
