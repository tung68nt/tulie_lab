import { cn } from "@/lib/utils";

interface DotPatternBackgroundProps {
    className?: string;
    fadeClassName?: string;
    /**
     * If true, applies a darker overlay at the edges (vignette)
     * @default true
     */
    withVignette?: boolean;
    /**
     * If true, applies a radial mask to fade out dots at the edges
     * @default true
     */
    withFade?: boolean;
    /**
     * Pattern variant: 'dots' or 'grid'
     * @default 'dots'
     */
    variant?: 'dots' | 'grid';
}

export function DotPatternBackground({ className, fadeClassName, withVignette = true, withFade = true, variant = 'dots' }: DotPatternBackgroundProps) {
    const isGrid = variant === 'grid';

    return (
        <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className || "text-foreground/15")}>
            {/* Pattern Layer with Radial Fade */}
            <div className={cn(
                "absolute inset-0",
                withFade && "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)]",
                withFade && "[-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)]",
                fadeClassName
            )}
                style={{
                    backgroundImage: isGrid
                        ? 'linear-gradient(to right, currentColor 1.2px, transparent 1.2px), linear-gradient(to bottom, currentColor 1.2px, transparent 1.2px)'
                        : 'radial-gradient(circle at center, currentColor 1.2px, transparent 1.2px)',
                    backgroundSize: isGrid ? '32px 32px' : '32px 32px'
                }}
            ></div>

            {/* Vignette Overlay (Darken edges) - Milder */}
            {
                withVignette && (
                    <div className="absolute inset-0 bg-black/5 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"></div>
                )
            }
        </div >
    );
}
