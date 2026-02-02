import prisma from '../../../config/prisma';

export const listPricingAddOns = async (includeInactive = false) => {
    return prisma.pricingAddOn.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: { position: 'asc' },
    });
};

export const getPricingAddOn = async (id: string) => {
    return prisma.pricingAddOn.findUnique({
        where: { id },
    });
};

export const createPricingAddOn = async (data: {
    name: string;
    description?: string;
    priceAddon: number;
    compareAtAddon?: number;
    features?: string[];
    position?: number;
    isActive?: boolean;
    type?: 'VIDEO' | 'CHAT' | 'REVIEW' | 'OTHER';
    sessionCount?: number;
    sessionDuration?: number;
    curriculum?: any;
}) => {
    return prisma.pricingAddOn.create({
        data: {
            name: data.name,
            description: data.description ?? null,
            priceAddon: data.priceAddon,
            compareAtAddon: data.compareAtAddon ?? null,
            features: data.features || [],
            position: data.position ?? 0,
            isActive: data.isActive ?? true,
            type: data.type || 'OTHER',
            sessionCount: data.sessionCount || 0,
            sessionDuration: data.sessionDuration || 60,
            curriculum: data.curriculum || [],
        },
    });
};

export const updatePricingAddOn = async (id: string, data: {
    name?: string;
    description?: string;
    priceAddon?: number;
    compareAtAddon?: number;
    features?: string[];
    position?: number;
    isActive?: boolean;
    type?: 'VIDEO' | 'CHAT' | 'REVIEW' | 'OTHER';
    sessionCount?: number;
    sessionDuration?: number;
    curriculum?: any;
}) => {
    return prisma.pricingAddOn.update({
        where: { id },
        data,
    });
};

export const deletePricingAddOn = async (id: string) => {
    return prisma.pricingAddOn.delete({
        where: { id },
    });
};

export const reorderPricingAddOns = async (ids: string[]) => {
    const updates = ids.map((id, index) =>
        prisma.pricingAddOn.update({
            where: { id },
            data: { position: index },
        })
    );
    return prisma.$transaction(updates);
};
