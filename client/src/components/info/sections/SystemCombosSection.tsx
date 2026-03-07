'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getMediaUrl } from '@/lib/api';
import { Button } from '@/components/Button';
import { BookOpen, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

import { Card } from '@/components/Card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Section } from '@/types/sections';
import { Bundle } from '@/types/api';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';

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
            <section className="py-10 bg-background relative overflow-hidden flex flex-col items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải các lộ trình học tập...</p>
            </section>
        );
    }


    return (
        <section className={cn(
            "pb-12 md:pb-24 pt-0 relative",
            section.backgroundTheme === 'dark'
                ? "bg-[#050505] text-white"
                : section.backgroundTheme === 'light'
                    ? "bg-white dark:bg-[#050505] text-zinc-950 dark:text-white"
                    : "bg-background text-foreground"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
            />
            <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
                {/* Combos List (1 Column) */}
                {combos.length === 0 ? (
                    <div className={cn(
                        "text-center py-24 border rounded-[2.5rem] w-full max-w-4xl mx-auto",
                        section.backgroundTheme === 'dark'
                            ? "bg-zinc-900 border-zinc-800"
                            : section.backgroundTheme === 'light'
                                ? "bg-zinc-50 border-zinc-200"
                                : "bg-card border-border"
                    )}>
                        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold mb-2">Chưa có lộ trình nào</h3>
                        <p className="text-muted-foreground text-sm">Vui lòng quay lại sau để cập nhật các lộ trình mới nhất.</p>
                        <Link href="/courses" className="mt-8 block">
                            <Button variant="outline" as="div">Xem tất cả khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 max-w-[1100px] mx-auto">
                        {combos.map((combo: Bundle) => (
                            <div key={combo.id} className="group relative">
                                <Card className={cn(
                                    "flex flex-col md:flex-row overflow-hidden hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 backdrop-blur-xl group min-h-[400px]",
                                    section.backgroundTheme === 'dark'
                                        ? "bg-zinc-900/50 border-white/10"
                                        : section.backgroundTheme === 'light'
                                            ? "bg-white border-zinc-200 shadow-sm"
                                            : "bg-background/50 border-border/40"
                                )}>
                                    {/* Thumbnail Section - Left side - Increased width & Standard img for external support */}
                                    <div className="relative w-full md:w-[42%] h-64 md:h-auto overflow-hidden shrink-0 bg-muted/20">
                                        <img
                                            src={getMediaUrl(combo.thumbnail || "") || "/hero_vibe_coding.png"}
                                            alt={combo.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                        />
                                        {/* Minimal overlay for depth */}
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                    </div>

                                    {/* Content Section - Right side - Expanded */}
                                    <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <SectionTag
                                                    variant="black-pill"
                                                    showDot={false}
                                                >
                                                    Combo lộ trình
                                                </SectionTag>

                                                <h3 className={cn(
                                                    "text-2xl md:text-3xl font-bold font-heading leading-tight group-hover:text-primary transition-colors",
                                                    section.backgroundTheme === 'dark'
                                                        ? "text-zinc-50"
                                                        : section.backgroundTheme === 'light'
                                                            ? "text-zinc-900 dark:text-white"
                                                            : "text-foreground"
                                                )}>
                                                    {combo.name}
                                                </h3>

                                                <p className={cn(
                                                    "text-lg line-clamp-2 leading-relaxed max-w-2xl",
                                                    section.backgroundTheme === 'dark'
                                                        ? "text-zinc-300"
                                                        : section.backgroundTheme === 'light'
                                                            ? "text-zinc-500 dark:text-zinc-400"
                                                            : "text-muted-foreground"
                                                )}>
                                                    {combo.description}
                                                </p>
                                            </div>

                                            {/* Child Courses List */}
                                            {combo.courses && combo.courses.length > 0 && (
                                                <div className="py-4 border-y border-border/40">
                                                    <span className={cn(
                                                        "text-base font-bold mb-4 block",
                                                        section.backgroundTheme === 'dark' || section.backgroundTheme === 'light'
                                                            ? "text-black dark:text-white"
                                                            : "text-foreground"
                                                    )}>Lộ trình bao gồm {combo.courses.length} chặng học:</span>
                                                    <div className="flex flex-col gap-4">
                                                        {combo.courses.map((item, i) => (
                                                            <div key={i} className="flex items-start gap-3 text-base font-medium group/item">
                                                                <span className="text-zinc-900 dark:text-zinc-100 font-bold select-none mt-0.5">{i + 1}.</span>
                                                                <span className={cn(
                                                                    "truncate",
                                                                    section.backgroundTheme === 'dark'
                                                                        ? "text-zinc-300"
                                                                        : section.backgroundTheme === 'light'
                                                                            ? "text-zinc-700 dark:text-zinc-300"
                                                                            : "text-foreground"
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
                                                        : section.backgroundTheme === 'light'
                                                            ? "bg-zinc-100 border-zinc-200 text-zinc-700"
                                                            : "bg-muted/50 border-border text-muted-foreground"
                                                )}>
                                                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                                                    <span>Kiến thức thực chiến</span>
                                                </div>
                                                <div className={cn(
                                                    "flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm",
                                                    section.backgroundTheme === 'dark'
                                                        ? "bg-white/5 border-white/10 text-zinc-300"
                                                        : section.backgroundTheme === 'light'
                                                            ? "bg-zinc-100 border-zinc-200 text-zinc-700"
                                                            : "bg-muted/50 border-border text-muted-foreground"
                                                )}>
                                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                                    <span>Truy cập trọn đời</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Action Row - Re-stacked for better flow */}
                                        <div className="flex flex-col gap-6 pt-8 mt-6">
                                            <div className="flex flex-col gap-1 items-end">
                                                {Boolean(combo.originalPrice) && (
                                                    <span className="text-sm text-zinc-500 dark:text-zinc-400 line-through opacity-50 font-medium flex items-baseline gap-0.5">
                                                        {combo.originalPrice?.toLocaleString('vi-VN')}<sup className="text-[10px]">đ</sup>
                                                    </span>
                                                )}
                                                <div className="flex items-center justify-end gap-4">
                                                    <div className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold py-1 px-3 rounded-full border border-red-500/20">
                                                        -{Math.round((1 - (combo.salePrice || 0) / (combo.originalPrice || 1)) * 100)}% Tiết kiệm
                                                    </div>
                                                    <span className="text-3xl font-bold text-zinc-900 dark:text-white flex items-baseline gap-1">
                                                        {combo.salePrice?.toLocaleString('vi-VN')}<sup className="text-sm">đ</sup>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full">
                                                <Link href={`/combos/${combo.slug}`}>
                                                    <div className={cn(
                                                        "h-14 w-full rounded-2xl group-hover:scale-[1.02] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl text-base font-semibold border-0",
                                                        section.backgroundTheme === 'dark'
                                                            ? "bg-white text-black hover:bg-zinc-200"
                                                            : section.backgroundTheme === 'light'
                                                                ? "bg-black text-white hover:bg-zinc-800"
                                                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    )}>
                                                        <span>Khám phá lộ trình</span>
                                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
