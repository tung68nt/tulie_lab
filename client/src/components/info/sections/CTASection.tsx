'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';

import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export const CTASection = ({ section }: { section: Section }) => {
    return (
        <section className="py-20 md:py-32 bg-black text-white relative overflow-hidden flex items-center justify-center">
            {/* Background pattern matching other sections */}
            {section.showDotPattern && <DotPatternBackground />}

            {/* Radial gradient for fading edges (mờ 4 góc) */}
            <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <div className="container text-center relative z-10">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.4] tracking-tight">
                    {section.title}
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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
