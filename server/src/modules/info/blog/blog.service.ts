import { IBlogPostRepository } from './interfaces/blog-post.repository.interface';

export class BlogService {
    private CACHE_TTL = 3600; // 1 hour

    constructor(
        private blogPostRepository: IBlogPostRepository,
        private cacheProvider?: any
    ) { }

    async getPostBySlug(slug: string) {
        const cacheKey = `blog_post:${slug}`;
        if (this.cacheProvider) {
            const cached = await this.cacheProvider.getJson(cacheKey);
            if (cached) return cached;
        }

        const post = await this.blogPostRepository.findBySlug(slug);
        if (!post) return null;

        if (this.cacheProvider) {
            await this.cacheProvider.setJson(cacheKey, post, this.CACHE_TTL);
        }
        return post;
    }

    async getPublishedPosts(page: number = 1, limit: number = 20, categoryId?: string) {
        const where: any = { isPublished: true };
        if (categoryId) where.categoryId = categoryId;

        return this.blogPostRepository.findAll({
            where,
            skip: (page - 1) * limit,
            take: limit
        });
    }

    async createPost(data: any) {
        return this.blogPostRepository.create(data);
    }

    async updatePost(id: string, data: any) {
        const post = await this.blogPostRepository.findById(id);
        const updated = await this.blogPostRepository.update(id, data);

        if (this.cacheProvider && post) {
            await this.cacheProvider.del(`blog_post:${post.slug}`);
            await this.cacheProvider.del(`blog_post:${updated.slug}`);
        }
        return updated;
    }

    async deletePost(id: string) {
        const post = await this.blogPostRepository.findById(id);
        const result = await this.blogPostRepository.delete(id);

        if (this.cacheProvider && post) {
            await this.cacheProvider.del(`blog_post:${post.slug}`);
        }
        return result;
    }

    async getAllPostsAdmin(page: number = 1, limit: number = 20) {
        return this.blogPostRepository.findAll({
            skip: (page - 1) * limit,
            take: limit
        });
    }
}
