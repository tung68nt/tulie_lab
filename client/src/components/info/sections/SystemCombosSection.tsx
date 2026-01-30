'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { BookOpen, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

import { Card } from '@/components/Card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Section } from '@/types/sections';
import { Bundle } from '@/types/api';

export const SystemCombosSection = ({ section }: { section: Section }) => {
    const [combos, setCombos] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const data = await api.bundles.list() as Bundle[];
                setCombos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch combos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCombos();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-background flex flex-col items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải các lộ trình học tập...</p>
            </div>
        );
    }

    return (
        <section className="py-12 md:py-24 bg-background">
            <div className="px-4 md:px-10 lg:px-16 w-full max-w-[1240px] mx-auto relative z-10">
                {/* Combos List (1 Column) */}
                {combos.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] w-full max-w-4xl mx-auto">
                        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold mb-2">Chưa có lộ trình nào</h3>
                        <p className="text-muted-foreground text-sm">Vui lòng quay lại sau để cập nhật các lộ trình mới nhất.</p>
                        <Link href="/courses" className="mt-8 block">
                            <Button variant="outline">Xem tất cả khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 max-w-[1050px] mx-auto">
                        {combos.map((combo: Bundle) => (
                            <div key={combo.id} className="group relative">
                                <Link href={`/combos/${combo.slug}`}>
                                    <Card className="h-full flex flex-col overflow-hidden border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 bg-background/50 backdrop-blur-xl group">
                                        {/* Thumbnail Section */}
                                        <div className="relative aspect-[16/9] overflow-hidden">
                                            <Image
                                                src={combo.thumbnail || "/placeholder.jpg"}
                                                alt={combo.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Exclusive Badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-lg border border-white/20 shadow-lg">
                                                    Tiết kiệm tối đa
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 md:p-8 flex flex-col flex-grow space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-primary tracking-wide">Combo ưu đãi đặc biệt</span>
                                                </div>

                                                <h3 className={cn(
                                                    "text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors",
                                                    section.backgroundTheme === 'dark' ? "text-zinc-50" : "text-zinc-900"
                                                )}>
                                                    {combo.name}
                                                </h3>

                                                <p className={cn(
                                                    "text-sm md:text-base line-clamp-2 leading-relaxed",
                                                    section.backgroundTheme === 'dark' ? "text-zinc-400" : "text-zinc-600"
                                                )}>
                                                    {combo.description}
                                                </p>

                                                {/* Child Courses List */}
                                                {combo.courses && combo.courses.length > 0 && (
                                                    <div className="pt-2">
                                                        <span className={cn(
                                                            "text-[11px] font-bold tracking-wider mb-4 block",
                                                            section.backgroundTheme === 'dark' ? "text-zinc-500" : "text-muted-foreground"
                                                        )}>Bao gồm {combo.courses.length} khóa học:</span>
                                                        <div className="flex flex-col gap-3">
                                                            {combo.courses.map((item, i) => (
                                                                <div key={i} className="flex items-center gap-3 text-[15px] font-medium group/item">
                                                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                                                                    <span className={cn(
                                                                        "truncate",
                                                                        section.backgroundTheme === 'dark' ? "text-zinc-200" : "text-zinc-900"
                                                                    )}>{item.course?.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                                    <div className={cn(
                                                        "flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-sm",
                                                        section.backgroundTheme === 'dark'
                                                            ? "bg-black/40 border-white/20 text-white"
                                                            : "bg-white/50 border-black/10 text-black"
                                                    )}>
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        <span>Lộ trình bài bản</span>
                                                    </div>
                                                    <div className={cn(
                                                        "flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-sm",
                                                        section.backgroundTheme === 'dark'
                                                            ? "bg-black/40 border-white/20 text-white"
                                                            : "bg-white/50 border-black/10 text-black"
                                                    )}>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>Hỗ trợ 1:1 chuyên sâu</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price & Action Row */}
                                            <div className="flex items-center justify-between pt-8 mt-auto border-t border-border/40">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-muted-foreground line-through opacity-60">
                                                        {combo.originalPrice?.toLocaleString()}₫
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl md:text-3xl font-bold text-foreground">
                                                            {combo.salePrice?.toLocaleString()}₫
                                                        </span>
                                                        <div className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold py-1 px-2.5 rounded-lg border border-red-500/20">
                                                            -{Math.round((1 - (combo.salePrice || 0) / (combo.originalPrice || 1)) * 100)}% Tiết kiệm
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="hidden sm:block">
                                                    <div className="h-11 px-8 rounded-xl bg-black text-white group-hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all duration-300 shadow-xl text-sm font-bold">
                                                        <span>Chi tiết</span>
                                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
