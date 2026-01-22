import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Validation middleware factory
 * Validates request body, params, or query against a Zod schema
 */
export const validate = (schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
            const validated = schema.parse(data);

            // Replace the original data with validated data
            if (source === 'body') {
                req.body = validated;
            } else if (source === 'params') {
                req.params = validated as any;
            } else {
                req.query = validated as any;
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return res.status(500).json({ message: 'Internal validation error' });
        }
    };
};

/**
 * Common validation schemas
 */

// Pagination
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

// ID validation
export const idParamSchema = z.object({
    id: z.string().min(1, 'ID is required'),
});

// Email validation
export const emailSchema = z.string().email('Invalid email format');

// Password validation (min 8 chars, at least one letter and one number)
export const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

// Phone number validation (Vietnamese format)
export const phoneSchema = z.string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, 'Invalid phone number format');

// Order code validation (10 alphanumeric characters)
export const orderCodeSchema = z.string()
    .regex(/^[A-Z0-9]{10}$/, 'Invalid order code format');

/**
 * Sanitization helpers
 */

// Remove potentially dangerous HTML/script tags
export const sanitizeHtml = (str: string): string => {
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers
        .trim();
};

// Sanitize object by removing dangerous HTML from all string fields
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeHtml(sanitized[key]);
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeObject(sanitized[key]);
        }
    }
    return sanitized;
};

/**
 * Middleware to sanitize request body
 */
export const sanitize = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
};
