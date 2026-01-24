import rateLimit from 'express-rate-limit';

/**
 * Rate limiting configuration for different endpoint types
 * Using in-memory store for now (TODO: Add Redis store for production)
 */

// General API rate limiting - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
});

// Auth endpoints - stricter limits (5 requests per 15 minutes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful auth requests
    validate: { trustProxy: false },
});

// Webhook endpoints - moderate limits (30 requests per minute)
// Webhooks can have bursts but shouldn't be abused
export const webhookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: { success: false, message: 'Too many webhook requests' },
    standardHeaders: true,
    legacyHeaders: false,
    // Key by IP and optionally API key
    keyGenerator: (req) => {
        const apiKey = req.headers.authorization || req.headers['x-api-key'];
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        return apiKey ? `${ip}:${apiKey}` : ip;
    },
    validate: { trustProxy: false },
});

// Password reset - very strict (3 requests per hour)
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { message: 'Too many password reset attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
});

// Email sending - moderate limits (10 per hour)
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: 'Too many email requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
});
