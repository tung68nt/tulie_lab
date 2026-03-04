'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { StandardSectionHeader } from '../StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';
import { getMediaUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const VideoTextSection: React.FC<{ section: Section }> = ({ section }) => {
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
        'original': 'aspect-video'
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

    return (
        <section className={cn(
            "py-10 px-4 relative overflow-hidden",
            section.className
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
                hideGradients={section.backgroundTheme === 'dark'}
                className={section.appearance === 'glass' ? "bg-black/80" : undefined}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                    section.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
                )}>
                    {/* Video Column */}
                    <motion.div
                        {...selectedAnimation}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={cn(
                            "relative rounded-xl overflow-hidden shadow-2xl order-first bg-card border border-border",
                            section.imagePosition === 'right' ? 'lg:order-last' : '',
                            section.appearance === 'glass' ? "bg-white/20 border border-white/30 backdrop-blur-md" : ""
                        )}
                    >
                        {/* macOS Window Header - Exact match from cli.knowns.dev */}
                        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500 transition-transform hover:scale-110"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500 transition-transform hover:scale-110"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500 transition-transform hover:scale-110"></div>
                            </div>
                            <div className="ml-4 flex flex-1 items-center gap-2 rounded-md bg-background/80 px-3 py-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock h-3.5 w-3.5 text-muted-foreground" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span className="text-xs text-muted-foreground font-medium truncate">
                                    {section.subtitle || "Video Preview"}
                                </span>
                            </div>
                        </div>

                        <div className={cn("w-full relative bg-black/95", aspectRatioClass)}>
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

                    {/* Text Column */}
                    <div className="space-y-6">
                        <StandardSectionHeader section={section} align="left" className="mb-0" />

                        {section.content && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {section.content}
                            </p>
                        )}

                        {section.items && section.items.length > 0 && (
                            <ul className="space-y-8">
                                {section.items.map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}

                        {section.ctaText && (
                            <div className="pt-4">
                                <a
                                    href={section.ctaLink}
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                >
                                    {section.ctaText}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
