import { BlogPost, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IBlogPostRepository } from '../interfaces/blog-post.repository.interface';

export class PrismaBlogPostRepository implements IBlogPostRepository {
    async create(data: Prisma.BlogPostCreateInput): Promise<BlogPost> {
        return prisma.blogPost.create({ data });
    }

    async update(id: string, data: Prisma.BlogPostUpdateInput): Promise<BlogPost> {
        return prisma.blogPost.update({ where: { id }, data });
    }

    async delete(id: string): Promise<BlogPost> {
        return prisma.blogPost.delete({ where: { id } });
    }

    async findById(id: string): Promise<BlogPost | null> {
        return prisma.blogPost.findUnique({ where: { id }, include: { author: true, category: true } });
    }

    async findBySlug(slug: string, include?: Prisma.BlogPostInclude): Promise<BlogPost | null> {
        return prisma.blogPost.findUnique({ where: { slug }, include: include || { author: true, category: true } });
    }

    async findAll(params: any): Promise<{ data: BlogPost[]; meta: any }> {
        const where = params.where || {};
        const skip = params.skip || 0;
        const take = params.take || 20;

        const [data, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                skip,
                take,
                include: { author: true, category: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.blogPost.count({ where })
        ]);

        return { data, meta: { total } };
    }
}
