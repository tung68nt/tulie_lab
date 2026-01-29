import React from 'react';
import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';
import Link from 'next/link';

interface CTABoxSectionProps {
    section: Section;
}

export const CTABoxSection: React.FC<CTABoxSectionProps> = ({ section }) => {
    return (
        <section className={cn(
            "py-20 md:py-32 relative overflow-hidden",
            section.className
        )}>
            <div className="container px-6 mx-auto max-w-[1240px]">
                <div className="relative rounded-[2.5rem] bg-[#0A0A0A] p-10 md:p-16 lg:p-20 overflow-hidden border border-white/5 shadow-2xl">
                    {/* Background Pattern Sync */}
                    <SectionBackground
                        backgroundTheme="dark"
                        showDotPattern={true}
                        glowVariant={section.glowVariant ?? 0}
                    />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.2] tracking-tight">
                                {section.title?.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < (section.title?.split('\n').length || 0) - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </h2>
                            {section.subtitle && (
                                <p className="text-lg text-white/60 md:text-xl leading-relaxed mb-0">
                                    {section.subtitle}
                                </p>
                            )}
                        </div>

                        {(section.ctaText && section.ctaLink) && (
                            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                                <Link href={section.ctaLink}>
                                    <Button
                                        as="div"
                                        size="lg"
                                        className="rounded-2xl h-14 px-10 text-base font-bold bg-white text-black hover:bg-zinc-200 border-none transition-all shadow-xl hover:scale-105 active:scale-95"
                                    >
                                        {section.ctaText}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
