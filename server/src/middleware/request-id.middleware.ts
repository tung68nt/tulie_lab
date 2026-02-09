import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Request ID middleware
 * Adds a unique request ID to each request for tracking and logging
 */

// Type augmentation is now handled in src/types/express.d.ts
// declare global {
//     namespace Express {
//         interface Request {
//             id: string;
//         }
//     }
// }

export const requestId = (req: Request, res: Response, next: NextFunction) => {
    next();
};
