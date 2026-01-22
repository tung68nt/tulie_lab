import * as React from "react"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "inverted" | "light"
    size?: "default" | "sm" | "lg" | "icon"
    as?: React.ElementType
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", as: Component = "button", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-primary text-black dark:text-white hover:bg-primary/80",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            // Inverted variant - black bg with white text
            inverted: "bg-foreground text-background hover:bg-foreground/80",
            // Light variant - white bg with black text for dark backgrounds
            light: "bg-background text-foreground hover:bg-background/80"
        }

        const sizes = {
            default: "h-9 px-4 py-2 text-sm",
            sm: "h-9 rounded-md px-3 text-sm",
            lg: "h-10 rounded-md px-8 text-base",
            icon: "h-9 w-9"
        }

        return (
            <Component
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
