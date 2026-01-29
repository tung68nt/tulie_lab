'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { ChevronRight, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Section } from '@/types/sections';

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
    content?: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export const SystemBlogSection = ({ section }: { section: Section }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const postsPerPage = 9;

    const stripContent = (htmlOrMarkdown: string) => {
        return htmlOrMarkdown
            .replace(/<[^>]*>/g, '') // Remove HTML
            .replace(/[#*`_~]/g, '') // Remove basic markdown symbols
            .trim();
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.categories.list() as unknown;
                const categoriesData = Array.isArray(res) ? (res as Category[]) : ((res as { data?: Category[] }).data || []);
                setCategories(categoriesData);
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
                const categoryId = selectedCategories.length > 0 ? selectedCategories[0] : undefined;
                const res = await api.blog.list(currentPage, postsPerPage, categoryId) as { data: BlogPost[]; meta?: { total: number } };
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
    }, [currentPage, selectedCategories]);

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const toggleCategory = (categoryId: string) => {
        if (categoryId === 'all') {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(prev =>
                prev.includes(categoryId)
                    ? prev.filter(id => id !== categoryId)
                    : [...prev, categoryId]
            );
        }
        setCurrentPage(1);
    };

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container px-6 max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-8 lg:sticky lg:top-32 lg:self-start">
                        {/* Search Bar */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-muted-foreground/80 px-2 tracking-tight">Tìm kiếm</h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-3.5 h-3.5 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-transparent focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-muted-foreground/80 px-2 tracking-tight">Chuyên mục</h3>
                            <nav className="flex flex-col gap-1">
                                <button
                                    onClick={() => toggleCategory('all')}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                                        selectedCategories.length === 0
                                            ? "bg-muted/50 text-foreground font-bold"
                                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg border flex items-center justify-center transition-all",
                                        selectedCategories.length === 0 ? "bg-black border-black" : "border-muted-foreground/30"
                                    )}>
                                        {selectedCategories.length === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <span>Tất cả bài viết</span>
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={cn(
                                            "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                                            selectedCategories.includes(cat.id)
                                                ? "bg-muted/50 text-foreground font-bold"
                                                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg border flex items-center justify-center transition-all",
                                            selectedCategories.includes(cat.id) ? "bg-black border-black" : "border-muted-foreground/30"
                                        )}>
                                            {selectedCategories.includes(cat.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <span className="truncate">{cat.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Blog Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid gap-8 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse space-y-6">
                                        <div className="aspect-[16/10] bg-muted rounded-[2.5rem]" />
                                        <div className="space-y-3">
                                            <div className="h-4 bg-muted rounded w-1/4" />
                                            <div className="h-8 bg-muted rounded w-full" />
                                            <div className="h-4 bg-muted rounded w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Trống trải quá...</h3>
                                <p className="text-muted-foreground mb-8 text-lg">Chúng tôi chưa có bài viết nào trong mục này.</p>
                                <Button
                                    onClick={() => toggleCategory('all')}
                                    className="px-10 py-6 rounded-full text-lg shadow-xl hover:shadow-primary/20 transition-all font-bold"
                                >
                                    Xem tất cả bài viết
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-10 sm:grid-cols-2 mb-20">
                                    {posts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                                            <div className="flex flex-col h-full bg-card rounded-2xl border border-border/40 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                                                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                                    {post.thumbnail ? (
                                                        <img
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground/20">
                                                            <div className="text-2xl font-bold tracking-tighter">The Lab</div>
                                                        </div>
                                                    )}
                                                    {post.category && (
                                                        <div className="absolute top-4 left-4">
                                                            <span className="px-4 py-1.5 bg-background/90 backdrop-blur-xl text-[10px] font-bold tracking-wider rounded-lg shadow-sm border border-white/10">
                                                                {post.category.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                </div>
                                                <div className="flex flex-col flex-1 p-6 md:p-7 space-y-3">
                                                    <h2 className="text-xl md:text-2xl font-bold leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h2>
                                                    <p className="text-[14px] md:text-[15px] text-muted-foreground line-clamp-3 leading-relaxed font-normal flex-1">
                                                        {stripContent(post.excerpt || post.content || '')}
                                                    </p>
                                                    <div className="pt-3">
                                                        <div className="inline-flex items-center gap-1.5 text-[14px] font-bold text-foreground/80 transition-all group/btn hover:text-primary">
                                                            <span>Đọc thêm</span>
                                                            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-3">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="h-12 w-12 flex items-center justify-center rounded-2xl border bg-card hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <ChevronRight size={20} className="rotate-180" />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={cn(
                                                        "w-12 h-12 rounded-2xl text-sm font-bold transition-all",
                                                        currentPage === page
                                                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                                                            : "border bg-card hover:bg-muted shadow-sm"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-12 w-12 flex items-center justify-center rounded-2xl border bg-card hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
};
