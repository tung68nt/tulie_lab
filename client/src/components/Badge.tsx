import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { StatusDot } from "./StatusDot"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-1.5",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground border-zinc-200 dark:border-zinc-800",
                yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
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
    showDot?: boolean,
    dotColor?: 'white' | 'black' | 'primary' | 'green' | 'auto' | 'red' | 'blue' | 'yellow'
}

function Badge({ className, variant, showDot, dotColor, children, ...props }: BadgeProps) {
    const defaultDotColor = (variant === 'default') ? 'white' : 'auto';
    const finalDotColor = dotColor || defaultDotColor;

    return (
        <div className={badgeVariants({ variant, className })} {...props}>
            {showDot && <StatusDot color={finalDotColor as any} className="w-1 h-1" />}
            {children}
        </div>
    )
}

export { Badge, badgeVariants }
