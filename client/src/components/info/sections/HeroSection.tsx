'use client';

import { SectionTag } from '@/components/SectionTag';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Section } from '@/types/sections';
import { SectionBackground } from '../SectionBackground';

export function HeroSection({ section }: { section: Section }) {
    return (
        <section className="w-full pt-8 pb-4 md:pt-10 md:pb-8 lg:pt-16 lg:pb-16 bg-background relative transition-colors duration-300">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />

            <div className="container relative z-10">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text content */}
                    <div className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
                        {/* Badge tag */}
                        <div className="flex justify-center lg:justify-start">
                            <SectionTag>
                                {section.tag || "🚀 Học để làm được"}
                            </SectionTag>
                        </div>

                        {/* Title with proper line height for Vietnamese */}
                        <h1 className="text-3xl font-bold tracking-normal sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white py-2">
                            {section.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="mx-auto lg:mx-0 max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed">
                            {section.subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            {section.ctaText && (
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        const el = document.getElementById('payment-section');
                                        if (el) {
                                            const offset = 80; // Adjust for header
                                            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                            window.scrollTo({
                                                top: elementPosition - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    className="w-full sm:w-auto text-base px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    {section.ctaText || 'Đăng ký ngay'}
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            )}
                            <Link href="/contact">
                                <Button as="div" variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-12 font-semibold hover:bg-muted transition-all">
                                    Liên hệ tư vấn
                                </Button>
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex items-center gap-6 justify-center lg:justify-start pt-4 text-sm text-muted-foreground">
                            {(section.trustIndicators || ['Miễn phí thử', 'Hỗ trợ 24/7', 'Chứng chỉ']).map((indicator: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{indicator}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image with effects */}
                    {section.image && (
                        <div className="relative mx-auto lg:mr-0 w-full max-w-[600px] order-1 lg:order-2 p-4 lg:p-8">
                            {/* Decorative elements */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50"></div>

                            {/* Main image container */}
                            <div className="relative aspect-[4/3] w-full shadow-2xl rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
                                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                    <img
                                        src={section.image}
                                        alt="Hero"
                                        width="800"
                                        height="600"
                                        className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                                        fetchPriority="high"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            </div>

                            {/* Floating badge - positioned relative to outer container to avoid overflow clip */}
                            {(section.statsTitle || section.statsValue) && (
                                <div className="absolute bottom-0 -left-4 bg-card border shadow-lg rounded-xl p-3 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-lg">{section.statsIcon || '🎓'}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{section.statsValue}</p>
                                        {/* The instruction mentioned an h2, but it's not part of the HeroSection structure.
                                            The existing h1 already has tracking-normal and leading-[1.4].
                                            No changes are needed for the h1 based on the instruction.
                                            The provided snippet for h2 seems to belong to a different component (ExpertSection).
                                            Therefore, no direct change is applied here based on the snippet.
                                        */}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
