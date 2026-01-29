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
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme || 'dark'}
                overlayOpacity={section.overlayOpacity}
                hideGradients={isDark}
                glowVariant={15}
            />

            <div className="container text-center relative z-10 mx-auto px-4">
                <h2 className={cn(
                    "text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight py-2",
                    isDark ? "text-white" : "text-foreground"
                )}>
                    {section.title}
                </h2>
                <p className={cn(
                    "text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed",
                    isDark ? "text-zinc-400" : "text-muted-foreground"
                )}>
                    {section.subtitle}
                </p>
                {section.ctaLink && (
                    <Button
                        variant="light"
                        size="lg"
                        onClick={() => {
                            const el = document.getElementById('payment-section');
                            if (el) {
                                const offset = 80;
                                const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo({
                                    top: elementPosition - offset,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className="text-lg px-8 py-6 font-bold bg-white text-black hover:bg-zinc-200 transition-colors shadow-xl"
                    >
                        {section.ctaText || 'Đăng ký ngay'}
                    </Button>
                )}
            </div>
        </section>
    );
};
