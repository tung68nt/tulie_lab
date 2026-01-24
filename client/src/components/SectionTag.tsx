import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionTag: React.FC<SectionTagProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary mb-6 select-none",
            className
        )}>
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
            </span>
            {children}
        </div>
    );
};
