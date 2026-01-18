import { BlogPost, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface IBlogPostRepository extends IBaseRepository<BlogPost, Prisma.BlogPostCreateInput, Prisma.BlogPostUpdateInput> {
    findBySlug(slug: string, include?: Prisma.BlogPostInclude): Promise<BlogPost | null>;
}
