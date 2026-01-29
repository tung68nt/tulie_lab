'use client';
import { useState } from 'react';
import { Section } from '@/types/sections';
import { BookOpen, FileText, PlayCircle, Star, Zap, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';

export const CurriculumSection = ({ section }: { section: Section }) => {
    const modules = section.items || [];
    const [expandedModule, setExpandedModule] = useState<number | null>(null);

    return (
        <section className="py-24 md:py-32 relative bg-background">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={2}
            />

            <div className="container px-4 mx-auto relative z-10">
                {/* Centered Header */}
                <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4 font-bold">
                        <span className="text-xs tracking-wide">Lộ trình học tập</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                        {String(section.title || "Lộ trình học tập Chuyên sâu")}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {String(section.subtitle || "Các khóa học được sắp xếp theo trình tự logic, giúp bạn nắm vững kiến thức từ nền tảng đến chuyên sâu.")}
                    </p>
                </div>

                {/* Vertical Stack Content */}
                <div className="max-w-[1000px] mx-auto space-y-12">
                    {modules.map((module: any, index: number) => {
                        return (
                            <div key={index} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-primary/50">
                                <div className="flex flex-col md:flex-row border-b border-zinc-100 dark:border-zinc-800/50">
                                    {/* Thumbnail - Left Side */}
                                    <div className="relative w-full md:w-[40%] aspect-video md:aspect-auto min-h-[240px]">
                                        <Image
                                            src={module.image || "/placeholder.jpg"}
                                            alt={String(module.title || '')}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <div className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                                                Module {index + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content - Right Side */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                        <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-6 group-hover:text-primary transition-colors">
                                            {String(module.title || '')}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-muted-foreground">
                                            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-primary/5 text-primary">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span className="not-italic">{module.lessons?.length || 0} bài học</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-500/5 text-blue-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="not-italic">Video & Tài liệu</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lesson Grid - Always Visible */}
                                {module.lessons && module.lessons.length > 0 && (
                                    <div className="bg-zinc-50/50 dark:bg-zinc-900/30 p-8 md:p-12">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {module.lessons.map((lesson: string, i: number) => (
                                                <div key={i} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-white dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group/lesson">
                                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs group-hover/lesson:bg-primary group-hover/lesson:text-white transition-colors">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-[15px] font-semibold text-foreground/90 group-hover/lesson:text-foreground transition-colors leading-snug">
                                                        {lesson}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
