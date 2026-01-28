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
        <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
            {/* Dot Pattern with Radial Fade */}
            {/* The mask makes dots visible in center and fade out towards edges */}
            <div className={cn(
                "absolute inset-0 text-neutral-500/20 dark:text-neutral-400/20", // Standardize intensity
                "[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]",
                "[-webkit-mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]",
                fadeClassName
            )}
                style={{
                    backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}
            ></div>

            {/* Vignette Overlay (Darken edges) */}
            {withVignette && (
                <div className="absolute inset-0 bg-black/20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>
            )}
        </div>
    );
}
