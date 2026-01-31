'use client';

import { cn } from '@/lib/utils';
import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { DynamicIcon } from '@/components/DynamicIcon';

import { SectionBackground } from '../SectionBackground';

import { Badge } from '@/components/Badge';

export function UpsellSection({ section, upsellCourse, upsellProduct, upsellPrice }: { section: Section; upsellCourse?: any; upsellProduct?: any; upsellPrice?: any }) {
    const displayItems = section.items || [];

    if (displayItems.length === 0) return null;

    return (
        <section className={cn(
            "py-24 relative overflow-hidden transition-colors duration-300",
            section.backgroundTheme === 'dark' || !section.backgroundTheme
                ? "bg-[#050505] text-white"
                : section.backgroundTheme === 'light'
                    ? "bg-white dark:bg-[#050505] text-zinc-950 dark:text-white"
                    : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'dark'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={14}
            />
            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h2 className={cn(
                        "text-3xl font-bold tracking-tight mb-4 py-2",
                        section.backgroundTheme === 'dark' ? "text-white" : "text-zinc-950 dark:text-white"
                    )}>{section.title}</h2>
                    <p className={cn(
                        "text-lg leading-relaxed",
                        section.backgroundTheme === 'dark' ? "text-zinc-300" : (section.backgroundTheme === 'light' ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-300")
                    )}>{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {displayItems.map((item: any, index: number) => {
                        const isRetail = item.id?.includes('retail') || item.title?.includes('Mua lẻ');
                        const ButtonComponent = (
                            <Button
                                onClick={() => {
                                    if (!item.link || item.link === '#payment') {
                                        const el = document.getElementById('payment-section');
                                        if (el) {
                                            const offset = 80;
                                            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                            window.scrollTo({
                                                top: elementPosition - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }
                                }}
                                variant={isRetail ? "outline" : "default"}
                                className={`w-full py-6 rounded-2xl shadow-none transition-all duration-300 ${isRetail
                                    ? "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                                    : "bg-white text-black hover:bg-zinc-100 font-semibold border border-zinc-200 dark:border-zinc-700 dark:bg-black dark:text-white"
                                    }`}
                            >
                                {item.ctaText || "Đăng ký ngay"}
                            </Button>
                        );

                        return (
                            <div key={item.id || index} className={cn(
                                "relative group rounded-[2rem] border border-zinc-100 p-6 md:p-8 hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col overflow-hidden",
                                section.backgroundTheme === 'dark'
                                    ? "bg-zinc-900"
                                    : section.backgroundTheme === 'light'
                                        ? "bg-white dark:bg-zinc-900"
                                        : "bg-background"
                            )}>
                                {item.tag && (
                                    <div className="absolute -top-1.5 right-8">
                                        <Badge variant="outline" showDot={false} className="bg-background">
                                            {item.tag}
                                        </Badge>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 mb-5 group-hover:bg-zinc-100 transition-colors duration-300`}>
                                        <DynamicIcon name={item.icon || 'Package'} className="w-6 h-6 stroke-[1.5px]" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{item.title}</h3>

                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className={cn(
                                            "text-2xl font-semibold flex items-baseline gap-0.5",
                                            section.backgroundTheme === 'dark' ? "text-white" : "text-zinc-950 dark:text-white"
                                        )}>
                                            {item.price}<sup className="text-xs">đ</sup>
                                        </span>
                                        {Boolean(item.originalPrice) && (
                                            <span className="text-sm text-muted-foreground line-through font-normal flex items-baseline gap-0.5">
                                                {item.originalPrice}<sup className="text-[10px]">đ</sup>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className={cn(
                                    "text-sm leading-relaxed mb-6 min-h-[3rem]",
                                    section.backgroundTheme === 'dark' ? "text-zinc-300" : (section.backgroundTheme === 'light' ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-300")
                                )}>{item.description}</p>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {item.features?.map((feature: string, i: number) => (
                                        <li key={i} className={cn(
                                            "flex items-center gap-3 text-xs font-medium",
                                            section.backgroundTheme === 'dark' ? "text-zinc-300" : (section.backgroundTheme === 'light' ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-300")
                                        )}>
                                            <div className="w-5 h-5 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                                <DynamicIcon name="Check" className="w-2.5 h-2.5 text-zinc-400 dark:text-zinc-300 stroke-[3px]" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    {item.link && item.link !== '#payment' ? (
                                        <Link href={item.link} className="w-full block">
                                            {ButtonComponent}
                                        </Link>
                                    ) : ButtonComponent}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
