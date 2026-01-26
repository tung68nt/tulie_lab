import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export const DarkCTASection = ({ section }: { section: Section }) => {
    return (
        <section className="section-dark py-20 md:py-32 flex items-center justify-center">
            <DotPatternBackground />

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
                                variant="white"
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
                                    variant="white"
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
