import { Request, Response } from 'express';
import * as blogService from './blog.service';

// Public: Get all published posts
export const getPublishedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await blogService.getPublishedPosts();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Public: Get single post by slug
export const getPostBySlug = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug as string;
        const post = await blogService.getPostBySlug(slug);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// Admin: Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await blogService.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Admin: Get single post by ID
export const getPostById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const post = await blogService.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// Admin: Create post
export const createPost = async (req: Request, res: Response) => {
    try {
        const post = await blogService.createPost(req.body);
        res.status(201).json(post);
    } catch (error: any) {
        console.error('Error creating post:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Admin: Update post
export const updatePost = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const post = await blogService.updatePost(id, req.body);
        res.json(post);
    } catch (error: any) {
        console.error('Error updating post:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Admin: Delete post
export const deletePost = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await blogService.deletePost(id);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(500).json({ error: 'Failed to delete post' });
    }
};
