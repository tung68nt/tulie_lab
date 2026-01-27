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
    const tag = tagOverride || section.tag;
    const title = titleOverride || section.title;
    const subtitle = subtitleOverride || section.subtitle;

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

    return (
        <div className={cn("mb-10 md:mb-16 relative z-10 flex flex-col", alignClass, className)}>
            {tag && (
                <div className={cn("flex w-full mb-3", tagAlignClass)}>
                    <SectionTag>
                        {tag}
                    </SectionTag>
                </div>
            )}

            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white py-2 px-4">
                {title}
            </h2>

            {/* Added px-4 to prevent text touching edges on mobile */}
            {subtitle && (
                <p className={cn("text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl px-4", align === 'center' ? 'mx-auto' : '')}>
                    {subtitle}
                </p>
            )}

            {children}
        </div>
    );
};
