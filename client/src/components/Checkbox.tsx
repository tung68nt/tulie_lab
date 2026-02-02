import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="peer absolute h-5 w-5 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    disabled={disabled}
                    ref={ref}
                    {...props}
                />
                <div
                    className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-zinc-300 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        "peer-checked:bg-zinc-900 peer-checked:border-zinc-900 peer-checked:text-white",
                        "peer-hover:border-zinc-900",
                        className
                    )}
                >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </div>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
