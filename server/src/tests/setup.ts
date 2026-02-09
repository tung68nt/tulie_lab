import { vi, beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../.env.test') });

beforeAll(() => {
    // Mock console to keep test output clean, or keep it for debugging
    // vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
    vi.restoreAllMocks();
});
