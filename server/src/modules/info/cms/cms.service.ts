import prisma from '../../../config/prisma';

const settingsCache = new Map<string, { value: any, expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getSettings = async (keys?: string[]) => {
    // 1. Generate Cache Key
    const cacheKey = keys && keys.length > 0 ? `cms:settings:${keys.sort().join(',')}` : 'cms:settings:all';

    // 2. Check Memory Cache
    const cached = settingsCache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
        return cached.value;
    }

    if (keys && keys.length > 0) {
        const settings = await prisma.systemSetting.findMany({
            where: {
                key: { in: keys }
            }
        });
        // Convert array to object for easier frontend consumption
        const result = settings.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});

        // 3. Set Cache
        settingsCache.set(cacheKey, { value: result, expiry: Date.now() + CACHE_TTL });
        return result;
    }

    const allSettings = await prisma.systemSetting.findMany();
    const result = allSettings.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});

    // 3. Set Cache
    settingsCache.set(cacheKey, { value: result, expiry: Date.now() + CACHE_TTL });
    return result;
};

export const updateSetting = async (key: string, value: string, type: string = 'text') => {
    // Clear cache on update
    settingsCache.clear();

    return prisma.systemSetting.upsert({
        where: { key },
        update: { value, type },
        create: { key, value, type }
    });
};
