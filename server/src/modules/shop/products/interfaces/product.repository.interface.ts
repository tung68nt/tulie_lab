import { Product, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface IProductRepository extends IBaseRepository<Product, Prisma.ProductCreateInput, Prisma.ProductUpdateInput> {
    findBySlug(slug: string): Promise<Product | null>;
    addVersion(productId: string, data: any): Promise<any>;
    deleteVersion(versionId: string): Promise<any>;
    // Upsell methods
    getUpsells(productId: string): Promise<any>;
    addUpsell(productId: string, data: { productId?: string; courseId?: string; position?: number }): Promise<any>;
    removeUpsell(productId: string, upsellId: string): Promise<void>;
}
