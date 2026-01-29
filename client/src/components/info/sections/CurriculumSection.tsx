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
                <div className="max-w-[1100px] mx-auto space-y-16">
                    {modules.map((module: any, index: number) => {
                        return (
                            <div key={index} className="group flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                                {/* Thumbnail - Left Side (40%) */}
                                <div className="relative w-full lg:w-[40%] aspect-video rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
                                    <Image
                                        src={module.image || "/placeholder.jpg"}
                                        alt={String(module.title || '')}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-lg border border-white/10 shadow-lg">
                                            Module {index + 1}
                                        </div>
                                    </div>
                                </div>

                                {/* Content - Right Side (60%) */}
                                <div className="flex-1 space-y-8">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                                            {String(module.title || '')}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-primary">
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                <span className="not-italic tracking-wide">{module.lessons?.length || 0} bài học</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/5 text-blue-500">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                <span className="not-italic tracking-wide">Video & Tài liệu</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clean Lesson List */}
                                    {module.lessons && module.lessons.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                                            {module.lessons.map((lesson: string, i: number) => (
                                                <div key={i} className="flex items-start gap-3 group/lesson">
                                                    <PlayCircle className="w-5 h-5 text-primary/40 group-hover/lesson:text-primary transition-colors mt-0.5 shrink-0" />
                                                    <span className="text-[14px] font-medium text-foreground/80 group-hover/lesson:text-foreground transition-all leading-relaxed">
                                                        {lesson}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
