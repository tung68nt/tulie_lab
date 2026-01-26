import * as React from "react"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "inverted" | "light" | "white"
    size?: "default" | "sm" | "lg" | "icon"
    as?: React.ElementType
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", as: Component = "button", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            inverted: "bg-foreground text-background hover:bg-foreground/90",
            light: "bg-background text-foreground hover:bg-accent focus-visible:ring-offset-2",
            white: "bg-white text-black hover:bg-zinc-100 focus-visible:ring-offset-2"
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
