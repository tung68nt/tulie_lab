'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
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

            {/* Main Content with Sidebar */}
            <div className="container py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <div className="w-full md:w-64 shrink-0 space-y-8">
                        {/* Search Bar in Sidebar */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Tìm kiếm bài viết</label>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* Categories List in Sidebar */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Chuyên mục</label>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className={cn(
                                        "text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3",
                                        selectedCategory === 'all'
                                            ? "text-primary font-bold bg-primary/5"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                        selectedCategory === 'all' ? "bg-primary border-primary" : "border-muted-foreground/30"
                                    )}>
                                        {selectedCategory === 'all' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    Tất cả bài viết
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={cn(
                                            "text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3",
                                            selectedCategory === cat.id
                                                ? "text-primary font-bold bg-primary/5"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                            selectedCategory === cat.id ? "bg-primary border-primary" : "border-muted-foreground/30"
                                        )}>
                                            {selectedCategory === cat.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid gap-6 md:grid-cols-2">
                                {[1, 2, 4].map((i) => (
                                    <div key={i} className="animate-pulse space-y-4">
                                        <div className="aspect-video bg-muted rounded-2xl" />
                                        <div className="h-6 bg-muted rounded w-3/4" />
                                        <div className="h-4 bg-muted rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-32 border-2 border-dashed rounded-3xl">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Không tìm thấy bài viết</h3>
                                <p className="text-muted-foreground mb-6">Chúng tôi không tìm thấy bài viết nào trong chuyên mục này.</p>
                                <Button
                                    onClick={() => handleCategoryChange('all')}
                                    className="px-6 py-2 rounded-full"
                                >
                                    Xem tất cả bài viết
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 mb-16">
                                    {posts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                                            <Card className="h-full border border-border/50 bg-card/50 hover:bg-card hover:border-border hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden rounded-3xl">
                                                <div className="aspect-video bg-muted overflow-hidden relative">
                                                    {post.thumbnail ? (
                                                        <img
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20">
                                                            <div className="text-4xl font-black opacity-10">THE LAB</div>
                                                        </div>
                                                    )}

                                                    {/* Category Badge overlay */}
                                                    {post.category && (
                                                        <div className="absolute top-4 left-4">
                                                            <span className="px-3 py-1 bg-background/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/10">
                                                                {post.category.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col space-y-4">
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                                                            <Calendar size={12} />
                                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Just now'}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                                                            <User size={12} />
                                                            {post.author?.name || 'Admin'}
                                                        </span>
                                                    </div>

                                                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
                                                        {post.title}
                                                    </h2>

                                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="pt-4 mt-auto border-t border-border/50">
                                                        <div className="flex items-center justify-between text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            <span>Đọc thêm</span>
                                                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-card/50 hover:bg-muted font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={16} className="rotate-180" />
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
                                                            : "border border-border bg-card/50 hover:bg-muted"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-card/50 hover:bg-muted font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={16} />
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
        </div >
    );
}

