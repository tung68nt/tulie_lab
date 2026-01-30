import { cn } from "@/lib/utils";

interface DotPatternBackgroundProps {
    className?: string;
    fadeClassName?: string;
    /**
     * If true, applies a darker overlay at the edges (vignette)
     * @default true
     */
    withVignette?: boolean;
}

export function DotPatternBackground({ className, fadeClassName, withVignette = true }: DotPatternBackgroundProps) {
    return (
        <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className || "text-foreground/15")}>
            {/* Dot Pattern with Radial Fade */}
            {/* The mask makes dots visible in center and fade out towards edges */}
            "absolute inset-0",
            "[mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]",
            "[-webkit-mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]",
            fadeClassName
            )}
            style={{
                backgroundImage: 'radial-gradient(circle at center, currentColor 1.5px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}
            ></div>

            {/* Vignette Overlay (Darken edges) - Milder */ }
    {
        withVignette && (
            <div className="absolute inset-0 bg-black/10 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"></div>
        )
    }
        </div >
    );
}
