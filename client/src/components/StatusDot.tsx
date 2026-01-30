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
        white: 'bg-white',
        black: 'bg-zinc-950',
        zinc: 'bg-zinc-500',
        primary: 'bg-primary',
        green: 'bg-green-500',
        red: 'bg-red-500',
        auto: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
    };

    const bgColor = colorClasses[color] || colorClasses.white;

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
