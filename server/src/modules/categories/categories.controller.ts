import { Request, Response } from 'express';
import * as CategoryService from './categories.service';

export const list = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryService.listCategories();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const category = await CategoryService.getCategory(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const category = await CategoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const category = await CategoryService.updateCategory(id, req.body);
        res.json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await CategoryService.deleteCategory(id);
        res.json({ message: 'Category deleted' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
