import { LandingPage, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ILandingPageRepository } from '../interfaces/landing-page.repository.interface';

export class PrismaLandingPageRepository implements ILandingPageRepository {
    async create(data: Prisma.LandingPageCreateInput): Promise<LandingPage> {
        return prisma.landingPage.create({ data });
    }

    async update(id: string, data: Prisma.LandingPageUpdateInput): Promise<LandingPage> {
        return prisma.landingPage.update({ where: { id }, data });
    }

    async delete(id: string): Promise<LandingPage> {
        return prisma.landingPage.delete({ where: { id } });
    }

    async findById(id: string): Promise<LandingPage | null> {
        return prisma.landingPage.findUnique({
            where: { id },
            include: { course: true, upsellCourse: true }
        });
    }

    async findBySlug(slug: string, include?: Prisma.LandingPageInclude): Promise<LandingPage | null> {
        return prisma.landingPage.findUnique({
            where: { slug },
            include: include || { course: true, upsellCourse: true }
        });
    }

    async findAll(params: { type?: string }): Promise<{ data: any[]; meta: any }> {
        const where: Prisma.LandingPageWhereInput = {};
        if (params.type) where.type = params.type as any;

        const pages = await prisma.landingPage.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                description: true,
                type: true,
            }
        });

        return { data: pages, meta: { total: pages.length } };
    }
}
