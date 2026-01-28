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
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({
    backgroundImage,
    showDotPattern = true,
    className,
    overlayClassName,
    backgroundTheme = 'auto',
    overlayOpacity,
    hideGradients = false
}) => {
    // Determine overlay base color based on theme
    // If we have a dark image (theme='dark'), we usually want a dark overlay to ensure text contrast.
    // If we have a light image (theme='light'), we might want a white overlay.
    // Default to black/dark for generic 'auto' if image is present, or transparent.

    // Actually, usually 'theme=dark' means "I want the content to be light because the background is dark".
    // So the overlay should probably be dark to help the text pop? Or maybe just neutral.
    // Let's stick to the current "dark overlay" default but allow it to be lighter if theme is light? 
    // If theme is light, we expect dark text. Background might be a light image. Overlay should be white-ish to wash it out?

    const isLightTheme = backgroundTheme === 'light';
    const isDarkTheme = backgroundTheme === 'dark';

    // Fix: Use explicit colors for overlay to ensure contrast regardless of system theme
    const overlayBase = isLightTheme ? 'bg-white/60' : isDarkTheme ? 'bg-black/60' : 'bg-background/60';

    return (
        <div className={cn("absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none", className)}>
            {/* Background Image Layer */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Backdrop Overlay for Image Readability */}
            {backgroundImage && (
                <div
                    className={cn(
                        "absolute inset-0 backdrop-blur-[2px]",
                        overlayBase,
                        overlayClassName
                    )}
                    style={overlayOpacity !== undefined ? { opacity: overlayOpacity } : undefined}
                />
            )}

            {/* Dot Pattern Layer */}
            {showDotPattern && (
                <div className="absolute inset-0 pointer-events-none">
                    <DotPatternBackground
                        className={cn(
                            "opacity-50",
                            backgroundTheme === 'dark' ? "text-white/30" : "text-neutral-600/30"
                        )}
                        withVignette={false} // Force disable vignette which might hide dots
                    />
                </div>
            )}

            {/* Optional Gradient Fade - Adjust based on theme? */}
            {!hideGradients && (
                <>
                    <div className={cn(
                        "absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent",
                        isLightTheme ? "from-white" : "from-background"
                    )} />
                    <div className={cn(
                        "absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent",
                        isLightTheme ? "from-white" : "from-background"
                    )} />
                </>
            )}
        </div>
    );
};
