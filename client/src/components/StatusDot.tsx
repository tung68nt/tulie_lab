import React from 'react';
import { cn } from '@/lib/utils';

interface StatusDotProps {
    className?: string;
    dotClassName?: string;
    pingClassName?: string;
    color?: 'white' | 'black' | 'primary' | 'green' | 'auto' | 'red' | 'blue' | 'yellow';
}

export const StatusDot: React.FC<StatusDotProps> = ({
    className,
    dotClassName,
    pingClassName,
    color = 'white'
}) => {
    const dotStyles = (color === 'white' ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" :
        color === 'green' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
            color === 'red' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" :
                color === 'blue' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                    color === 'yellow' ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" :
                        color === 'black' ? "bg-zinc-950" :
                            color === 'primary' ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" :
                                "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]");

    return (
        <div className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotStyles,
            color !== 'black' && "animate-pulse",
            className
        )} />
    );
};
