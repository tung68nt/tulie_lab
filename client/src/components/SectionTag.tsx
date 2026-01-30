import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'default' | 'black-pill';
}

export const SectionTag: React.FC<SectionTagProps> = ({
    children,
    className
}) => {
    return (
        <div className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full border border-zinc-900 bg-black text-white px-4 py-1.5 text-sm font-semibold mb-6 shadow-2xl backdrop-blur-md select-none transition-all duration-300",
            className
        )}>
            <StatusDot color="white" />
            {children}
        </div>
    );
};
