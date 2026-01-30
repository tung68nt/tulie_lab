import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'default' | 'black-pill' | 'yellow' | 'outline' | 'primary';
    showDot?: boolean;
    dotColor?: 'white' | 'black' | 'primary' | 'green' | 'auto' | 'red' | 'blue' | 'yellow';
    animate?: boolean;
    bold?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const SectionTag: React.FC<SectionTagProps> = ({
    children,
    className,
    variant = 'default',
    showDot = true,
    dotColor: customDotColor,
    animate = true,
    bold = false,
    size = 'lg'
}) => {
    const variantClasses = {
        default: "border-zinc-800 bg-zinc-950 text-white shadow-md",
        light: "border-zinc-300 bg-zinc-100 text-zinc-900 shadow-sm",
        dark: "border-zinc-700 bg-zinc-900 text-white shadow-md",
        'black-pill': "border-white/20 bg-black text-white shadow-lg",
        yellow: "border-yellow-600 bg-yellow-500 text-white shadow-sm",
        primary: "border-primary/40 bg-primary text-primary-foreground shadow-sm",
        outline: "border-zinc-300 dark:border-zinc-700 bg-background text-foreground"
    }[variant];

    const defaultDotColor = (variant === 'light' || variant === 'outline') ? 'auto' : 'white';
    const finalDotColor = customDotColor || defaultDotColor;

    return (
        <div className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 select-none transition-all duration-300 whitespace-nowrap justify-center overflow-hidden",
            size === 'sm' ? "h-[22px] text-[10px] px-2" : size === 'lg' ? "h-8 text-[13px] px-4" : "h-7 text-[11px] px-3",
            bold ? "font-bold" : "font-normal",
            variantClasses,
            className
        )}>
            {showDot && <StatusDot color={finalDotColor as any} animate={animate} />}
            <span className={cn(
                "relative top-[0.5px] first-letter:uppercase leading-none",
            )}>
                {children}
            </span>
        </div>
    );
};
