import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionTag: React.FC<SectionTagProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full border border-white/20 dark:border-white/30 bg-black/40 px-4 py-1.5 text-sm font-semibold text-white mb-6 shadow-xl backdrop-blur-md select-none",
            className
        )}>
            <StatusDot color="white" />
            {children}
        </div>
    );
};
