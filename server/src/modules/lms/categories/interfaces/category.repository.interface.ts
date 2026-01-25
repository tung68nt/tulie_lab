import { Category, Prisma } from '@prisma/client';

export interface ICategoryRepository {
    findAll(params?: any): Promise<{ data: Category[]; meta: any }>;
    findById(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
}
