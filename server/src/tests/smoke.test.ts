import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

// Mock heavy dependencies before importing app
vi.mock('../src/bootstrap', () => ({
    bootstrapDI: vi.fn(),
}));
vi.mock('../src/modules/system/whiteboard/whiteboard.gateway', () => ({
    WhiteboardGateway: vi.fn(),
}));

import { app } from '../index';

describe('API Smoke Test', () => {
    it('should return 200 OK from /api/health', async () => {
        // Note: Since the app starts asynchronously, we might need to wait 
        // or mock the initialization if it blocks.
        // However, /api/health is registered first in index.ts.
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    it('should serve Swagger UI at /api/docs', async () => {
        const res = await request(app).get('/api/docs/');
        // Swagger UI redirects or returns HTML
        expect(res.status).toBe(200);
        expect(res.text).toContain('swagger');
    });
});
