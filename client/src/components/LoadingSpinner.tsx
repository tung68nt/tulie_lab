import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className,
    label = 'Đang tải dữ liệu...'
}) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-[3px]',
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
            <div
                className={cn(
                    "rounded-full border-border border-t-primary animate-spin",
                    sizeClasses[size]
                )}
                style={{ animationDuration: '0.6s' }}
            />
            {label && (
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
            )}
        </div>
    );
};
