'use client';

import * as React from "react";

export interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: number;
    onChange: (value: number) => void;
}

/**
 * A price input component that displays numbers with thousand separators (Vietnamese format).
 * Internally stores the raw number value, but displays with formatting.
 */
const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
    ({ className = "", value, onChange, ...props }, ref) => {
        // Format number with Vietnamese thousand separators (dots)
        const formatNumber = (num: number): string => {
            if (!num && num !== 0) return '';
            return num.toLocaleString('vi-VN');
        };

        // Parse formatted string back to number
        const parseNumber = (str: string): number => {
            // Remove all non-digit characters except minus
            const cleaned = str.replace(/[^\d-]/g, '');
            const parsed = parseInt(cleaned, 10);
            return isNaN(parsed) ? 0 : parsed;
        };

        const [displayValue, setDisplayValue] = React.useState(formatNumber(value));

        // Update display value when external value changes
        React.useEffect(() => {
            setDisplayValue(formatNumber(value));
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
            const numericValue = parseNumber(rawValue);

            // Update display to show formatted value
            setDisplayValue(formatNumber(numericValue));

            // Notify parent of the raw number value
            onChange(numericValue);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            // When focused, show raw number for easier editing
            if (value) {
                setDisplayValue(value.toString());
            }
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            // When blurred, format the number
            setDisplayValue(formatNumber(value));
            props.onBlur?.(e);
        };

        return (
            <input
                type="text"
                inputMode="numeric"
                className={`flex h-9 w-full rounded-md border border-input bg-background px-4 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                ref={ref}
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            />
        );
    }
);
PriceInput.displayName = "PriceInput";

export { PriceInput };
