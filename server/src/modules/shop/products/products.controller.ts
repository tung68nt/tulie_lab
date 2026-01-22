import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { ProductService } from './products.service';

export class ProductController {
    private get productService(): ProductService {
        return container.resolve<ProductService>('ProductService');
    }

    async create(req: Request, res: Response) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const product = await this.productService.updateProduct(req.params.id as string, req.body);
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.productService.deleteProduct(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const product = await this.productService.getProductById(req.params.id as string);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBySlug(req: Request, res: Response) {
        try {
            const product = await this.productService.getProductBySlug(req.params.slug as string);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { page, limit, search, type, isPublished } = req.query;
            const result = await this.productService.listProducts({
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                search: search as string,
                type: type as string,
                isPublished: isPublished as string
            });
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async addVersion(req: Request, res: Response) {
        try {
            const version = await this.productService.addVersion(req.params.id as string, req.body);
            res.status(201).json(version);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteVersion(req: Request, res: Response) {
        try {
            await this.productService.deleteVersion(req.params.versionId as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Upsell Management
    async getUpsells(req: Request, res: Response) {
        try {
            const upsells = await this.productService.getUpsells(req.params.id as string);
            res.json(upsells);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async addUpsell(req: Request, res: Response) {
        try {
            const { productId, courseId, position } = req.body;
            const upsell = await this.productService.addUpsell(
                req.params.id as string,
                { productId, courseId, position }
            );
            res.status(201).json(upsell);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async removeUpsell(req: Request, res: Response) {
        try {
            await this.productService.removeUpsell(req.params.id as string, req.params.upsellId as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

// Export singleton instance
export const productController = new ProductController();
