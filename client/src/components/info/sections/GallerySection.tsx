'use client';

import React, { useState } from 'react';
import { Section } from '@/types/sections';
import { StandardSectionHeader } from '../StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Maximize2 } from 'lucide-react';

export const GallerySection: React.FC<{ section: Section }> = ({ section }) => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

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
                className={section.appearance === 'glass' ? "bg-black/80" : undefined}
            />

            <div className="max-w-7xl mx-auto">
                <StandardSectionHeader section={section} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.items?.map((item, idx) => (
                        <motion.div
                            key={idx}
                            {...selectedAnimation}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            onClick={() => setSelectedItem(item)}
                            className={cn(
                                "group relative rounded-xl overflow-hidden cursor-pointer aspect-video shadow-lg hover:shadow-2xl transition-all duration-300",
                                section.appearance === 'glass' ? "p-1 bg-white/20 border border-white/30" : "bg-muted"
                            )}
                        >
                            {/* Media content */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center">
                                {item.videoUrl ? (
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3">
                                        <Play className="h-6 w-6 ml-1" />
                                    </div>
                                ) : (
                                    <Maximize2 className="h-8 w-8 mb-3 opacity-80" />
                                )}
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                {item.description && <p className="text-sm opacity-90">{item.description}</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-10"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-2"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-6xl w-full max-h-[80vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedItem.videoUrl ? (
                                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
                                    {selectedItem.videoUrl.includes('youtube.com') || selectedItem.videoUrl.includes('youtu.be') ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${selectedItem.videoUrl.split('v=')[1]?.split('&')[0] || selectedItem.videoUrl.split('/').pop()}`}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video src={selectedItem.videoUrl} controls className="w-full h-full" autoPlay />
                                    )}
                                </div>
                            ) : (
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.title}
                                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                />
                            )}

                            <div className="absolute -bottom-16 left-0 right-0 text-center text-white">
                                <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
                                <p className="opacity-80 mt-1">{selectedItem.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
