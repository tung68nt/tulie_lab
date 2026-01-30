import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'default';
}

export const SectionTag: React.FC<SectionTagProps> = ({
    children,
    className,
    variant = 'default'
}) => {
    // default: adapts to system theme (white in light mode, black in dark mode)
    // dark: always black (for dark sections)
    // light: always white (for light sections)

    return (
        <div className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold mb-6 shadow-xl backdrop-blur-md select-none transition-all duration-300",
            variant === 'dark' && "border-white/20 bg-black text-white shadow-xl",
            variant === 'light' && "border-black/10 bg-white text-black shadow-sm",
            variant === 'default' && "border-black/5 bg-white text-black shadow-sm dark:border-white/20 dark:bg-black dark:text-white",
            className
        )}>
            <StatusDot color={
                variant === 'dark' ? "white" :
                    variant === 'light' ? "black" :
                        "auto"
            } />
            {children}
        </div>
    );
};
