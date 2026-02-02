import * as React from "react";
import { cn } from "@/lib/utils";

export interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: number;
    onChange: (value: number) => void;
    label?: string;
}

/**
 * A price input component that displays numbers with thousand separators (Vietnamese format).
 * Internally stores the raw number value, but displays with formatting.
 */
const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
    ({ className = "", value, onChange, label, ...props }, ref) => {
        // Format number with Vietnamese thousand separators (dots)
        const formatNumber = (num: number): string => {
            if (!num && num !== 0) return '';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        // Parse formatted string back to number
        const parseNumber = (str: string): number => {
            // Remove all non-digit characters
            const cleaned = str.replace(/[^\d]/g, '');
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

            // Update display to show formatted value immediately
            setDisplayValue(formatNumber(numericValue));

            // Notify parent of the raw number value
            onChange(numericValue);
        };

        return (
            <div className="space-y-2">
                {label && <label className="text-sm font-medium">{label}</label>}
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10 font-medium",
                            className
                        )}
                        ref={ref}
                        value={displayValue}
                        onChange={handleChange}
                        {...props}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none select-none">
                        đ
                    </div>
                </div>
            </div>
        );
    }
);
PriceInput.displayName = "PriceInput";

export { PriceInput };
