import React from 'react';
import { Section } from '@/types/sections';
import { SectionTag } from '@/components/SectionTag';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';

interface HeadingSectionProps {
    section: Section;
}

export const HeadingSection: React.FC<HeadingSectionProps> = ({ section }) => {
    return (
        <section className={cn(
            "relative pt-24 pb-12 overflow-hidden",
            section.className
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={section.glowVariant}
            />

            <div className="container relative z-10 mx-auto px-6 max-w-[1200px] text-center">
                <div className="flex flex-col items-center justify-center">
                    {section.tag && (
                        <SectionTag className="mb-6">
                            {section.tag}
                        </SectionTag>
                    )}
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
                        {section.title}
                    </h1>
                    {section.subtitle && (
                        <p className="max-w-[800px] text-xl text-muted-foreground leading-relaxed">
                            {section.subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
