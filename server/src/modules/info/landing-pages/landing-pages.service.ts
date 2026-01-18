import { ILandingPageRepository } from './interfaces/landing-page.repository.interface';
import { Prisma, LandingPage } from '@prisma/client';

export class LandingPageService {
    private CACHE_TTL = 3600; // 1 hour

    constructor(
        private landingPageRepository: ILandingPageRepository,
        private cacheProvider?: any
    ) { }

    async createLandingPage(data: any) {
        return this.landingPageRepository.create({
            title: data.title,
            slug: data.slug,
            description: data.description ?? null,
            sections: data.sections || [],
            isActive: data.isActive ?? true,
            type: data.type || 'LANDING',
            ...(data.courseId ? { course: { connect: { id: data.courseId } } } : {}),
            ...(data.upsellCourseId ? { upsellCourse: { connect: { id: data.upsellCourseId } } } : {}),
            upsellPrice: data.upsellPrice ? data.upsellPrice : null
        });
    }

    async updateLandingPage(id: string, data: any) {
        const existingPage = await this.landingPageRepository.findById(id);

        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.sections !== undefined) updateData.sections = data.sections;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.courseId !== undefined) updateData.courseId = data.courseId;
        if (data.upsellCourseId !== undefined) updateData.upsellCourseId = data.upsellCourseId;
        if (data.upsellPrice !== undefined) updateData.upsellPrice = data.upsellPrice || null;

        const updatedPage = await this.landingPageRepository.update(id, updateData);

        if (this.cacheProvider) {
            if (existingPage) await this.cacheProvider.del(`landing_page:${existingPage.slug}`);
            await this.cacheProvider.del(`landing_page:${updatedPage.slug}`);
        }

        return updatedPage;
    }

    async getLandingPageBySlug(slug: string) {
        const cacheKey = `landing_page:${slug}`;

        if (this.cacheProvider) {
            const cached = await this.cacheProvider.getJson(cacheKey);
            if (cached) return cached;
        }

        const page = await this.landingPageRepository.findBySlug(slug);
        if (!page) return null;

        if (this.cacheProvider) {
            await this.cacheProvider.setJson(cacheKey, page, this.CACHE_TTL);
        }

        return page;
    }

    async getLandingPageById(id: string) {
        return this.landingPageRepository.findById(id);
    }

    async findAll(params: { type?: string } = {}) {
        return this.landingPageRepository.findAll(params);
    }

    async deleteLandingPage(id: string) {
        const page = await this.landingPageRepository.findById(id);
        const result = await this.landingPageRepository.delete(id);

        if (this.cacheProvider && page) {
            await this.cacheProvider.del(`landing_page:${page.slug}`);
        }

        return result;
    }

    async duplicateLandingPage(id: string) {
        const existingPage = await this.landingPageRepository.findById(id);
        if (!existingPage) throw new Error('Page not found');

        const newTitle = `${existingPage.title} (Copy)`;
        const newSlug = `${existingPage.slug}-copy-${Date.now()}`;

        return this.landingPageRepository.create({
            title: newTitle,
            slug: newSlug,
            description: existingPage.description,
            sections: (existingPage.sections as any) ?? [],
            isActive: false,
            type: existingPage.type,
            ...(existingPage.courseId ? { course: { connect: { id: existingPage.courseId } } } : {}),
            ...(existingPage.upsellCourseId ? { upsellCourse: { connect: { id: existingPage.upsellCourseId } } } : {}),
            upsellPrice: existingPage.upsellPrice
        });
    }
}
