'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BottomCTA } from '@/components/BottomCTA';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    publishedAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    author?: {
        name: string;
        title?: string;
        avatar?: string;
    };
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/blog/${slug}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                    // Update document title for SEO
                    if (data.metaTitle || data.title) {
                        document.title = data.metaTitle || data.title;
                    }
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
                    <a href="/blog" className="text-primary hover:underline">← Quay lại blog</a>
                </div>
            </div>
        );
    }

    // BottomCTA import moved to top

    // ... existing code ...

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Content */}
                <article className="container py-8 sm:py-12 pb-20 sm:pb-32">
                    <div className="max-w-4xl mx-auto">
                        {/* Hero with thumbnail - boxed */}
                        {post.thumbnail && (
                            <div className="w-full aspect-video bg-muted overflow-hidden rounded-xl mb-8">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="max-w-3xl mx-auto">
                            {/* Title */}
                            <h1 className="text-2xl sm:text-4xl font-bold mb-6">{post.title}</h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b">
                                {post.author && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                            {post.author.avatar ? (
                                                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                                                    {post.author.name?.[0] || 'A'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{post.author.name}</p>
                                            {post.author.title && (
                                                <p className="text-sm text-muted-foreground">{post.author.title}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {post.publishedAt && (
                                    <span className="text-muted-foreground">
                                        {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>

                            {/* Excerpt */}
                            {post.excerpt && (
                                <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Content */}
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Back link */}
                            <div className="mt-12 pt-8 border-t">
                                <a href="/blog" className="text-primary hover:underline">← Xem tất cả bài viết</a>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
            <BottomCTA
                title="Sẵn sàng áp dụng kiến thức?"
                subtitle="Đăng ký khóa học ngay hôm nay để nhận được lộ trình bài bản."
                buttonText="Tìm hiểu khóa học"
                buttonHref="/courses"
            />
        </>
    );
}
