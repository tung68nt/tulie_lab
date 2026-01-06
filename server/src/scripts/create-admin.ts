
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function createAdmin() {
    const email = process.argv[2] || 'admin@thelab.tulie.vn';
    const password = process.argv[3] || 'TulieLab@2024!Admin';
    const name = 'Super Admin';

    console.log(`Creating Admin URL...`);
    console.log(`Email: ${email}`);

    try {
        // Check if exists
        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            console.log('⚠️ User already exists. Better update role manually or delete first.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
                bio: 'System Administrator',
                headline: 'The Tulie Lab',
                emailVerified: new Date()
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('-----------------------------------');
        console.log('👉 Please login at /login');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
