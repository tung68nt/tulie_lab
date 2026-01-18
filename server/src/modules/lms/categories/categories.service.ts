import { ICategoryRepository } from './interfaces/category.repository.interface';
import { Request, Response } from 'express'; // Assuming express types are available

export class CategoryService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async getAllCategories() {
        return this.categoryRepository.findAll();
    }

    async getCategoryBySlug(slug: string) {
        return this.categoryRepository.findBySlug(slug);
    }

    async createCategory(data: any) {
        // Assuming repository supports create (it should if following pattern)
        return (this.categoryRepository as any).create(data);
    }

    async updateCategory(id: string, data: any) {
        return (this.categoryRepository as any).update(id, data);
    }

    async deleteCategory(id: string) {
        return (this.categoryRepository as any).delete(id);
    }
}
