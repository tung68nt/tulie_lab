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
    className,
    variant = 'default'
}) => {
    const variantClasses = {
        default: "border-zinc-800 bg-black text-white shadow-lg shadow-black/5",
        light: "border-zinc-100 bg-white text-zinc-900 shadow-sm",
        dark: "border-zinc-800 bg-zinc-900 text-white",
        'black-pill': "border-white/10 bg-black text-white shadow-xl"
    }[variant];

    const dotColor = (variant === 'light') ? 'black' : 'white';
    return (
        <div className={cn(
            "inline-flex h-8 items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-medium select-none transition-all duration-300",
            variantClasses,
            className
        )}>
            <StatusDot color={dotColor} />
            <span className="relative top-[0.5px]">
                {children}
            </span>
        </div>
    );
};
