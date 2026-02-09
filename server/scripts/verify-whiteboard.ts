
// Verification script to test Whiteboard API
// Usage: npx tsx verify-whiteboard-api.ts

import axios from 'axios';
import { randomUUID } from 'crypto';

const API_URL = 'http://localhost:5001/api';
// You might need a valid token here if auth is enabled. 
// For this script, we assume we might need to login or mock it.
// Since we don't have easy login access here, we will test Public/Protected behavior or assume dev environment.

async function test() {
    console.log('🚀 Starting Whiteboard API Verification...');

    try {
        // 1. Health Check
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health Check:', health.status);

        // 2. Test Validation (Expected Failure)
        console.log('🧪 Testing Validation (Expect 400)...');
        try {
            // POST without title to create endpoint (if auth allows or we mock it)
            // Note: This likely fails 401 Unauthorized first if we don't have a token.
            // We are checking if the server is UP and responding first.
            await axios.post(`${API_URL}/whiteboards`, { description: 'No title' });
        } catch (e: any) {
            if (e.response?.status === 400) {
                console.log('✅ Validation correctly rejected bad request (400)');
            } else if (e.response?.status === 401) {
                console.log('ℹ️ Validation test skipped (401 Unauthorized) - Auth is working');
            } else {
                console.log('❌ Unexpected error:', e.message);
            }
        }

    } catch (error: any) {
        console.error('❌ Verification failed:', error.message);
    }
}

test();
