import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// CONFIGURE YOUR SMTP HERE
const SMTP_CONFIG = {
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: 'your-email@gmail.com',
    smtp_pass: 'your-app-password',
    smtp_secure: 'false',
    admin_notification_email: 'your-email@gmail.com',
};

async function main() {
    console.log('Setting up SMTP configuration in database...');

    for (const [key, value] of Object.entries(SMTP_CONFIG)) {
        await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: {
                key,
                value,
                type: 'text'
            }
        });
        console.log(`- Upserted ${key}`);
    }

    console.log('\nSMTP Setup Complete!');
    console.log('You can now use the Email Service with these settings.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
