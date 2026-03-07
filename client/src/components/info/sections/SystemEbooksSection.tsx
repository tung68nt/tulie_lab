'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import {  BookOpen, Search, Eye, ShoppingCart , Loader2 } from 'lucide-react';
import { Section } from '@/types/sections';
import { SectionTag } from '@/components/SectionTag';
import { SectionBackground } from '../SectionBackground';

interface Ebook {
    id: string;
    title: string;
    slug: string;
    description?: string;
    cover?: string;
    totalPages?: number;
    previewPages: number;
    price: number | string;
    productId?: string;
}

export const SystemEbooksSection = ({ section }: { section: Section }) => {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const res: any = await api.ebooks.list({ limit: 50 });
                setEbooks(res?.data || []);
            } catch (err: any) {
                console.error('Failed to load ebooks:', err);
                setError('Không thể tải danh sách ebook');
                setEbooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEbooks();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải ebook...</p>
            </div>
        );
    }

    return (
        <section className="py-10 md:py-20 bg-background relative">
            <div className="absolute inset-0 overflow-hidden">
                <SectionBackground
                    backgroundImage={section.backgroundImage}
                    backgroundTheme={section.backgroundTheme || 'light'}
                    overlayOpacity={section.overlayOpacity}
                    showDotPattern={section.showDotPattern}
                    backgroundPattern={section.backgroundPattern}
                />
            </div>
            <div className="container relative z-10 px-6 max-w-[1200px] mx-auto">
                {/* Header */}
                {(section.tag || section.title) && (
                    <div className="text-center mb-12">
                        {section.tag && (
                            <SectionTag className="mb-4 mx-auto">{section.tag}</SectionTag>
                        )}
                        {section.title && (
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">{section.title}</h2>
                        )}
                        {section.subtitle && (
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{section.subtitle}</p>
                        )}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border/50 bg-muted/10">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!error && ebooks.length === 0 && (
                    <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border/50 bg-muted/10">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-muted-foreground mb-2">Chưa có ebook nào</p>
                        <p className="text-sm text-muted-foreground">Ebook sẽ được hiển thị tại đây khi có sẵn.</p>
                    </div>
                )}

                {/* Ebook Grid */}
                {!error && ebooks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ebooks.map((ebook) => {
                            const price = Number(ebook.price);
                            return (
                                <div
                                    key={ebook.id}
                                    className="group relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
                                >
                                    {/* Cover Image */}
                                    <div className="aspect-[3/4] w-full overflow-hidden relative bg-muted/20">
                                        {ebook.cover ? (
                                            <img
                                                src={ebook.cover}
                                                alt={ebook.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                                                <BookOpen className="w-16 h-16 text-muted-foreground/20" />
                                            </div>
                                        )}
                                        {/* Page count badge */}
                                        {ebook.totalPages && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-black/70 text-white rounded-md backdrop-blur-sm">
                                                    <BookOpen className="w-3 h-3" />
                                                    {ebook.totalPages} trang
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-base font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
                                            {ebook.title}
                                        </h3>
                                        {ebook.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                                                {ebook.description}
                                            </p>
                                        )}
                                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/30">
                                            <span className="text-lg font-bold text-foreground">
                                                {price === 0
                                                    ? 'Miễn phí'
                                                    : <>{new Intl.NumberFormat('vi-VN').format(price)}<sup className="text-[10px] ml-0.5">đ</sup></>}
                                            </span>
                                            <Link href={`/ebooks/${ebook.slug}`}>
                                                <Button size="sm" className="rounded-xl h-9 font-semibold text-xs px-4 pointer-events-none">
                                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                    Xem
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
