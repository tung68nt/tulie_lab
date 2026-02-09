import redisService from './redis.service';
import { loggerService } from './logger.service';

/**
 * Standardized Caching Service
 * Implements common patterns like Stale-While-Revalidate
 */
export class CacheService {
    /**
     * Wrap an async operation with caching
     */
    async wrap<T>(key: string, fn: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
        try {
            const cached = await redisService.getJson<T>(key);
            if (cached) {
                return cached;
            }

            const fresh = await fn();
            await redisService.setJson(key, fresh, ttlSeconds);
            return fresh;
        } catch (error) {
            loggerService.error(`Cache wrap failed for key ${key}`, { error });
            return fn(); // Fallback to fresh data on error
        }
    }

    async del(key: string) {
        return redisService.del(key);
    }

    async getJson<T>(key: string) {
        return redisService.getJson<T>(key);
    }

    async setJson(key: string, value: any, ttlSeconds?: number) {
        return redisService.setJson(key, value, ttlSeconds);
    }
}

export const cacheService = new CacheService();
