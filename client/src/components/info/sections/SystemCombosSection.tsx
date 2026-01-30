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
                    <div className="flex flex-col gap-10 max-w-[1100px] mx-auto">
                        {combos.map((combo: Bundle) => (
                            <div key={combo.id} className="group relative">
                                <Link href={`/combos/${combo.slug}`}>
                                    <Card className="flex flex-col md:flex-row overflow-hidden border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 bg-background/50 backdrop-blur-xl group min-h-[400px]">
                                        {/* Thumbnail Section - Left side */}
                                        <div className="relative w-full md:w-[42%] aspect-[16/9] md:aspect-auto overflow-hidden">
                                            <Image
                                                src={combo.thumbnail || "/hero_vibe_coding.png"}
                                                alt={combo.name}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30" />

                                            {/* Exclusive Badge */}
                                            <div className="absolute top-6 left-6 z-10">
                                                <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                                                    Tiết kiệm tối đa
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section - Right side */}
                                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                                                            <TrendingUp className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-primary tracking-wide">Combo lộ trình tối ưu</span>
                                                    </div>

                                                    <h3 className={cn(
                                                        "text-2xl md:text-3xl font-bold font-heading leading-tight group-hover:text-primary transition-colors",
                                                        section.backgroundTheme === 'dark'
                                                            ? "text-zinc-50"
                                                            : "text-zinc-900"
                                                    )}>
                                                        {combo.name}
                                                    </h3>

                                                    <p className={cn(
                                                        "text-lg line-clamp-2 leading-relaxed max-w-2xl",
                                                        section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-zinc-600"
                                                    )}>
                                                        {combo.description}
                                                    </p>
                                                </div>

                                                {/* Child Courses List */}
                                                {combo.courses && combo.courses.length > 0 && (
                                                    <div className="py-4 border-y border-border/40">
                                                        <span className={cn(
                                                            "text-[10px] font-bold tracking-wider mb-4 block uppercase opacity-60",
                                                            section.backgroundTheme === 'dark' ? "text-zinc-500" : "text-muted-foreground"
                                                        )}>Lộ trình bao gồm {combo.courses.length} chặng học:</span>
                                                        <div className="flex flex-col gap-4">
                                                            {combo.courses.map((item, i) => (
                                                                <div key={i} className="flex items-center gap-3 text-sm font-medium group/item">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors shrink-0" />
                                                                    <span className={cn(
                                                                        "truncate",
                                                                        section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-zinc-800"
                                                                    )}>{item.course?.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className={cn(
                                                        "flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm",
                                                        section.backgroundTheme === 'dark'
                                                            ? "bg-white/5 border-white/10 text-zinc-300"
                                                            : "bg-zinc-100 border-zinc-200 text-zinc-700"
                                                    )}>
                                                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                                                        <span>Kiến thức thực chiến</span>
                                                    </div>
                                                    <div className={cn(
                                                        "flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm",
                                                        section.backgroundTheme === 'dark'
                                                            ? "bg-white/5 border-white/10 text-zinc-300"
                                                            : "bg-zinc-100 border-zinc-200 text-zinc-700"
                                                    )}>
                                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                                        <span>Truy cập trọn đời</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price & Action Row */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 mt-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-zinc-500 dark:text-zinc-400 line-through opacity-50 font-medium">
                                                        {combo.originalPrice?.toLocaleString('vi-VN')}₫
                                                    </span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                                            {combo.salePrice?.toLocaleString('vi-VN')}₫
                                                        </span>
                                                        <div className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold py-1 px-3 rounded-full border border-red-500/20">
                                                            -{Math.round((1 - (combo.salePrice || 0) / (combo.originalPrice || 1)) * 100)}% Tiết kiệm
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full sm:w-auto">
                                                    <div className="h-12 px-10 rounded-2xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 group-hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300 shadow-xl text-sm font-bold border-0">
                                                        <span>Khám phá lộ trình</span>
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
