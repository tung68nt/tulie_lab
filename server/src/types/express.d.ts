import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Ideally this should be a specific User interface, but 'any' is better than casting everywhere for now
            id?: string; // Request ID
        }
    }
}
