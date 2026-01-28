import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionTag: React.FC<SectionTagProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-background/50 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-6 shadow-sm backdrop-blur-sm select-none",
            className
        )}>
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 dark:bg-white/80 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-900 dark:bg-white"></span>
            </span>
            {children}
        </div>
    );
};
