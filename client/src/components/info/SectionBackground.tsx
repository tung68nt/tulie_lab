import React from 'react';
import { cn } from "@/lib/utils";
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

interface SectionBackgroundProps {
    backgroundImage?: string;
    showDotPattern?: boolean;
    className?: string; // Wrapper class
    overlayClassName?: string; // Overlay-specific class
    backgroundTheme?: 'light' | 'dark' | 'auto';
    overlayOpacity?: number;
    hideGradients?: boolean;
    glowVariant?: number;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({
    backgroundImage,
    showDotPattern = true,
    className,
    overlayClassName,
    backgroundTheme = 'auto',
    overlayOpacity,
    hideGradients = false,
    glowVariant
}) => {
    // ... rest of the component
    const isLightTheme = backgroundTheme === 'light';
    const isDarkTheme = backgroundTheme === 'dark';

    // Glow configurations (position and very subtle colors)
    const glows = [
        { color: 'bg-primary/5', pos: 'top-[10%] left-[5%] w-[600px] h-[600px]' },
        { color: 'bg-blue-500/5', pos: 'bottom-[10%] right-[5%] w-[500px] h-[500px]' },
        { color: 'bg-purple-500/5', pos: 'top-[20%] right-[10%] w-[550px] h-[550px]' },
        { color: 'bg-amber-500/5', pos: 'bottom-[20%] left-[10%] w-[450px] h-[450px]' },
        { color: 'bg-emerald-500/5', pos: 'top-[40%] left-[20%] w-[500px] h-[500px]' },
    ];

    const activeGlow = glowVariant !== undefined ? glows[glowVariant % glows.length] : null;

    // Fix: Use theme variables for overlay to ensure contrast regardless of system theme
    const overlayBase = isLightTheme ? 'bg-background/60 dark:bg-black/60' : isDarkTheme ? 'bg-black/60' : 'bg-background/60';

    return (
        <div className={cn("absolute inset-0 z-0 overflow-visible rounded-[inherit] pointer-events-none", className)}>
            {/* Background Image Layer */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Subtle Background Glows for Light Mode */}
            {!backgroundImage && isLightTheme && activeGlow && (
                <div className={cn(
                    "absolute rounded-full blur-[140px] opacity-60 z-[-1] animate-pulse-slow",
                    activeGlow.color,
                    activeGlow.pos
                )} />
            )}

            {/* Backdrop Overlay for Image Readability */}
            {backgroundImage && (
                <>
                    <div
                        className={cn(
                            "absolute inset-0 backdrop-blur-[2px]",
                            overlayBase,
                            overlayClassName
                        )}
                        style={overlayOpacity !== undefined ? { opacity: overlayOpacity } : (isDarkTheme ? { opacity: 0.85 } : { opacity: 0.6 })}
                    />
                    {/* Top and Bottom Gradient Shadow for better text pops */}
                    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100" />
                </>
            )}

            {/* Dot Pattern Layer */}
            {showDotPattern && (
                <div className="absolute inset-0 pointer-events-none">
                    <DotPatternBackground
                        className={cn(
                            backgroundTheme === 'dark' ? "text-white/25" : "text-black/10 dark:text-white/20"
                        )}
                        withVignette={false}
                    />
                </div>
            )}

            {/* Radial Gradient for Light Mode - responsive to theme */}
            {!backgroundImage && isLightTheme && (
                <div className="absolute inset-0 z-[-2] section-radial-gradient" />
            )}

            {/* Optional Gradient Fade - Only show if NO background image and NOT explicitly hidden */}
            {!hideGradients && !backgroundImage && (
                <>
                    <div className={cn(
                        "absolute inset-x-0 bottom-[-1px] h-96 bg-gradient-to-t to-transparent z-10",
                        "from-background"
                    )} />
                    <div className={cn(
                        "absolute inset-x-0 top-[-1px] h-96 bg-gradient-to-b to-transparent z-10",
                        "from-background"
                    )} />
                </>
            )}
        </div>
    );
};
