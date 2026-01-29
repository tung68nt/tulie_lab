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
                            <div key={combo.id} className="group relative bg-card border border-border/50 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row hover:-translate-y-1">
                                <Link href={`/combos/${combo.slug}`} className="absolute inset-0 z-10" />

                                {/* Image Side */}
                                <div className="w-full md:w-[35%] relative overflow-hidden bg-muted min-h-[280px] md:min-h-full">
                                    <img
                                        src={combo.thumbnail || '/placeholder-combo.jpg'}
                                        alt={combo.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>

                                {/* Content Side */}
                                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between overflow-hidden">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">Combo ưu đãi đặc biệt</span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-semibold group-hover:text-primary transition-all leading-tight">
                                            {combo.name}
                                        </h3>

                                        <p className="text-muted-foreground text-sm md:text-base line-clamp-2 leading-relaxed opacity-90">
                                            {combo.description}
                                        </p>

                                        {/* Child Courses List */}
                                        {combo.courses && combo.courses.length > 0 && (
                                            <div className="pt-2">
                                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Bao gồm {combo.courses.length} khóa học:</span>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                                    {combo.courses.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-xs text-foreground/80 group/item">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                                                            <span className="truncate">{item.course?.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 pt-2">
                                            <div className="flex items-center gap-2.5 bg-secondary/50 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-border/50">
                                                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>Lộ trình bài bản</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-secondary/50 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-border/50">
                                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>Hỗ trợ 1:1 chuyên sâu</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/40">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground line-through opacity-60">
                                                {combo.originalPrice?.toLocaleString()}₫
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl md:text-3xl font-semibold text-foreground">
                                                    {combo.salePrice?.toLocaleString()}₫
                                                </span>
                                                <div className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-semibold py-1 px-2.5 rounded-lg border border-red-500/20">
                                                    -{Math.round((1 - (combo.salePrice || 0) / (combo.originalPrice || 1)) * 100)}% Tiết kiệm
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block">
                                            <div className="h-11 px-6 rounded-xl bg-foreground text-background group-hover:bg-primary group-hover:text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-sm text-sm font-semibold">
                                                <span>Chi tiết</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
