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
    it('should return 200 or 503 from /api/health', async () => {
        const res = await request(app).get('/api/health');
        // Accept 200 (ok) or 503 (initializing)
        expect([200, 503]).toContain(res.status);
        expect(res.body).toHaveProperty('status');
    });

    it('should serve Swagger UI at /api/docs', async () => {
        const res = await request(app).get('/api/docs/');
        // Swagger UI redirects or returns HTML
        expect(res.status).toBe(200);
        expect(res.text).toContain('swagger');
    });
});
