import React from 'react';
import { cn } from '@/lib/utils';

interface StatusDotProps {
    className?: string;
    dotClassName?: string;
    pingClassName?: string;
    color?: 'white' | 'black' | 'primary' | 'green' | 'auto';
}

export const StatusDot: React.FC<StatusDotProps> = ({
    className,
    dotClassName,
    pingClassName,
    color = 'white'
}) => {
    const colorClasses = {
        white: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]',
        black: 'bg-black',
        zinc: 'bg-zinc-950 dark:bg-zinc-200',
        primary: 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]',
        green: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        red: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
        auto: 'bg-black dark:bg-white'
    };

    const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.white;

    return (
        <span className={cn("relative flex h-2 w-2 shrink-0", className)}>
            <span className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                bgColor,
                pingClassName
            )}></span>
            <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                bgColor,
                dotClassName
            )}></span>
        </span>
    );
};
