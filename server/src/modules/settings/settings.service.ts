import prisma from '../../config/prisma';
import crypto from 'crypto';

export const getSettings = async (keys?: string[]) => {
    const where: any = {};
    if (keys && keys.length > 0) {
        where.key = { in: keys };
    }

    const settings = await prisma.systemSetting.findMany({ where });

    // Convert to object { key: value }
    return settings.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
};

export const updateSettings = async (settings: Record<string, string>) => {
    const promises = Object.keys(settings).map(key => {
        const value = settings[key] || ''; // Ensure string
        return prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
    });

    return Promise.all(promises);
};

export const generateApiKey = async (): Promise<string> => {
    // Generate a random 32-character API key
    const apiKey = 'sk_' + crypto.randomBytes(24).toString('hex');

    // Save to database
    await prisma.systemSetting.upsert({
        where: { key: 'sepay_api_key' },
        update: { value: apiKey },
        create: { key: 'sepay_api_key', value: apiKey }
    });

    return apiKey;
};

export const getApiKey = async (): Promise<string | null> => {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: 'sepay_api_key' }
    });
    return setting?.value || null;
};
