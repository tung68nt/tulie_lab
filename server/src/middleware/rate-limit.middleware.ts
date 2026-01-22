import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

/**
 * Rate limiting configuration for different endpoint types
 */

// General API rate limiting - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    // Use Redis if available, fallback to memory store
    ...(redis ? {
        store: new RedisStore({
            // @ts-expect-error - RedisStore types don't match perfectly
            client: redis,
            prefix: 'rl:api:',
        })
    } : {})
});

// Auth endpoints - stricter limits (5 requests per 15 minutes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful auth requests
    ...(redis ? {
        store: new RedisStore({
            // @ts-expect-error - RedisStore types don't match perfectly
            client: redis,
            prefix: 'rl:auth:',
        })
    } : {})
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
    ...(redis ? {
        store: new RedisStore({
            // @ts-expect-error - RedisStore types don't match perfectly
            client: redis,
            prefix: 'rl:webhook:',
        })
    } : {})
});

// Password reset - very strict (3 requests per hour)
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { message: 'Too many password reset attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    ...(redis ? {
        store: new RedisStore({
            // @ts-expect-error - RedisStore types don't match perfectly
            client: redis,
            prefix: 'rl:reset:',
        })
    } : {})
});

// Email sending - moderate limits (10 per hour)
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: 'Too many email requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    ...(redis ? {
        store: new RedisStore({
            // @ts-expect-error - RedisStore types don't match perfectly
            client: redis,
            prefix: 'rl:email:',
        })
    } : {})
});
