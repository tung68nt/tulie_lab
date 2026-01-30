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
    const dotStyles = (color === 'white' ? "bg-white" :
        color === 'green' ? "bg-emerald-500" :
            color === 'red' ? "bg-rose-500" :
                color === 'blue' ? "bg-blue-500" :
                    color === 'yellow' ? "bg-amber-400" :
                        color === 'black' ? "bg-zinc-950" :
                            color === 'primary' ? "bg-primary" :
                                "bg-white");

    return (
        <div className={cn("relative flex items-center justify-center shrink-0", className)}>
            {/* The pulsing ring */}
            {color !== 'black' && (
                <div className={cn(
                    "absolute h-full w-full rounded-full animate-ping opacity-75",
                    dotStyles,
                    pingClassName
                )} />
            )}
            {/* The static core dot */}
            <div className={cn(
                "relative h-1.5 w-1.5 rounded-full",
                dotStyles,
                dotClassName
            )} />
        </div>
    );
};
