import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Request ID middleware
 * Adds a unique request ID to each request for tracking and logging
 */

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const requestId = (req: Request, res: Response, next: NextFunction) => {
    // Use existing request ID from header if available, otherwise generate new one
    const existingId = req.headers['x-request-id'] as string;
    const id = existingId || randomUUID();

    req.id = id;
    res.setHeader('X-Request-Id', id);

    next();
};
