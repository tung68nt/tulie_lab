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

    // Upsell Management
    async getUpsells(productId: string) {
        return this.productRepository.getUpsells(productId);
    }

    async addUpsell(productId: string, data: { productId?: string; courseId?: string; position?: number }) {
        return this.productRepository.addUpsell(productId, data);
    }

    async removeUpsell(productId: string, upsellId: string) {
        return this.productRepository.removeUpsell(productId, upsellId);
    }

    // Classification Management
    async listClassifications(type?: string) {
        return this.productRepository.listClassifications(type);
    }

    async createClassification(data: any) {
        return this.productRepository.createClassification(data);
    }

    async updateClassification(id: string, data: any) {
        return this.productRepository.updateClassification(id, data);
    }

    async deleteClassification(id: string) {
        return this.productRepository.deleteClassification(id);
    }
}
