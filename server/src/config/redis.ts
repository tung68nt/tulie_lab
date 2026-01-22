import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            lazyConnect: true,
        });

        redis.connect().catch((err) => {
            console.warn('⚠️ Redis connection failed, caching disabled:', err.message);
            redis = null;
        });

        redis.on('error', (err) => {
            console.warn('⚠️ Redis error:', err.message);
        });

        redis.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });
    } catch (error: any) {
        console.warn('⚠️ Redis initialization failed:', error.message);
        redis = null;
    }
} else {
    console.warn('⚠️ REDIS_URL not configured, caching disabled');
}

// Helper functions with graceful degradation
export const cacheGet = async (key: string): Promise<string | null> => {
    if (!redis) return null;
    try {
        return await redis.get(key);
    } catch (error) {
        console.warn(`Cache get failed for ${key}:`, error);
        return null;
    }
};

export const cacheSet = async (
    key: string,
    value: string,
    ttlSeconds: number = 3600
): Promise<void> => {
    if (!redis) return;
    try {
        await redis.setex(key, ttlSeconds, value);
    } catch (error) {
        console.warn(`Cache set failed for ${key}:`, error);
    }
};

export const cacheDel = async (key: string): Promise<void> => {
    if (!redis) return;
    try {
        await redis.del(key);
    } catch (error) {
        console.warn(`Cache delete failed for ${key}:`, error);
    }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
    if (!redis) return;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        console.warn(`Cache delete pattern failed for ${pattern}:`, error);
    }
};

export default redis;
