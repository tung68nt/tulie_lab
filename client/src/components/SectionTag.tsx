import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'default' | 'black-pill' | 'yellow' | 'outline' | 'primary';
    showDot?: boolean;
    dotColor?: 'white' | 'black' | 'primary' | 'green' | 'auto' | 'red' | 'blue' | 'yellow';
}

export const SectionTag: React.FC<SectionTagProps> = ({
    children,
    className,
    variant = 'default',
    showDot = true,
    dotColor: customDotColor
}) => {
    const variantClasses = {
        default: "border-zinc-800 bg-black text-white shadow-lg shadow-black/5",
        light: "border-zinc-100 bg-white text-zinc-900 shadow-sm",
        dark: "border-zinc-800 bg-zinc-900 text-white",
        'black-pill': "border-white/10 bg-black text-white shadow-xl",
        yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
        primary: "border-primary/20 bg-primary/10 text-primary",
        outline: "border-zinc-200 dark:border-zinc-800 bg-transparent text-foreground"
    }[variant];

    const defaultDotColor = (variant === 'light' || variant === 'outline') ? 'auto' : 'white';
    const finalDotColor = customDotColor || defaultDotColor;

    return (
        <div className={cn(
            "inline-flex h-8 items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-bold select-none transition-all duration-300",
            variantClasses,
            className
        )}>
            {showDot && <StatusDot color={finalDotColor as any} />}
            <span className="relative top-[0.5px] uppercase tracking-wider">
                {children}
            </span>
        </div>
    );
};
