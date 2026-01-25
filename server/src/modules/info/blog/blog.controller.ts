import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { BlogService } from './blog.service';

export class BlogController {
    private get blogService(): BlogService {
        return container.resolve<BlogService>('BlogService');
    }

    async getPost(req: Request, res: Response) {
        try {
            const post = await this.blogService.getPostBySlug(req.params.slug as string);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            res.json(post);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async listPosts(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const categoryId = req.query.categoryId as string;
            const result = await this.blogService.getPublishedPosts(page, limit, categoryId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async listPostsAdmin(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await this.blogService.getAllPostsAdmin(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const post = await this.blogService.createPost(req.body);
            res.status(201).json(post);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const post = await this.blogService.updatePost(req.params.id as string, req.body);
            res.json(post);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.blogService.deletePost(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export const blogController = new BlogController();
