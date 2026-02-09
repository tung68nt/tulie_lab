import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisService from '../services/redis.service';

/**
 * Rate limiting configuration for different endpoint types
 * Using Redis store for production scalability
 */

const createRedisStore = () => {
    return new RedisStore({
        // @ts-expect-error - ioredis client compatibility
        sendCommand: (...args: string[]) => redisService.getClient().call(...args),
        prefix: 'rl:prod:', // Standard prefix for sharing across instances
    });
};

// General API rate limiting - 300 requests per 5 minutes
export const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 300,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(),
});

// Auth endpoints - stricter limits (5 requests per 15 minutes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    store: createRedisStore(),
});

// Webhook endpoints - moderate limits (30 requests per minute)
export const webhookLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many webhook requests' },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(),
});

// Password reset - very strict (3 requests per hour)
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: 'Too many password reset attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(),
});

// Email sending - moderate limits (10 per hour)
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { message: 'Too many email requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(),
});
