import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { StatusDot } from "./StatusDot"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-1.5",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/95",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/95",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/95",
                outline: "text-foreground border-zinc-300 dark:border-zinc-700 bg-background",
                yellow: "bg-yellow-500 text-white border-yellow-600 shadow-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    showDot?: boolean;
    dotColor?: 'white' | 'black' | 'primary' | 'green' | 'auto' | 'red' | 'blue' | 'yellow';
    animate?: boolean;
    bold?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

function Badge({ className, variant, showDot = true, dotColor, animate = true, bold = false, size = 'lg', children, ...props }: BadgeProps) {
    const defaultDotColor = (variant === 'default') ? 'white' : 'auto';
    const finalDotColor = dotColor || defaultDotColor;

    return (
        <div
            className={cn(
                badgeVariants({ variant, className }),
                bold ? "font-bold" : "font-medium",
                size === 'sm' ? "h-[22px] text-[10px] px-2" : size === 'lg' ? "h-8 text-[14px] px-3.5" : "h-7 text-[12px] px-2.5",
                "inline-flex items-center justify-center whitespace-nowrap overflow-hidden"
            )}
            {...props}
        >
            {showDot && <StatusDot color={finalDotColor as any} className={size === 'lg' ? "w-2 h-2" : "w-1 h-1"} animate={animate} />}
            <span className="first-letter:uppercase leading-none">{children}</span>
        </div>
    )
}

export { Badge, badgeVariants }
