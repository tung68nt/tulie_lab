'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Button } from './Button';
import { sendGTMEvent } from '@/lib/gtm';

interface CourseCardProps {
    title: string;
    slug: string;
    description: string;
    price: number;
    thumbnail?: string;
    deploymentStatus?: 'RELEASED' | 'COMING_SOON' | 'UPDATING';
    tag?: 'NONE' | 'BEST_SELLER' | 'HOT' | 'NEW' | 'DISCOUNT';
}

export function CourseCard({ title, slug, description, price, thumbnail, deploymentStatus = 'RELEASED', tag = 'NONE' }: CourseCardProps) {
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
            <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl dark:border-zinc-800 bg-card/50 backdrop-blur-sm border-zinc-200/50">
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
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {price === 0 && deploymentStatus === 'RELEASED' && (
                            <div className="rounded-md bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-black border border-zinc-200">
                                MIỄN PHÍ
                            </div>
                        )}
                        {tag && tag !== 'NONE' && deploymentStatus === 'RELEASED' && (
                            <div className="rounded-md bg-black/80 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white border border-zinc-800">
                                {tag === 'BEST_SELLER' && 'BEST SELLER'}
                                {tag === 'HOT' && 'HOT'}
                                {tag === 'NEW' && 'NEW'}
                                {tag === 'DISCOUNT' && 'GIẢM GIÁ'}
                            </div>
                        )}
                    </div>

                    {(deploymentStatus === 'COMING_SOON' || deploymentStatus === 'UPDATING') && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/40 backdrop-blur-[2px]">
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase border border-white/10">
                                {deploymentStatus === 'COMING_SOON' ? 'Sắp ra mắt' : 'Đang nâng cấp'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content - Bottom Side */}
                <div className="flex flex-1 flex-col p-6 bg-gradient-to-br from-transparent to-zinc-50/10">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-1 w-8 bg-primary/40 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Course Roadmap</span>
                        </div>
                        <h3 className="mb-3 line-clamp-2 font-heading text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                        <div className="flex flex-col">
                            {price > 0 ? (
                                <>
                                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Học phí ưu đãi</span>
                                    <span className="text-xl font-black text-foreground flex items-baseline gap-1">
                                        {new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(price)}
                                        <span className="text-xs font-black text-zinc-400">₫</span>
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-black text-primary uppercase tracking-tight">Truy cập miễn phí</span>
                            )}
                        </div>

                        <div className="group/btn relative px-5 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-black transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                            Chi tiết
                            <svg className="w-3.5 h-3.5 translate-x-0 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
