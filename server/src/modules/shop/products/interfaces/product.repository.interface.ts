import { Product, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface IProductRepository extends IBaseRepository<Product, Prisma.ProductCreateInput, Prisma.ProductUpdateInput> {
    findBySlug(slug: string): Promise<Product | null>;
    addVersion(productId: string, data: any): Promise<any>;
    deleteVersion(versionId: string): Promise<any>;
}
