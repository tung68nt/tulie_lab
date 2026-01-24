'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';

export const CTASection = ({ section }: { section: Section }) => {
    return (
        <section className="py-12 md:py-16 bg-foreground text-background relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-100">
                <div className="absolute inset-0 bg-dot-white [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            </div>

            <div className="container text-center relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-[1.3]">
                    {section.title}
                </h2>
                <p className="text-lg md:text-xl text-background/80 mb-8 max-w-2xl mx-auto">
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
                        className="text-lg px-8 py-6 font-semibold text-foreground"
                    >
                        {(section.ctaText?.includes('50%') || section.ctaText?.includes('tư vấn') || section.ctaText === 'Bắt đầu ngay' || !section.ctaText) ? 'Đăng ký ngay' : section.ctaText}
                    </Button>
                )}
            </div>
        </section>
    );
};
