'use client';
import { useState } from 'react';
import { Section } from '@/types/sections';
import { BookOpen, FileText, PlayCircle, Star, Zap, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';
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
                                        <SectionTag variant="dark">
                                            Module {index + 1}
                                        </SectionTag>
                                    </div>
                                </div>

                                {/* Content - Right Side (60%) */}
                                <div className="flex-1 space-y-5">
                                    <div>
                                        <h3 className={cn(
                                            "text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors",
                                            section.backgroundTheme === 'dark' ? "text-zinc-50" : "text-zinc-900"
                                        )}>
                                            {String(module.title || '')}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
                                            <div className={cn(
                                                "flex items-center gap-2 px-3 py-1 rounded-lg",
                                                section.backgroundTheme === 'dark' ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                                            )}>
                                                <div className={cn("w-1 h-1 rounded-full", section.backgroundTheme === 'dark' ? "bg-zinc-500" : "bg-zinc-400")} />
                                                <span className="not-italic tracking-wide">{module.lessons?.length || 0} bài học</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clean Lesson List - Single Column */}
                                    {module.lessons && module.lessons.length > 0 && (
                                        <div className="flex flex-col gap-2.5">
                                            {module.lessons.map((lesson: string, i: number) => (
                                                <div key={i} className="flex items-start gap-3.5 group/lesson">
                                                    <PlayCircle className={cn(
                                                        "w-5 h-5 transition-colors mt-0.5 shrink-0",
                                                        section.backgroundTheme === 'dark' ? "text-zinc-700 group-hover/lesson:text-zinc-500" : "text-zinc-300 group-hover/lesson:text-zinc-400"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[16px] font-medium transition-all leading-relaxed",
                                                        section.backgroundTheme === 'dark' ? "text-zinc-300 group-hover/lesson:text-white" : "text-zinc-600 group-hover/lesson:text-zinc-900"
                                                    )}>
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
