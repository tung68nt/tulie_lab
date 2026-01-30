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
        default: "border-zinc-800 bg-black text-white",
        light: "border-zinc-200 bg-white text-zinc-900 shadow-sm",
        dark: "border-zinc-800 bg-zinc-900 text-white",
        'black-pill': "border-white/10 bg-black/60 text-white backdrop-blur-md"
    }[variant];

    const dotColor = (variant === 'light') ? 'black' : 'white';
    return (
        <div className={cn(
            "inline-flex h-8 items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold tracking-widest select-none transition-all duration-300",
            variantClasses,
            className
        )}>
            <StatusDot color={dotColor} />
            {children}
        </div>
    );
};
