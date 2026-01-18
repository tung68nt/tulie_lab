import { LandingPage, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface ILandingPageRepository extends IBaseRepository<LandingPage, Prisma.LandingPageCreateInput, Prisma.LandingPageUpdateInput> {
    findBySlug(slug: string, include?: Prisma.LandingPageInclude): Promise<LandingPage | null>;
    findAll(params: { type?: string }): Promise<{ data: any[]; meta: any }>;
}
