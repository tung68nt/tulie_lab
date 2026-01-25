import { Category, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ICategoryRepository } from '../interfaces/category.repository.interface';

export class PrismaCategoryRepository implements ICategoryRepository {
    async findAll(params: any = {}): Promise<{ data: Category[]; meta: any }> {
        const where = params.where || { isActive: true };
        const skip = params.skip || 0;
        const take = params.take || 100;

        const [data, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take,
                orderBy: { name: 'asc' }
            }),
            prisma.category.count({ where })
        ]);

        return { data, meta: { total } };
    }

    async findById(id: string): Promise<Category | null> {
        return prisma.category.findUnique({ where: { id } });
    }

    async findBySlug(slug: string): Promise<Category | null> {
        return prisma.category.findUnique({ where: { slug } });
    }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return prisma.category.create({ data });
    }

    async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
        return prisma.category.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Category> {
        return prisma.category.delete({ where: { id } });
    }
}
