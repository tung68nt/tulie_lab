'use client';
import { useState } from 'react';
import { Section } from '@/types/sections';
import { BookOpen, FileText, PlayCircle, Star, Zap, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations/FadeIn';
import { StandardSectionHeader } from '../StandardSectionHeader';

export const CurriculumSection = ({ section }: { section: Section }) => {
    const modules = section.items || [];
    const [expandedModule, setExpandedModule] = useState<number | null>(null);

    return (
        <section className="py-24 md:py-32 relative bg-background">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                glowVariant={2}
            />

            <div className="container px-4 mx-auto relative z-10">
                <FadeIn direction="up">
                    <StandardSectionHeader
                        section={section}
                    />
                </FadeIn>

                {/* Vertical Stack Content */}
                <div className="max-w-[1100px] mx-auto space-y-16">
                    {modules.map((module: any, index: number) => {
                        return (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="group relative bg-card rounded-3xl p-6 md:p-8 lg:p-10 border border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-2xl">
                                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                                        {/* Thumbnail - Left Side (35%) */}
                                        <div className="relative w-full lg:w-[35%] shrink-0">
                                            <div className="aspect-video rounded-3xl overflow-hidden shadow-lg border border-border/50">
                                                <Image
                                                    src={module.image || "/placeholder.jpg"}
                                                    alt={String(module.title || '')}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <SectionTag
                                                    variant={section.backgroundTheme === 'dark' ? 'dark' : 'default'}
                                                    className="shadow-lg backdrop-blur-xl"
                                                >
                                                    Module {index + 1}
                                                </SectionTag>
                                            </div>
                                        </div>

                                        {/* Content - Right Side */}
                                        <div className="flex-1 w-full space-y-6">
                                            <div>
                                                <h3 className={cn(
                                                    "text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors",
                                                    section.backgroundTheme === 'dark' ? "text-white" : "text-foreground"
                                                )}>
                                                    {String(module.title || '')}
                                                </h3>

                                                <div className="flex items-center gap-3">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        <span>{module.lessons?.length || 0} bài học</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Clean Lesson List */}
                                            {module.lessons && module.lessons.length > 0 && (
                                                <div className="flex flex-col gap-0.5 pt-2">
                                                    {module.lessons.map((lesson: string, i: number) => (
                                                        <div key={i} className="flex items-start gap-3 group/lesson py-1.5 px-2 -ml-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                            <div className="mt-1 shrink-0">
                                                                <PlayCircle className={cn(
                                                                    "w-5 h-5 transition-colors",
                                                                    "text-zinc-400 dark:text-zinc-600 group-hover/lesson:text-primary"
                                                                )} />
                                                            </div>
                                                            <span className={cn(
                                                                "text-[16px] font-medium transition-colors leading-relaxed",
                                                                "text-zinc-600 dark:text-zinc-400 group-hover/lesson:text-zinc-900 dark:group-hover/lesson:text-zinc-200"
                                                            )}>
                                                                {lesson}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
