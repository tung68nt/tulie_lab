'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { StandardSectionHeader } from '../StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';
import { getMediaUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const VideoSection: React.FC<{ section: Section }> = ({ section }) => {
    const isYoutube = section.videoUrl?.includes('youtube.com') || section.videoUrl?.includes('youtu.be');
    const isVimeo = section.videoUrl?.includes('vimeo.com');

    const getEmbedUrl = (url?: string) => {
        if (!url) return '';
        if (isYoutube) {
            const id = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
            return `https://www.youtube.com/embed/${id}`;
        }
        if (isVimeo) {
            const id = url.split('/').pop();
            return `https://player.vimeo.com/video/${id}`;
        }
        return url;
    };

    const aspectRatioClass = {
        '16/9': 'aspect-video',
        '4/3': 'aspect-[4/3]',
        '1/1': 'aspect-square',
        'auto': 'aspect-auto',
        'original': 'aspect-video' // Default fallback
    }[section.mediaAspectRatio || '16/9'];

    const animationVariants = {
        none: {},
        'fade-up': { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } },
        'fade-in': { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
        'fade-left': { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 } },
        'fade-right': { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 } },
        'slide-up': { initial: { y: 50 }, whileInView: { y: 0 } }
    };

    const selectedAnimation = animationVariants[section.animation || 'fade-up'];
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn("py-12 md:py-20 relative overflow-hidden", section.className)}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                className={section.appearance === 'glass' ? "bg-black/80" : undefined}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <StandardSectionHeader section={section} />

                <motion.div
                    {...selectedAnimation}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                        "relative mx-auto max-w-5xl rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                        section.appearance === 'glass' ? "bg-white/20 border border-white/30 backdrop-blur-md" : ""
                    )}
                >
                    {/* macOS Window Header */}
                    <div className="h-10 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-4 justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                        </div>
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 absolute left-1/2 -translate-x-1/2">
                            {section.subtitle || "Video Preview"}
                        </div>
                        <div className="w-14"></div> {/* Spacer for balance */}
                    </div>

                    <div className={cn("w-full relative", aspectRatioClass)}>
                        {(isYoutube || isVimeo) ? (
                            <iframe
                                src={getEmbedUrl(section.videoUrl)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={getMediaUrl(section.videoUrl)}
                                controls
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
