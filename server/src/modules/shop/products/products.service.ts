import { Prisma, Product } from '@prisma/client';
import { IProductRepository } from './interfaces/product.repository.interface';

export class ProductService {
    constructor(private productRepository: IProductRepository) { }

    async createProduct(data: Prisma.ProductCreateInput) {
        // Ensure slug is unique if not provided
        if (!data.slug) {
            const slugBase = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            data.slug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;
        }
        return this.productRepository.create(data);
    }

    async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
        return this.productRepository.update(id, data);
    }

    async deleteProduct(id: string) {
        return this.productRepository.delete(id);
    }

    async getProductById(id: string) {
        return this.productRepository.findById(id);
    }

    async getProductBySlug(slug: string) {
        return this.productRepository.findBySlug(slug);
    }

    async listProducts(params: any) {
        return this.productRepository.findAll(params);
    }

    async addVersion(productId: string, data: any) {
        return this.productRepository.addVersion(productId, data);
    }

    async deleteVersion(versionId: string) {
        return this.productRepository.deleteVersion(versionId);
    }
}
