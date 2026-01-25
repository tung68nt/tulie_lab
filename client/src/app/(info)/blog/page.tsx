'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/Card';
import { BottomCTA } from '@/components/BottomCTA';
import { SectionTag } from '@/components/SectionTag';
import { ChevronRight, Calendar, User, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail?: string;
    publishedAt?: string;
    category?: {
        id: string;
        name: string;
    };
    author?: {
        name: string;
        avatar?: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const postsPerPage = 9;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await api.categories.list();
                setCategories(Array.isArray(res) ? res : (res.data || []));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const categoryId = selectedCategory === 'all' ? undefined : selectedCategory;
                const res: any = await api.blog.list(currentPage, postsPerPage, categoryId);
                const postsData = res.data || [];
                const total = res.meta?.total || postsData.length;

                setPosts(postsData);
                setTotalPosts(total);
            } catch (error) {
                console.warn('Blog API error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [currentPage, selectedCategory]);

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-muted/30 pt-16 pb-12 overflow-hidden border-b">
                <div className="container relative z-10 text-center">
                    <div className="flex justify-center">
                        <SectionTag>
                            Tin tức & Kiến thức
                        </SectionTag>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        The Tulie Lab <span className="text-primary">Blog</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Chia sẻ kiến thức, kinh nghiệm và xu hướng mới nhất về ứng dụng AI trong cuộc sống và công việc.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <aside className="w-full lg:w-64 space-y-8">
                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Filter size={18} className="text-primary" />
                                Chuyên mục
                            </h3>
                            <div className="flex flex-wrap lg:flex-col gap-2">
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-medium transition-all text-left",
                                        selectedCategory === 'all'
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "bg-muted/50 hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    Tất cả bài viết
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-medium transition-all text-left",
                                            selectedCategory === cat.id
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "bg-muted/50 hover:bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar (Visual only for now) */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            />
                        </div>
                    </aside>

                    {/* Blog Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse space-y-4">
                                        <div className="aspect-video bg-muted rounded-2xl" />
                                        <div className="h-6 bg-muted rounded w-3/4" />
                                        <div className="h-4 bg-muted rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border">
                                <p className="text-muted-foreground text-lg">Chưa có bài viết nào trong chuyên mục này.</p>
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Xem tất cả bài viết
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-16">
                                    {posts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                            <Card className="h-full border-none bg-transparent hover:shadow-none transition-none flex flex-col">
                                                <div className="aspect-video bg-muted rounded-2xl mb-4 overflow-hidden border relative">
                                                    {post.thumbnail ? (
                                                        <img
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            No thumbnail
                                                        </div>
                                                    )}
                                                    {post.category && (
                                                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                                                            {post.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="space-y-3 flex-1 flex flex-col">
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                        <span className="flex items-center gap-1">
                                                            <User size={12} />
                                                            {post.author?.name || 'Admin'}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                        {post.title}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                                                        Đọc bài viết <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-3">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Trước
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl text-sm font-bold transition-all",
                                                        currentPage === page
                                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                            : "border border-border bg-card hover:bg-muted"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Tiếp
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <BottomCTA
                title="Sẵn sàng chuyển đổi quy trình với AI?"
                subtitle="Đăng ký khoá học ngay hôm nay để nhận lộ trình đào tạo bài bản từ chuyên gia."
                buttonText="Khám phá khoá học"
                buttonHref="/courses"
            />
        </div>
    );
}

