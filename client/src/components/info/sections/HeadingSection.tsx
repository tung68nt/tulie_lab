'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { FadeIn } from '@/components/animations/FadeIn';

export const HeadingSection = ({ section }: { section: Section }) => {
    const align = section.align || 'center';

    return (
        <section className={cn(
            "py-12 relative overflow-hidden",
            (section.backgroundTheme === 'dark' || !section.backgroundTheme) ? "bg-[#050505] text-white" : "bg-background text-foreground",
            section.className
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'dark'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={section.glowVariant}
            />

            <div className="container relative z-10 px-6 mx-auto max-w-[1240px]">
                <FadeIn direction="up">
                    <div className={cn(
                        "max-w-3xl mx-auto space-y-4",
                        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                    )}>
                        {section.tag && (
                            <SectionTag
                                variant={(section.backgroundTheme === 'dark' || !section.backgroundTheme) ? 'dark' : 'default'}
                                className="mb-2"
                            >
                                {section.tag}
                            </SectionTag>
                        )}

                        {section.title && (
                            <h2 className={cn(
                                "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
                                (section.backgroundTheme === 'dark' || !section.backgroundTheme)
                                    ? "text-white"
                                    : section.backgroundTheme === 'light'
                                        ? "text-zinc-900"
                                        : "text-zinc-900 dark:text-white"
                            )}>
                                {section.title}
                            </h2>
                        )}

                        {section.subtitle && (
                            <p className={cn(
                                "text-lg",
                                section.backgroundTheme === 'dark'
                                    ? "text-zinc-400"
                                    : section.backgroundTheme === 'light'
                                        ? "text-zinc-600"
                                        : "text-zinc-600 dark:text-zinc-400"
                            )}>
                                {section.subtitle}
                            </p>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
