'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const CTABoxSection = ({ section }: { section: Section }) => {
    const isDarkBg = section.backgroundTheme === 'dark';
    const align = section.align || 'center';

    return (
        <section className={cn("py-12 relative overflow-hidden bg-background", section.className)}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'dark'}
                overlayOpacity={section.overlayOpacity || 0.6}
                glowVariant={section.glowVariant}
                className="opacity-100"
            />

            <div className="container relative z-10 px-6 mx-auto max-w-[1000px]">
                <div className={cn(
                    "relative overflow-hidden rounded-3xl p-8 md:p-12 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
                    section.backgroundTheme === 'dark'
                        ? "bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20"
                        : "bg-card border-border shadow-lg"
                )}>
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className={cn(
                        "relative z-10 flex flex-col md:flex-row items-center gap-8",
                        align === 'center' ? 'text-center md:text-left' : ''
                    )}>
                        <div className="flex-1 space-y-3">
                            {section.title && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        {section.tag && (
                                            <span className="text-sm font-bold tracking-wider text-primary uppercase">
                                                {section.tag}
                                            </span>
                                        )}
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    </div>
                                    <h3 className={cn(
                                        "text-3xl md:text-4xl font-bold tracking-tight",
                                        isDarkBg ? "text-white" : "text-zinc-950 dark:text-white"
                                    )}>
                                        {section.title}
                                    </h3>
                                </div>
                            )}
                            {section.subtitle && (
                                <p className={cn(
                                    "text-base md:text-lg leading-relaxed",
                                    isDarkBg ? "text-zinc-400" : "text-muted-foreground dark:text-zinc-400"
                                )}>
                                    {section.subtitle}
                                </p>
                            )}
                        </div>

                        {section.ctaText && section.ctaLink && (
                            <Link href={section.ctaLink}>
                                <Button
                                    size="lg"
                                    className={cn(
                                        "rounded-full px-8 h-12 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95",
                                        section.backgroundTheme !== 'dark'
                                            ? "bg-black text-white hover:bg-zinc-800 dark:border dark:border-white/20 dark:bg-black"
                                            : "bg-white text-black hover:bg-zinc-200" // Explicit high contrast
                                    )}
                                >
                                    {section.ctaText}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
