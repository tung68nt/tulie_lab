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
            sections: data.sections ? JSON.stringify(data.sections) : null,
            isActive: data.isActive ?? true,
            isHomepage: false,
            type: data.type || 'LANDING',
            htmlContent: data.htmlContent ?? null,
            ...(data.courseId ? { course: { connect: { id: data.courseId } } } : {}),
            ...(data.productId ? { product: { connect: { id: data.productId } } } : {}),
            ...(data.upsellCourseId ? { upsellCourse: { connect: { id: data.upsellCourseId } } } : {}),
            ...(data.upsellProductId ? { upsellProduct: { connect: { id: data.upsellProductId } } } : {}),
            upsellPrice: data.upsellPrice ? data.upsellPrice : null
        });
    }

    async updateLandingPage(id: string, data: any) {
        const existingPage = await this.landingPageRepository.findById(id);

        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.sections !== undefined) updateData.sections = data.sections ? JSON.stringify(data.sections) : null;
        if (data.htmlContent !== undefined) updateData.htmlContent = data.htmlContent;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.type !== undefined) updateData.type = data.type;

        // Handle relations
        if (data.courseId !== undefined) {
            updateData.course = data.courseId ? { connect: { id: data.courseId } } : { disconnect: true };
        }
        if (data.productId !== undefined) {
            updateData.product = data.productId ? { connect: { id: data.productId } } : { disconnect: true };
        }
        if (data.upsellCourseId !== undefined) {
            updateData.upsellCourse = data.upsellCourseId ? { connect: { id: data.upsellCourseId } } : { disconnect: true };
        }
        if (data.upsellProductId !== undefined) {
            updateData.upsellProduct = data.upsellProductId ? { connect: { id: data.upsellProductId } } : { disconnect: true };
        }

        if (data.upsellPrice !== undefined) updateData.upsellPrice = data.upsellPrice || null;

        const updatedPage = await this.landingPageRepository.update(id, updateData);

        if (this.cacheProvider) {
            if (existingPage) await this.cacheProvider.del(`landing_page:${existingPage.slug}`);
            await this.cacheProvider.del(`landing_page:${updatedPage.slug}`);
            if (existingPage?.isHomepage || updatedPage.isHomepage) {
                await this.cacheProvider.del(`landing_page:home`);
            }
        }

        return updatedPage;
    }

    async getLandingPageBySlug(slug: string) {
        // Normalize slug: remove leading slash if present. Default to 'home' if empty/root
        const normalizedSlug = (slug.startsWith('/') ? slug.slice(1) : slug) || 'home';
        const cacheKey = `landing_page:${normalizedSlug}`;

        if (this.cacheProvider) {
            const cached = await this.cacheProvider.getJson(cacheKey);
            if (cached) return cached;
        }

        let page;
        if (normalizedSlug === 'home') {
            // Find the page marked as homepage
            page = await this.landingPageRepository.findFirst({ where: { isHomepage: true } });
        } else {
            page = await this.landingPageRepository.findBySlug(normalizedSlug);
        }

        if (!page) return null;

        if (page && typeof page.sections === 'string') {
            try {
                (page as any).sections = JSON.parse(page.sections);
            } catch (e) {
                console.error('Failed to parse landing page sections', e);
                (page as any).sections = [];
            }
        }

        if (this.cacheProvider) {
            await this.cacheProvider.setJson(cacheKey, page, this.CACHE_TTL);
        }

        return page;
    }

    async getLandingPageById(id: string) {
        const page = await this.landingPageRepository.findById(id);
        if (page && typeof page.sections === 'string') {
            try {
                (page as any).sections = JSON.parse(page.sections);
            } catch (e) {
                console.error('Failed to parse landing page sections', e);
                (page as any).sections = [];
            }
        }
        return page;
    }

    async findAll(params: { type?: string } = {}) {
        return this.landingPageRepository.findAll(params);
    }

    async deleteLandingPage(id: string) {
        const page = await this.landingPageRepository.findById(id);
        if (!page) {
            // If page is already gone, consider it a success (idempotent)
            // or throw specific error based on requirements.
            // Here we just return to avoid Prisma error.
            return null;
        }

        const result = await this.landingPageRepository.delete(id);

        if (this.cacheProvider && page) {
            await this.cacheProvider.del(`landing_page:${page.slug}`);
            if (page.isHomepage) await this.cacheProvider.del(`landing_page:home`);
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
            htmlContent: existingPage.htmlContent,
            isActive: false,
            isHomepage: false,
            type: existingPage.type,
            ...(existingPage.courseId ? { course: { connect: { id: existingPage.courseId } } } : {}),
            ...(existingPage.productId ? { product: { connect: { id: existingPage.productId } } } : {}),
            ...(existingPage.upsellCourseId ? { upsellCourse: { connect: { id: existingPage.upsellCourseId } } } : {}),
            ...(existingPage.upsellProductId ? { upsellProduct: { connect: { id: existingPage.upsellProductId } } } : {}),
            upsellPrice: existingPage.upsellPrice
        });
    }

    async setAsHomepage(id: string) {
        const targetPage = await this.landingPageRepository.findById(id);
        if (!targetPage) throw new Error('Page not found');

        // Reset all current homepages
        await this.landingPageRepository.updateMany({ isHomepage: true }, { isHomepage: false });

        // Set target as homepage
        const updated = await this.landingPageRepository.update(id, { isHomepage: true });

        if (this.cacheProvider) {
            await this.cacheProvider.del(`landing_page:home`);
        }

        return updated;
    }
}
