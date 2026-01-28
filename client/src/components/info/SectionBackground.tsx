import React from 'react';
import { cn } from "@/lib/utils";
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

interface SectionBackgroundProps {
    backgroundImage?: string;
    showDotPattern?: boolean;
    className?: string;
    overlayClassName?: string;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({
    backgroundImage,
    showDotPattern = true,
    className,
    overlayClassName
}) => {
    return (
        <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
            {/* Background Image Layer */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Dark Overlay for Image Readability */}
            {backgroundImage && (
                <div className={cn("absolute inset-0 bg-background/60 backdrop-blur-[2px]", overlayClassName)} />
            )}

            {/* Dot Pattern Layer */}
            {showDotPattern && (
                <DotPatternBackground
                    className="opacity-50"
                    withVignette={!backgroundImage} // Fade vignette if there's a background image
                />
            )}

            {/* Optional Gradient Fade (Bottom to Top for better blending) */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        </div>
    );
};
