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
    const title = section?.title || "Institute of Medical Technology Applications";
    const subtitle = section?.subtitle || "Viện Ứng dụng Công nghệ Y tế";
    const tag = section?.tag || "Liên Hiệp các Hội Khoa học và Kỹ thuật Việt Nam";
    const baseText = (section?.tag || "#InstituteofMedicalTechnologyApplication #Vechungtoi #Aboutus #VienungdungCongngheYte ") + " ";
    const circularText = baseText.repeat(2);
    const isDark = section?.backgroundTheme === 'dark';
    const iconName = section?.icon || "Play";

    return (
        <div className={cn(
            "relative flex min-h-[600px] md:min-h-[700px] w-full items-center justify-center overflow-hidden transition-colors duration-500 py-20",
            isDark ? "bg-[#0a0a0a] text-white" : "bg-[#f5f5f5] text-[#1a1a1a]"
        )}>
            {/* Background Grid Pattern (Extremely Subtle as per sample) */}
            <div className={cn(
                "absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px:32px]",
                isDark ? "opacity-20" : "opacity-40"
            )}></div>

            {/* Main Content Container - Horizontal on Desktop */}
            <div className="container relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 max-w-7xl">

                {/* Circle Container - Left side on desktop */}
                <div className="relative flex items-center justify-center h-[280px] w-[280px] sm:h-[350px] sm:w-[350px] flex-shrink-0">
                    {/* Animated SVG Text - Tightened Radius */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    >
                        <svg
                            viewBox="0 0 300 300"
                            className="w-full h-full"
                        >
                            <defs>
                                <path
                                    id="circlePath"
                                    d="M 150, 150 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                                />
                            </defs>
                            <text
                                fill={isDark ? "white" : "#1a1a1a"}
                                fontSize="10"
                                fontWeight="500"
                                className="tracking-[1px] opacity-40 italic"
                            >
                                <textPath href="#circlePath" xlinkHref="#circlePath">
                                    {circularText}
                                </textPath>
                            </text>
                        </svg>
                    </motion.div>

                    {/* Center Button - Slightly larger/premium as per sample */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "group relative z-20 flex h-28 w-28 items-center justify-center rounded-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] transition-all sm:h-36 sm:w-36",
                            isDark ? "bg-white text-black" : "bg-[#1e293b] text-white"
                        )}
                        aria-label="Action Button"
                    >
                        {/* Glow effect on hover */}
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
                            isDark ? "bg-white" : "bg-black"
                        )} />

                        <DynamicIcon
                            name={iconName}
                            className={cn(
                                "h-12 w-12 transition-transform group-hover:scale-110 sm:h-16 sm:w-16 ml-1",
                                isDark ? "text-black" : "text-white"
                            )}
                            strokeWidth={1.5}
                            fill="currentColor"
                        />
                    </motion.button>
                </div>

                {/* Hero Content (Right side on desktop) */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-6 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className={cn(
                            "text-base md:text-lg font-medium",
                            isDark ? "text-zinc-400" : "text-zinc-600"
                        )}
                    >
                        {tag}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-[1.1] text-[#0f172a]"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className={cn(
                            "text-xl md:text-2xl font-medium",
                            isDark ? "text-zinc-500" : "text-[#475569]"
                        )}
                    >
                        {subtitle}
                    </motion.p>

                    {/* CTA Button - Match sample */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="pt-4"
                    >
                        <button className={cn(
                            "px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg",
                            "bg-[#1e293b] hover:bg-[#334155]"
                        )}>
                            Tìm hiểu thêm
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
