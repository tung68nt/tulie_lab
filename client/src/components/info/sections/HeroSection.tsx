'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Section } from '@/types/sections';

export function HeroSection({ section }: { section: Section }) {
    return (
        <section className="w-full pt-8 pb-4 md:pt-10 md:pb-8 lg:pt-16 lg:pb-16 bg-background relative transition-colors duration-300">
            {/* Background decorations - isolated for scrolling overflow */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-dot-grid-light dark:bg-dot-grid-dark opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            </div>

            <div className="container">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text content */}
                    <div className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
                        {/* Badge tag */}
                        <div className="flex justify-center lg:justify-start">
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-800 dark:bg-zinc-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800 dark:bg-white"></span>
                                </span>
                                🚀 Học để làm được
                            </span>
                        </div>

                        {/* Title with proper line height for Vietnamese */}
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.3] md:leading-[1.25]">
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
                                    {(section.ctaText?.includes('50%') || section.ctaText?.includes('tư vấn') || section.ctaText === 'Bắt đầu ngay' || !section.ctaText) ? 'Đăng ký ngay' : section.ctaText}
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
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Miễn phí thử</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Hỗ trợ 24/7</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Chứng chỉ</span>
                            </div>
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
                                        className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            </div>

                            {/* Floating badge - positioned relative to outer container to avoid overflow clip */}
                            <div className="absolute bottom-0 -left-4 bg-card border shadow-lg rounded-xl p-3 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-lg">🎓</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">10,000+</p>
                                    <p className="text-xs text-muted-foreground">Thành viên</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
