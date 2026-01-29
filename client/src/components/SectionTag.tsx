import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark';
}

export const SectionTag: React.FC<SectionTagProps> = ({
    children,
    className,
    variant = 'dark'
}) => {
    return (
        <div className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold mb-6 shadow-xl backdrop-blur-md select-none transition-all duration-300",
            variant === 'dark'
                ? "border-white/10 bg-black text-white"
                : "border-black/5 bg-white text-zinc-950 shadow-sm",
            className
        )}>
            <StatusDot color={variant === 'dark' ? "white" : "black"} />
            {children}
        </div>
    );
};
