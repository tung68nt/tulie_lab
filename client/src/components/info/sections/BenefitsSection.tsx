'use client';

import { DynamicIcon } from '@/components/DynamicIcon';
import Link from 'next/link';
import { BENEFITS_DATA } from '@/lib/benefits';
import { StandardSectionHeader } from '../StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

import { Section } from '@/types/sections';

interface BenefitsSectionProps {
    section: Section;
}

import { SectionBackground } from '../SectionBackground';

export function BenefitsSection({ section }: BenefitsSectionProps) {
    const title = section?.title || 'Quyền Lợi Học Viên';
    const subtitle = section?.subtitle || 'Những đặc quyền chỉ có tại cộng đồng học tập của chúng tôi';
    const items = section?.items || [];

    const displayItems = items.length > 0 ? items : BENEFITS_DATA;
    const isDark = section?.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "py-16 md:py-20 relative",
            "py-16 md:py-20 relative",
            isDark
                ? "bg-[#050505] text-white"
                : section.backgroundTheme === 'light'
                    ? "bg-white dark:bg-[#050505] text-zinc-950 dark:text-white"
                    : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={isDark}
                glowVariant={1}
            />

            <div className="container relative z-10">
                <FadeIn direction="up">
                    <StandardSectionHeader
                        section={section}
                    />
                </FadeIn>

                <FadeIn direction="up" delay={0.4} duration={0.6}>
                    <div className="flex flex-wrap justify-center gap-6">
                        {displayItems.map((item: any, idx) => (
                            <div
                                key={idx}
                                className="group relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] min-w-[280px] flex flex-col"
                            >
                                <Link href={item.href || item.link || `/blog/${item.slug || 'all'}`} className={cn(
                                    "h-full border border-border/50 hover:border-primary/30 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm flex flex-col relative block text-left",
                                    section.backgroundTheme === 'dark'
                                        ? "bg-zinc-900 border-zinc-800"
                                        : section.backgroundTheme === 'light'
                                            ? "bg-white border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900/80"
                                            : "bg-card hover:bg-card/50"
                                )}>
                                    {/* Decorative Glow - Removed or toned down */}

                                    <div className="mb-6 relative">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                                            {item.icon ? (
                                                <DynamicIcon name={item.icon} size={28} strokeWidth={2} className="shrink-0" />
                                            ) : (
                                                <div className="w-7 h-7 bg-current rounded-md opacity-20" />
                                            )}
                                        </div>
                                    </div>

                                    <h3 className={cn(
                                        "text-xl font-bold mb-3 transition-colors group-hover:text-primary min-h-[56px] line-clamp-2",
                                        isDark ? "text-zinc-50" : (section.backgroundTheme === 'light' ? "text-zinc-900 dark:text-white" : "text-zinc-900 dark:text-zinc-50")
                                    )}>
                                        {item.title || item.label}
                                    </h3>

                                    <p className={cn(
                                        "leading-relaxed text-sm flex-1 mb-4",
                                        isDark ? "text-zinc-300" : (section.backgroundTheme === 'light' ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-300")
                                    )}>
                                        {item.description || item.content || 'Nội dung chi tiết đang được cập nhật.'}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center text-primary text-sm font-bold group-hover:translate-x-1 transition-transform duration-300">
                                        Chi tiết <span className="ml-1">→</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
