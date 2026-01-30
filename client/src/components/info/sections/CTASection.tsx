'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';

import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';

export const CTASection = ({ section }: { section: Section }) => {
    const isDark = section.backgroundTheme === 'dark' || !section.backgroundTheme; // Default to dark for CTA
    return (
        <section className={cn(
            "py-20 md:py-32 relative overflow-hidden flex items-center justify-center transition-colors duration-300",
            isDark ? "bg-black text-white" : "bg-background text-foreground"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'dark'}
                overlayOpacity={section.overlayOpacity}
                hideGradients={isDark}
                glowVariant={15}
            />

            <div className="container text-center relative z-10 mx-auto px-4">
                <h2 className={cn(
                    "text-3xl md:text-5xl lg:text-7xl font-semibold mb-8 leading-tight tracking-tight py-2",
                    isDark ? "text-white" : "text-zinc-950 dark:text-white"
                )}>
                    {section.title}
                </h2>
                <p className={cn(
                    "text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed",
                    isDark ? "text-zinc-400" : "text-zinc-600 dark:text-zinc-400"
                )}>
                    {section.subtitle}
                </p>
                {section.ctaLink && (
                    <Button
                        variant="light"
                        size="lg"
                        onClick={() => {
                            const el = document.getElementById(section.ctaLink?.replace('#', '') || 'payment-section');
                            if (el) {
                                const offset = 80;
                                const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo({
                                    top: elementPosition - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={cn(
                            "text-lg px-8 py-6 font-semibold transition-colors shadow-xl",
                            isDark
                                ? "bg-foreground/90 text-background hover:bg-foreground"
                                : "bg-black text-white hover:bg-zinc-800"
                        )}
                    >
                        {section.ctaText || 'Đăng ký ngay'}
                    </Button>
                )}
            </div>
        </section>
    );
};
