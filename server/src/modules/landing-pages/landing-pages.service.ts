import prisma from '../../config/prisma';
import RedisService from '../../services/redis.service';

const CACHE_TTL = 3600; // 1 hour

export const createLandingPage = async (data: any) => {
    const page = await prisma.landingPage.create({
        data: {
            title: data.title,
            slug: data.slug,
            description: data.description ?? null,
            sections: data.sections || [],
            isActive: data.isActive ?? true
        }
    });
    return page;
};

export const updateLandingPage = async (id: string, data: any) => {
    // Get existing page to know the slug for cache invalidation
    const existingPage = await prisma.landingPage.findUnique({ where: { id } });

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.sections !== undefined) updateData.sections = data.sections;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updatedPage = await prisma.landingPage.update({
        where: { id },
        data: updateData
    });

    if (existingPage) {
        // Invalidate old slug cache
        await RedisService.del(`landing_page:${existingPage.slug}`);
    }
    if (updatedPage.slug !== existingPage?.slug) {
        // Invalidate new slug cache just in case
        await RedisService.del(`landing_page:${updatedPage.slug}`);
    }

    return updatedPage;
};

export const getLandingPageBySlug = async (slug: string) => {
    const cacheKey = `landing_page:${slug}`;
    const cached = await RedisService.getJson<any>(cacheKey);

    if (cached) {
        return cached;
    }

    const page = await prisma.landingPage.findUnique({
        where: { slug }
    });

    if (!page) return null;

    const result = {
        ...page,
        sections: page.sections
    };

    // Cache the result
    await RedisService.setJson(cacheKey, result, CACHE_TTL);

    return result;
};

export const getAllLandingPages = async () => {
    return prisma.landingPage.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            description: true
            // Exclude 'sections' to make list query lighter
        }
    });
};

export const deleteLandingPage = async (id: string) => {
    const existingPage = await prisma.landingPage.findUnique({ where: { id } });

    if (existingPage) {
        await RedisService.del(`landing_page:${existingPage.slug}`);
    }

    return prisma.landingPage.delete({
        where: { id }
    });
};
