"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Section } from "@/types/sections";
import { DynamicIcon } from "@/components/DynamicIcon";

interface HeroCircleSectionProps {
    section?: Partial<Section>;
}

export default function HeroCircleSection({ section }: HeroCircleSectionProps) {
    const title = section?.title || "Institute of Medical Technology";
    const subtitle = section?.subtitle || "Viện Ứng dụng Công nghệ Y tế";
    const baseText = (section?.tag || "Institute of Medical Technology Applications • Viện Ứng dụng Công nghệ Y tế • ") + " ";
    // Repeat text to ensure it covers the circle better
    const circularText = baseText.repeat(2);
    const isDark = section?.backgroundTheme === 'dark';
    const iconName = section?.icon || "Play";

    return (
        <div className={cn(
            "relative flex h-[600px] md:h-[700px] w-full flex-col items-center justify-center overflow-hidden transition-colors duration-500",
            isDark ? "bg-black text-white" : "bg-white text-zinc-950"
        )}>
            {/* Background Grid Pattern (Subtle) */}
            <div className={cn(
                "absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]",
                isDark ? "opacity-20" : "opacity-100"
            )}></div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 w-full">
                {/* Rotating Circular Text Container - FIXED: Added explicit dimensions */}
                <div className="relative flex items-center justify-center h-[280px] w-[280px] sm:h-[400px] sm:w-[400px]">
                    {/* Animated SVG Text with Framer Motion */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        <svg
                            viewBox="0 0 300 300"
                            className="w-full h-full"
                        >
                            <defs>
                                <path
                                    id="circlePath"
                                    d="M 150, 150 m -115, 0 a 115,115 0 1,1 230,0 a 115,115 0 1,1 -230,0"
                                />
                            </defs>
                            <text
                                fill={isDark ? "white" : "black"}
                                fontSize="12"
                                fontWeight="600"
                                className="tracking-[2px] uppercase opacity-70"
                            >
                                <textPath href="#circlePath" xlinkHref="#circlePath">
                                    {circularText}
                                </textPath>
                            </text>
                        </svg>
                    </motion.div>

                    {/* Center Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "group relative z-20 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all sm:h-32 sm:w-32",
                            isDark ? "bg-white text-black" : "bg-black text-white"
                        )}
                        aria-label="Action Button"
                    >
                        {/* Glow effect on hover */}
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500",
                            isDark ? "bg-white" : "bg-black"
                        )} />

                        <DynamicIcon
                            name={iconName}
                            className={cn(
                                "h-10 w-10 transition-transform group-hover:scale-110 sm:h-12 sm:w-12",
                                isDark ? "text-black" : "text-white"
                            )}
                            strokeWidth={2}
                            fill={isDark ? "currentColor" : "currentColor"}
                        />
                    </motion.button>
                </div>

                {/* Hero Title (Below the circle) */}
                <div className="text-center space-y-4 md:space-y-6 max-w-4xl px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className={cn(
                            "text-lg md:text-xl font-medium max-w-xl mx-auto",
                            isDark ? "text-zinc-400" : "text-zinc-500"
                        )}
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
