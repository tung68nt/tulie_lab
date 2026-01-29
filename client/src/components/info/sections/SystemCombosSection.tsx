'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { BookOpen, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { SectionTag } from '@/components/SectionTag';
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
        <section className="py-12 md:py-20 bg-background">
            <div className="px-4 md:px-10 lg:px-16 w-full max-w-[1240px] mx-auto relative z-10">
                {/* Combos List (1 Column) */}
                {combos.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-4xl mx-auto">
                        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-xl font-bold mb-2">Chưa có lộ trình nào</h3>
                        <p className="text-muted-foreground">Vui lòng quay lại sau để cập nhật các lộ trình mới nhất.</p>
                        <Link href="/courses" className="mt-8 block">
                            <Button variant="outline">Xem tất cả khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-10 max-w-[1050px] mx-auto">
                        {combos.map((combo: Bundle) => (
                            <div key={combo.id} className="group relative bg-card border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row hover:-translate-y-1">
                                <Link href={`/combos/${combo.slug}`} className="absolute inset-0 z-10" />

                                {/* Image Side - Horizontal aspect */}
                                <div className="w-full md:w-[38%] relative overflow-hidden bg-zinc-100 min-h-[240px] md:min-h-full">
                                    <img
                                        src={combo.thumbnail || '/placeholder-combo.jpg'}
                                        alt={combo.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <div className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-[11px] font-bold shadow-xl border border-white/20">
                                            -{combo.discountPercent}% tiết kiệm
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-primary">Combo ưu đãi đặc biệt</span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-bold group-hover:text-primary transition-all leading-tight tracking-tight">
                                            {combo.name}
                                        </h3>

                                        <p className="text-muted-foreground text-sm md:text-base line-clamp-2 leading-relaxed font-medium opacity-80">
                                            {combo.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-zinc-500 pt-2">
                                            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-xl">
                                                <BookOpen className="w-4 h-4 text-zinc-400" />
                                                <span>{combo.courses?.length || 0} Khóa học chuyên sâu</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-xl">
                                                <Clock className="w-4 h-4 text-zinc-400" />
                                                <span>Lộ trình bài bản 1:1</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-10 mt-8 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-400 line-through font-bold opacity-50 mb-1">
                                                {combo.originalPrice?.toLocaleString()}₫
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tighter">
                                                    {combo.salePrice?.toLocaleString()}₫
                                                </span>
                                                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold py-1.5 px-3 rounded-xl border border-red-100 dark:border-red-500/20">
                                                    Tiết kiệm {Math.round((1 - (combo.salePrice || 0) / (combo.originalPrice || 1)) * 100)}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="h-12 px-6 rounded-2xl bg-zinc-950 dark:bg-zinc-800 group-hover:bg-primary text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-xl group-hover:shadow-primary/20 group-hover:scale-105 active:scale-95 text-sm font-bold">
                                                <span>Xem chi tiết</span>
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Benefits Section - Removed per user request */}
            </div>
        </section>
    );
};
