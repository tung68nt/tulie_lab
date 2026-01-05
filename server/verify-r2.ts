// Load env vars first
if (!process.env.R2_ACCOUNT_ID) {
    require('dotenv').config();
}

import { storageService } from './src/services/storage.service';
import fs from 'fs';
import path from 'path';

async function verifyR2() {
    console.log('🚀 Starting R2 Verification...');

    // 1. Create a dummy test file
    const testContent = 'Hello R2 from Tulie Lab! ' + new Date().toISOString();
    const testFileName = 'test-r2-upload.txt';
    const testFilePath = path.join(__dirname, testFileName);
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Created test file:', testFilePath);

    try {
        // 2. Upload to R2
        console.log('Uploading to R2...');
        const r2Key = `test/${testFileName}`;
        const url = await storageService.uploadFile(testFilePath, r2Key, 'text/plain');
        console.log('✅ Upload successfully!');
        console.log('👉 Public URL:', url);

        // 3. Clean up
        fs.unlinkSync(testFilePath);
        console.log('✅ Cleaned up local file');

        // 4. Delete from R2 (optional, keeping it to verify manually if needed)
        // await storageService.deleteFile(r2Key);
        // console.log('✅ Deleted from R2');

    } catch (error) {
        console.error('❌ Verification failed:', error);
    }
}

// Mock env vars for script if running directly via ts-node
if (!process.env.R2_ACCOUNT_ID) {
    require('dotenv').config();
}

verifyR2();
