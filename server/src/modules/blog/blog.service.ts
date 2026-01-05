import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    thumbnail: string | null;
    authorId: string | null;
    isPublished: boolean | number;
    publishedAt: Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Get all published blog posts
export const getPublishedPosts = async () => {
    const posts = await prisma.$queryRaw<BlogPost[]>`
        SELECT * FROM BlogPost WHERE isPublished = 1 ORDER BY publishedAt DESC
    `;
    return posts;
};

// Get all blog posts (admin)
export const getAllPosts = async () => {
    const posts = await prisma.$queryRaw<BlogPost[]>`
        SELECT * FROM BlogPost ORDER BY createdAt DESC
    `;
    return posts;
};

// Get single post by slug
export const getPostBySlug = async (slug: string) => {
    const posts = await prisma.$queryRaw<BlogPost[]>`
        SELECT * FROM BlogPost WHERE slug = ${slug} LIMIT 1
    `;
    return posts[0] || null;
};

// Get single post by ID (admin)
export const getPostById = async (id: string) => {
    const posts = await prisma.$queryRaw<BlogPost[]>`
        SELECT * FROM BlogPost WHERE id = ${id} LIMIT 1
    `;
    return posts[0] || null;
};

// Create blog post
export const createPost = async (data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    authorId?: string;
    isPublished?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}) => {
    const id = `blog-${Date.now()}`;
    const now = new Date().toISOString();
    const isPublished = data.isPublished ? 1 : 0;
    const publishedAt = data.isPublished ? now : null;

    await prisma.$executeRaw`
        INSERT INTO BlogPost (id, title, slug, excerpt, content, thumbnail, authorId, isPublished, publishedAt, metaTitle, metaDescription, metaKeywords, createdAt, updatedAt)
        VALUES (${id}, ${data.title}, ${data.slug}, ${data.excerpt || null}, ${data.content}, ${data.thumbnail || null}, ${data.authorId || null}, ${isPublished}, ${publishedAt}, ${data.metaTitle || null}, ${data.metaDescription || null}, ${data.metaKeywords || null}, ${now}, ${now})
    `;
    return getPostById(id);
};

// Update blog post
export const updatePost = async (id: string, data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    authorId?: string;
    isPublished?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}) => {
    const existing = await getPostById(id);
    if (!existing) throw { code: 'P2025' };

    const now = new Date().toISOString();
    const isPublished = data.isPublished !== undefined ? (data.isPublished ? 1 : 0) : existing.isPublished;
    const publishedAt = data.isPublished && !existing.publishedAt ? now : existing.publishedAt;

    await prisma.$executeRaw`
        UPDATE BlogPost SET
            title = ${data.title ?? existing.title},
            slug = ${data.slug ?? existing.slug},
            excerpt = ${data.excerpt ?? existing.excerpt},
            content = ${data.content ?? existing.content},
            thumbnail = ${data.thumbnail ?? existing.thumbnail},
            authorId = ${data.authorId ?? existing.authorId},
            isPublished = ${isPublished},
            publishedAt = ${publishedAt},
            metaTitle = ${data.metaTitle ?? existing.metaTitle},
            metaDescription = ${data.metaDescription ?? existing.metaDescription},
            metaKeywords = ${data.metaKeywords ?? existing.metaKeywords},
            updatedAt = ${now}
        WHERE id = ${id}
    `;
    return getPostById(id);
};

// Delete blog post
export const deletePost = async (id: string) => {
    const existing = await getPostById(id);
    if (!existing) throw { code: 'P2025' };

    await prisma.$executeRaw`DELETE FROM BlogPost WHERE id = ${id}`;
    return { success: true };
};
