'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';

export const HeadingSection = ({ section }: { section: Section }) => {
    const align = section.align || 'center';

    return (
        <section className={cn("py-12 relative overflow-hidden", section.className)}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={section.glowVariant}
            />

            <div className="container relative z-10 px-6 mx-auto max-w-[1240px]">
                <div className={cn(
                    "max-w-3xl mx-auto space-y-4",
                    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                )}>
                    {section.tag && (
                        <SectionTag
                            variant={section.backgroundTheme === 'dark' ? 'dark' : 'default'}
                            className="mb-2"
                        >
                            {section.tag}
                        </SectionTag>
                    )}

                    {section.title && (
                        <h2 className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
                            section.backgroundTheme === 'dark' ? "text-zinc-50" : "text-zinc-900"
                        )}>
                            {section.title}
                        </h2>
                    )}

                    {section.subtitle && (
                        <p className={cn(
                            "text-lg",
                            section.backgroundTheme === 'dark' ? "text-zinc-400" : "text-zinc-600"
                        )}>
                            {section.subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
