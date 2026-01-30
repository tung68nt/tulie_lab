'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Badge } from '@/components/Badge';
import { SectionTag } from '@/components/SectionTag';
import { BookOpen, Clock, Users, Play, Star, ChevronRight, Layout, Code, Key, Zap, Package } from 'lucide-react';
import { Button } from './Button';
import { sendGTMEvent } from '@/lib/gtm';

interface CourseCardProps {
    title: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    thumbnail?: string;
    deploymentStatus?: 'RELEASED' | 'COMING_SOON' | 'UPDATING';
    tag?: 'NONE' | 'BEST_SELLER' | 'HOT' | 'NEW' | 'DISCOUNT';
    isBundle?: boolean;
    category?: string;
}

export function CourseCard({ title, slug, description, price, originalPrice, thumbnail, deploymentStatus = 'RELEASED', tag = 'NONE', isBundle = false, category }: CourseCardProps) {
    const handleCardClick = () => {
        sendGTMEvent('view_item', {
            currency: 'VND',
            value: price,
            items: [{
                item_id: slug,
                item_name: title,
                price: price
            }]
        });
    };

    return (
        <Link href={`/courses/${slug}`} className="group block h-full" onClick={handleCardClick}>
            <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 dark:border-zinc-800 bg-card/50 backdrop-blur-sm border-zinc-200/50">
                {/* Thumbnail - Top Side */}
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted group-hover:brightness-110 transition-all duration-500">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-4xl text-zinc-300">—</span>
                        </div>
                    )}

                    {/* Tags on Thumbnail */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 transition-transform duration-500 group-hover:translate-x-1">
                        <Badge
                            variant="secondary"
                            showDot
                            animate={false}
                            className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-white/20 shadow-xl py-1.5 px-3"
                        >
                            {isBundle ? 'Combo lộ trình' : 'Khóa học'}
                        </Badge>
                        {category && (
                            <Badge
                                variant="secondary"
                                showDot
                                animate={false}
                                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-white/20 shadow-xl py-1.5 px-3"
                            >
                                {category}
                            </Badge>
                        )}
                        {price === 0 && deploymentStatus === 'RELEASED' && (
                            <div className="rounded-md bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-black border border-zinc-200">
                                Miễn phí
                            </div>
                        )}
                        {tag && tag !== 'NONE' && deploymentStatus === 'RELEASED' && (
                            <div className="rounded-md bg-black/80 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white border border-zinc-800">
                                {tag === 'BEST_SELLER' && 'Best Seller'}
                                {tag === 'HOT' && 'Hot'}
                                {tag === 'NEW' && 'New'}
                                {tag === 'DISCOUNT' && 'Giảm giá'}
                            </div>
                        )}
                    </div>

                    {(deploymentStatus === 'COMING_SOON' || deploymentStatus === 'UPDATING') && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/40 backdrop-blur-[2px]">
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 text-[10px] font-semibold text-white border border-white/10">
                                {deploymentStatus === 'COMING_SOON' ? 'Sắp ra mắt' : 'Đang nâng cấp'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content - Bottom Side */}
                <div className="flex flex-1 flex-col p-6 bg-gradient-to-br from-transparent to-zinc-50/10">
                    <div className="mb-4">
                        <h3 className="mb-3 line-clamp-2 text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/50 space-y-4">
                        <div className="flex flex-col">
                            {price > 0 ? (
                                <>
                                    <span className="text-[10px] text-zinc-400 mb-1">Học phí ưu đãi</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold text-foreground flex items-baseline gap-1">
                                            {new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(price)}
                                            <span className="text-xs font-semibold text-zinc-400">₫</span>
                                        </span>
                                        {originalPrice && Number(originalPrice) > Number(price) && (
                                            <>
                                                <span className="text-xs text-zinc-400 line-through">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(Number(originalPrice))}₫
                                                </span>
                                                <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                                                    -{Math.round((1 - Number(price) / Number(originalPrice)) * 100)}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <span className="text-lg font-semibold text-primary tracking-tight">Truy cập miễn phí</span>
                            )}
                        </div>

                        <div className="group/btn relative w-full h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-semibold transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-2">
                            Xem chi tiết
                            <svg className="w-3.5 h-3.5 translate-x-0 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
