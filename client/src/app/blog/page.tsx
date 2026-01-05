'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/Card';
import { BottomCTA } from '@/components/BottomCTA';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail?: string;
    publishedAt?: string;
    author?: {
        name: string;
        avatar?: string;
    };
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/blog`);
                if (res.ok) {
                    const posts = await res.json();
                    setPosts(Array.isArray(posts) ? posts : []);
                }
            } catch (error) {
                // API not available yet - show empty state
                console.warn('Blog API not available:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);


    // Pagination logic
    const postsPerPage = 9;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero */}
                <div className="bg-muted/30 py-8">
                    <div className="container">
                        <h1 className="text-4xl font-bold mb-4">Tin tức & Xu hướng</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Chia sẻ kiến thức, kinh nghiệm và xu hướng mới nhất về ứng dụng AI trong cuộc sống và công việc
                        </p>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="container py-8 md:py-12 mb-12">
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">Chưa có bài viết nào.</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Các bài viết mới sẽ sớm được cập nhật!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                                {currentPosts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`}>
                                        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
                                            {post.thumbnail && (
                                                <div className="aspect-video bg-muted overflow-hidden">
                                                    <img
                                                        src={post.thumbnail}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="p-6 pt-5 flex-1 flex flex-col">
                                                <h2 className="font-bold text-lg mb-3 line-clamp-2">{post.title}</h2>
                                                {post.excerpt && (
                                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-auto">
                                                    {post.author && (
                                                        <>
                                                            <span>{post.author.name}</span>
                                                            <span>•</span>
                                                        </>
                                                    )}
                                                    {post.publishedAt && (
                                                        <span>
                                                            {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination UI */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                                    >
                                        Trước
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border hover:bg-muted'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <BottomCTA
                title="Khám phá thêm kiến thức?"
                subtitle="Tham gia các khóa học chuyên sâu để nâng cao kỹ năng của bạn."
                buttonText="Xem tất cả khóa học"
                buttonHref="/courses"
            />
        </>
    );
}
