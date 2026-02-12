import React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './StatusDot';

interface SectionTagProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'default' | 'black-pill' | 'yellow' | 'outline' | 'primary' | 'red';
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
    // Filter out "Khóa học" tag completely
    if (typeof children === 'string' && children.toLowerCase().includes('khóa học')) {
        return null;
    }

    const isFree = typeof children === 'string' && children.toLowerCase().includes('miễn phí');

    // Auto-detect dot color for "Miễn phí"
    const isDarkVariant = ['dark', 'black-pill', 'primary', 'red'].includes(variant);
    const resolvedDotColor = isFree ? 'green' : (customDotColor || (isDarkVariant ? 'white' : 'black'));

    // Only animate if it's the "Free" tag or explicitly requested
    const shouldAnimate = isFree || animate;

    const variantClasses = {
        default: "border-zinc-200/60 bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm",
        light: "border-zinc-200/60 bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm",
        dark: "border-zinc-800/60 bg-zinc-950 text-white shadow-md backdrop-blur-sm",
        'black-pill': "border-zinc-900 bg-zinc-900 text-white shadow-md",
        yellow: "border-yellow-600/40 bg-yellow-500 text-white shadow-sm ring-1 ring-yellow-400/20",
        red: "border-red-600/40 bg-red-600 text-white shadow-sm shadow-red-500/10 ring-1 ring-red-400/20",
        primary: "border-primary/20 bg-primary text-primary-foreground shadow-sm ring-1 ring-white/10",
        outline: "border-zinc-200 bg-white text-zinc-900"
    }[variant];

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-4 select-none justify-center overflow-hidden",
            "whitespace-normal sm:whitespace-nowrap text-center",
            size === 'sm' ? "h-[22px] text-[10px] px-2" : size === 'lg' ? "h-8 text-[14px] px-4" : "h-7 text-[12px] px-3",
            bold ? "font-bold" : "font-medium",
            variantClasses,
            className
        )}>
            {showDot && <StatusDot color={resolvedDotColor as any} animate={shouldAnimate} />}
            <span className={cn(
                "relative top-[0.5px] first-letter:leading-snug py-1",
            )}>
                {children}
            </span>
        </div>
    );
};
