import prisma from '../../config/prisma';

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
