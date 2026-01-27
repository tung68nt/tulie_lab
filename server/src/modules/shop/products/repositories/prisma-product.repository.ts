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
            where.type = type;
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
        return prisma.product.delete({
            where: { id: versionId }
        });
    }

    // Upsell Management
    async getUpsells(productId: string): Promise<any> {
        // Get both product and course upsells
        const [productUpsells, courseUpsells] = await Promise.all([
            (prisma as any).productUpsell.findMany({
                where: { productId },
                include: {
                    upsellProduct: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            compareAtPrice: true,
                            thumbnail: true,
                            description: true,
                            type: true
                        }
                    }
                },
                orderBy: { position: 'asc' }
            }),
            (prisma as any).productCourseUpsell.findMany({
                where: { productId },
                include: {
                    upsellCourse: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            compareAtPrice: true,
                            thumbnail: true,
                            description: true
                        }
                    }
                },
                orderBy: { position: 'asc' }
            })
        ]);

        // Combine and format results
        return {
            products: productUpsells.map((u: any) => ({
                id: u.id,
                position: u.position,
                type: 'PRODUCT',
                item: u.upsellProduct
            })),
            courses: courseUpsells.map((u: any) => ({
                id: u.id,
                position: u.position,
                type: 'COURSE',
                item: u.upsellCourse
            }))
        };
    }

    async addUpsell(productId: string, data: { productId?: string; courseId?: string; position?: number }): Promise<any> {
        const { productId: upsellProductId, courseId: upsellCourseId, position = 0 } = data;

        if (upsellProductId) {
            // Add product upsell
            return (prisma as any).productUpsell.create({
                data: {
                    productId,
                    upsellProductId,
                    position
                },
                include: {
                    upsellProduct: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            compareAtPrice: true,
                            thumbnail: true,
                            description: true,
                            type: true
                        }
                    }
                }
            });
        } else if (upsellCourseId) {
            // Add course upsell
            return (prisma as any).productCourseUpsell.create({
                data: {
                    productId,
                    upsellCourseId,
                    position
                },
                include: {
                    upsellCourse: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            compareAtPrice: true,
                            thumbnail: true,
                            description: true
                        }
                    }
                }
            });
        }

        throw new Error('Either productId or courseId must be provided');
    }

    async removeUpsell(_productId: string, upsellId: string): Promise<void> {
        // Try to delete from both tables (one will succeed, one will fail - that's okay)
        try {
            await (prisma as any).productUpsell.delete({
                where: { id: upsellId }
            });
        } catch (e) {
            // If not found in productUpsell, try courseUpsell
            await (prisma as any).productCourseUpsell.delete({
                where: { id: upsellId }
            });
        }
    }

    // Classification methods
    async listClassifications(type?: string): Promise<any[]> {
        const where: any = {};
        if (type) {
            where.type = type;
        }
        return (prisma as any).productClassification.findMany({
            where,
            orderBy: { name: 'asc' }
        });
    }

    async createClassification(data: any): Promise<any> {
        return (prisma as any).productClassification.create({ data });
    }

    async updateClassification(id: string, data: any): Promise<any> {
        return (prisma as any).productClassification.update({
            where: { id },
            data
        });
    }

    async deleteClassification(id: string): Promise<any> {
        return (prisma as any).productClassification.delete({
            where: { id }
        });
    }
}
