import { Request, Response, NextFunction } from 'express';
import { loggerService } from '../services/logger.service';

/**
 * Concurrency Limiter Middleware
 * 
 * This middleware tracks the number of active (unfinished) requests.
 * If the number of active requests exceeds the LIMIT, new requests are rejected
 * with a 503 Service Unavailable error.
 * 
 * This prevents the Node.js event loop from being overwhelmed and the VPS from 
 * running out of RAM/CPU during traffic spikes.
 */

// Configuration - can be moved to env vars later
const MAX_CONCURRENT_REQUESTS = Number(process.env.MAX_CONCURRENT_REQUESTS) || 50;
const BYPASS_PATHS = ['/api/health', '/api/check'];

let activeRequests = 0;

export const concurrencyLimiter = (req: Request, res: Response, next: NextFunction) => {
    // Bypass health checks to ensure the container isn't killed by health monitoring
    if (BYPASS_PATHS.includes(req.path)) {
        return next();
    }

    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        loggerService.warn(`[Concurrency] Rejecting request: System at capacity (${activeRequests}/${MAX_CONCURRENT_REQUESTS})`, {
            path: req.path,
            method: req.method,
            ip: req.ip
        });

        return res.status(503).json({
            status: 503,
            code: 'SYSTEM_OVERLOADED',
            message: 'Hệ thống đang xử lý quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.',
            messageEn: 'System is processing too many requests. Please try again in a few minutes.',
            error: 'Service Unavailable',
            retryAfter: 30
        });
    }

    activeRequests++;

    // Track when the request finishes or is closed
    const cleanup = () => {
        res.removeListener('finish', cleanup);
        res.removeListener('close', cleanup);
        activeRequests = Math.max(0, activeRequests - 1);
    };

    res.on('finish', cleanup);
    res.on('close', cleanup);

    next();
};

export const getActiveRequestsCount = () => activeRequests;
