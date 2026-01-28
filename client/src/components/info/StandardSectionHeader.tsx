import React from 'react';
import { SectionTag } from '@/components/SectionTag';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';

interface StandardSectionHeaderProps {
    section: Partial<Section>; // Allow partial so we can pass ad-hoc objects if needed
    className?: string; // Container class override
    titleOverride?: string;
    subtitleOverride?: string;
    tagOverride?: React.ReactNode;
    children?: React.ReactNode; // Allow extra content if needed
    align?: 'center' | 'left' | 'right';
}

export const StandardSectionHeader: React.FC<StandardSectionHeaderProps> = ({
    section,
    className,
    titleOverride,
    subtitleOverride,
    tagOverride,
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

    const isDarkBg = section?.backgroundTheme === 'dark';
    const isLightBg = section?.backgroundTheme === 'light';

    // Text Color Logic:
    // If background is dark (isDarkBg), we force text to be white/light.
    // If background is light (isLightBg), we force text to be dark.
    // Otherwise (auto), we use standard colors that adapt to system theme (zinc-900 / dark:white).

    const titleGradientClass = isDarkBg
        ? "text-white"
        : isLightBg
            ? "text-zinc-900"
            : "text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white";

    const subtitleClass = isDarkBg
        ? "text-zinc-300"
        : isLightBg
            ? "text-zinc-600"
            : "text-muted-foreground";

    return (
        <div className={cn("mb-10 md:mb-16 relative z-10 flex flex-col", alignClass, className)}>
            {tag && (
                <div className={cn("flex w-full mb-3", tagAlignClass, isDarkBg ? "dark" : "")}>
                    <SectionTag className={cn(
                        isDarkBg ? "border-white/20 bg-white/10 text-white" : ""
                    )}>
                        {tag}
                        {/* Force dot color for dark bg if needed, but SectionTag handles dark: modifier. 
                            However, if parent isn't 'dark' class, we need to manually style the dot? 
                            SectionTag structure is span > span. hard to reach. 
                            But SectionTag uses standard tailwind dark: classes. 
                            If we are in 'light' mode but section is 'dark', we need 'dark' class wrapper?
                        */}
                    </SectionTag>
                </div>
            )}

            <h2 className={cn(
                "text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.15] py-2",
                titleGradientClass,
                align === 'center' ? 'px-4' : 'pr-4'
            )}>
                {title}
            </h2>

            {subtitle && (
                <p className={cn(
                    "text-lg md:text-xl leading-relaxed max-w-3xl",
                    subtitleClass,
                    align === 'center' ? 'mx-auto px-4' : 'pr-4'
                )}>
                    {subtitle}
                </p>
            )}

            {children}
        </div>
    );
};
