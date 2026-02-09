import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { loggerService } from '../services/logger.service';

/**
 * Sanitize middleware to prevent XSS
 */
export const sanitize = (options: { allowedTags?: string[], allowedAttributes?: Record<string, string[]> } = { allowedTags: [], allowedAttributes: {} }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const sanitizeObject = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = sanitizeHtml(obj[key], options);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]);
                }
            }
        };

        if (req.body) sanitizeObject(req.body);
        if (req.query) sanitizeObject(req.query);
        if (req.params) sanitizeObject(req.params);

        next();
    };
};

/**
 * Generic validation middleware for Zod schemas
 */
export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as any;

            // Override with validated data
            req.body = result.body;
            req.query = result.query;
            req.params = result.params;

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                loggerService.warn('Input validation failed', {
                    path: req.path,
                    errors: error.issues,
                    requestId: (req as any).id
                });

                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return next(error);
        }
    };
};
