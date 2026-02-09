import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

class RedisService {
    private client: Redis;
    private isConnected: boolean = false;

    constructor() {
        this.client = new Redis(redisUrl, {
            lazyConnect: true, // Don't crash if Redis is down immediately
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.client.on('connect', () => {
            console.log('Redis connected');
            this.isConnected = true;
        });

        this.client.on('ready', () => {
            this.isConnected = true;
        });

        this.client.on('error', (err) => {
            console.error('Redis error', err);
            this.isConnected = false;
        });

        this.client.on('close', () => {
            this.isConnected = false;
        });
    }

    async connect() {
        if (this.isConnected) return;
        try {
            await this.client.connect();
            this.isConnected = true;
        } catch (error) {
            console.warn('Could not connect to Redis, caching will be skipped.');
            this.isConnected = false;
        }
    }

    async get(key: string): Promise<string | null> {
        if (!this.isConnected) return null;
        try {
            return await this.client.get(key);
        } catch (error) {
            return null;
        }
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (!this.isConnected) return;
        try {
            if (ttlSeconds) {
                await this.client.set(key, value, 'EX', ttlSeconds);
            } else {
                await this.client.set(key, value);
            }
        } catch (error) {
            console.error(`Redis set error for key ${key}`, error);
        }
    }

    async del(key: string): Promise<void> {
        if (!this.isConnected) return;
        try {
            await this.client.del(key);
        } catch (error) {
            console.error(`Redis del error for key ${key}`, error);
        }
    }

    // Helper to get parsed JSON
    async getJson<T>(key: string): Promise<T | null> {
        const data = await this.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch (e) {
            return null;
        }
    }

    // Helper to set JSON
    async setJson(key: string, value: any, ttlSeconds?: number): Promise<void> {
        await this.set(key, JSON.stringify(value), ttlSeconds);
    }

    getClient() {
        return this.client;
    }
}

export default new RedisService();
