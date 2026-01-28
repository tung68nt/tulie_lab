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
        'slide-up': { initial: { y: 50 }, whileInView: { y: 0 } }
    };

    const selectedAnimation = animationVariants[section.animation || 'fade-up'];

    return (
        <section className={cn(
            "py-20 px-4 relative overflow-hidden",
            section.className
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                className={section.appearance === 'glass' ? "bg-black/80" : undefined}
            />

            <div className="max-w-7xl mx-auto">
                <StandardSectionHeader section={section} />

                <motion.div
                    {...selectedAnimation}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                        "relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl",
                        section.appearance === 'glass' ? "p-1 bg-white/20 border border-white/30" : "bg-black"
                    )}
                >
                    <div className={cn("w-full h-full", aspectRatioClass)}>
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
