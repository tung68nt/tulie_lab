import prisma from './src/config/prisma';
import redisService from './src/services/redis.service';

async function test() {
    console.log('Testing Database Connection...');
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connected');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }

    console.log('Testing Redis Connection...');
    try {
        await redisService.set('test', 'ok', 10);
        const val = await redisService.get('test');
        console.log('✅ Redis connected, val:', val);
    } catch (error) {
        console.error('❌ Redis connection failed:', error);
    }

    process.exit();
}

test();
