import { Product, Prisma, ProductType } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IProductRepository } from '../interfaces/product.repository.interface';

export class PrismaProductRepository implements IProductRepository {
    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return prisma.product.create({ data });
    }

    async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
        return prisma.product.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Product> {
        return prisma.product.delete({ where: { id } });
    }

    async findById(id: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
            include: { versions: { orderBy: { createdAt: 'desc' } } }
        });
    }

    async findBySlug(slug: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { slug },
            include: { versions: { orderBy: { createdAt: 'desc' } } }
        });
    }

    async findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        isPublished?: string | boolean;
    }): Promise<{ data: Product[]; meta: any }> {
        const { page = 1, limit = 10, search, type, isPublished } = params;
        const skip = (Number(page) - 1) * Number(limit);

        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (type && type !== 'all') {
            if (Object.values(ProductType).includes(type as ProductType)) {
                where.type = type as ProductType;
            }
        }

        if (isPublished !== undefined && isPublished !== 'all') {
            where.isPublished = isPublished === 'true' || isPublished === true;
        }

        const [total, products] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return {
            data: products,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    async addVersion(productId: string, data: any): Promise<any> {
        return prisma.productVersion.create({
            data: {
                ...data,
                productId
            }
        });
    }

    async deleteVersion(versionId: string): Promise<any> {
        return prisma.productVersion.delete({
            where: { id: versionId }
        });
    }
}
