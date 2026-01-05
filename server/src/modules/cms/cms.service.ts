import prisma from '../../config/prisma';

export const getSettings = async (keys?: string[]) => {
    if (keys && keys.length > 0) {
        const settings = await prisma.systemSetting.findMany({
            where: {
                key: { in: keys }
            }
        });
        // Convert array to object for easier frontend consumption
        return settings.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
    }

    const allSettings = await prisma.systemSetting.findMany();
    return allSettings.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
};

export const updateSetting = async (key: string, value: string, type: string = 'text') => {
    return prisma.systemSetting.upsert({
        where: { key },
        update: { value, type },
        create: { key, value, type }
    });
};
