import React from 'react';
import { SectionTag } from '@/components/SectionTag';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { FadeIn } from '../animations/FadeIn';
import { SectionBackground } from './SectionBackground';

interface StandardSectionHeaderProps {
    section: Partial<Section>; // Allow partial so we can pass ad-hoc objects if needed
    className?: string; // Container class override
    titleOverride?: string;
    subtitleOverride?: string;
    tagOverride?: React.ReactNode;
    tagProps?: Partial<React.ComponentProps<typeof SectionTag>>;
    children?: React.ReactNode; // Allow extra content if needed
    align?: 'center' | 'left' | 'right';
}

export const StandardSectionHeader: React.FC<StandardSectionHeaderProps> = ({
    section,
    className,
    titleOverride,
    subtitleOverride,
    tagOverride,
    tagProps,
    children,
    align = 'center'
}) => {
    const tag = tagOverride || section?.tag;
    const title = titleOverride || section?.title;
    const subtitle = subtitleOverride || section?.subtitle;

    const alignClass = {
        center: 'text-center items-center',
        left: 'text-left items-start',
        right: 'text-right items-end'
    }[align];

    const tagAlignClass = {
        center: 'justify-center',
        left: 'justify-start',
        right: 'justify-end'
    }[align];

    const isDarkBg = !section?.backgroundTheme || section?.backgroundTheme === 'dark';
    const isLightBg = section?.backgroundTheme === 'light';

    const titleGradientClass = isDarkBg
        ? "text-white"
        : "text-zinc-950 dark:text-white";

    const subtitleClass = isDarkBg
        ? "text-zinc-400"
        : "text-zinc-600 dark:text-zinc-400";

    return (
        <div className={cn("mb-4 md:mb-6 relative pt-4 md:pt-4 pb-2 flex flex-col z-20", alignClass, className)}>
            {tag && (
                <div className={cn("flex w-full mb-3", tagAlignClass)}>
                    <FadeIn direction="up" delay={0.1} duration={0.5}>
                        <SectionTag variant={isDarkBg ? 'black-pill' : 'default'} {...tagProps}>
                            {tag}
                        </SectionTag>
                    </FadeIn>
                </div>
            )}

            <FadeIn direction="up" delay={0.2} duration={0.5}>
                <h2 className={cn(
                    "text-4xl md:text-5xl font-bold mb-4 leading-[1.15] py-2",
                    titleGradientClass,
                    align === 'center' ? 'px-4' : 'pr-4'
                )}>
                    {title}
                </h2>
            </FadeIn>

            {subtitle && (
                <FadeIn direction="up" delay={0.3} duration={0.5}>
                    <p className={cn(
                        "text-lg md:text-xl leading-relaxed max-w-3xl",
                        subtitleClass,
                        align === 'center' ? 'mx-auto px-4' : 'pr-4'
                    )}>
                        {subtitle}
                    </p>
                </FadeIn>
            )}

            {children}
        </div>
    );
};
