'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const DarkCTASection = ({ section }: { section: Section }) => {
    return (
        <section className="py-8 md:py-16 bg-[#0a0a0a] text-white relative overflow-hidden flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-dot-white opacity-60"></div>
                {/* Radial gradient to settle the dots */}
                <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_0%,#0a0a0a_90%)]"></div>
            </div>

            <div className="container relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-[1.5]">
                    {section.title}
                </h2>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
                        {section.subtitle}
                    </p>

                    {section.ctaLink && (
                        section.ctaLink.startsWith('#') || !section.ctaLink.includes('/') ? (
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
                                className="h-14 px-8 text-lg font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                {section.ctaText || 'Đăng ký ngay'}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        ) : (
                            <Link href={section.ctaLink}>
                                <Button
                                    variant="light"
                                    size="lg"
                                    as="div"
                                    className="h-14 px-8 text-lg font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    {section.ctaText || 'Đăng ký ngay'}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};
