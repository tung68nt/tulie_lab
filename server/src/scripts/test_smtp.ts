import { emailService } from '../services/email.service';

async function main() {
    const result = await emailService.verifyConnection();
    if (result) {
        console.log('✅ SMTP Connection Successful!');
    } else {
        console.error('❌ SMTP Connection Failed! Please check your credentials in the database or .env');
    }
}

main().catch(console.error);
