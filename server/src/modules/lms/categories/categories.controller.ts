import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { CategoryService } from './categories.service';

export class CategoryController {
    private get categoryService(): CategoryService {
        return container.resolve<CategoryService>('CategoryService');
    }

    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 100;
            const categories = await this.categoryService.getAllCategories({
                skip: (page - 1) * limit,
                take: limit
            });
            res.json(categories);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getBySlug(req: Request, res: Response) {
        try {
            const category = await this.categoryService.getCategoryBySlug(req.params.slug as string);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            res.json(category);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const category = await this.categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const category = await this.categoryService.updateCategory(req.params.id as string, req.body);
            res.json(category);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.categoryService.deleteCategory(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export const categoryController = new CategoryController();
