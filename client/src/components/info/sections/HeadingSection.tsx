'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';

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
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2",
                            section.backgroundTheme === 'dark'
                                ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                : "bg-primary/10 text-primary border border-primary/10"
                        )}>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {section.tag}
                        </div>
                    )}

                    {section.title && (
                        <h2 className={cn(
                            "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
                            section.backgroundTheme === 'dark' ? "text-white" : "text-zinc-900"
                        )}>
                            {section.title}
                        </h2>
                    )}

                    {section.subtitle && (
                        <p className={cn(
                            "text-lg",
                            section.backgroundTheme === 'dark' ? "text-zinc-400" : "text-muted-foreground"
                        )}>
                            {section.subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
