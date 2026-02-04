'use client';
import { useState } from 'react';
import { Section } from '@/types/sections';
import { BookOpen, FileText, PlayCircle, Star, Zap, ChevronDown, ChevronUp, ArrowRight, Gift } from 'lucide-react';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations/FadeIn';
import { StandardSectionHeader } from '../StandardSectionHeader';

export const CurriculumSection = ({ section }: { section: Section }) => {
    const modules = section.items || [];
    const [expandedModule, setExpandedModule] = useState<number | null>(null);
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className="py-12 md:py-16 relative bg-background">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                glowVariant={2}
            />

            <div className="container px-4 mx-auto relative z-10">
                <StandardSectionHeader
                    section={section}
                />

                {/* Vertical Stack Content */}
                <div className="max-w-[1100px] mx-auto space-y-8">
                    {modules.map((module: any, index: number) => {
                        return (
                            <FadeIn key={index} direction="up" delay={index * 0.1} duration={0.6}>
                                <div className="group relative bg-card rounded-3xl p-6 md:p-8 lg:p-10 border border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-2xl">
                                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                                        {/* Thumbnail - Left Side (35%) */}
                                        <div className="relative w-full lg:w-[35%] shrink-0">
                                            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-border/50">
                                                <Image
                                                    src={module.image || "/hero_vibe_coding.png"}
                                                    alt={String(module.title || '')}
                                                    fill
                                                    className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
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
                                                    "text-2xl md:text-3xl font-bold leading-[1.2] mb-4 group-hover:text-primary transition-colors",
                                                    section.backgroundTheme === 'dark' ? "text-white" : "text-zinc-950 dark:text-white"
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
                                                    {module.lessons.map((lesson: string, i: number) => {
                                                        // Parse icon prefix if exists: e.g. "[quiz] Bài tập cuối khóa"
                                                        let iconType = '';
                                                        let cleanLesson = lesson;
                                                        const prefixMatch = lesson.match(/^\[(video|gift|doc|quiz|bonus)\]\s*/i);
                                                        if (prefixMatch) {
                                                            iconType = prefixMatch[1].toLowerCase();
                                                            cleanLesson = lesson.replace(prefixMatch[0], '');
                                                        }

                                                        // Parse title and description
                                                        // Format: "Title - Description"
                                                        const parts = cleanLesson.split(' - ');
                                                        const title = parts[0];
                                                        const description = parts.length > 1 ? parts.slice(1).join(' - ') : '';

                                                        // Determine Icon
                                                        const lowerTitle = title.toLowerCase();
                                                        let Icon = PlayCircle;

                                                        // Priority 1: Explicit prefix
                                                        if (iconType === 'quiz') Icon = Zap;
                                                        else if (iconType === 'doc') Icon = FileText;
                                                        else if (iconType === 'gift' || iconType === 'bonus') Icon = Gift;
                                                        else if (iconType === 'video') Icon = PlayCircle;
                                                        // Priority 2: Keyword fallback
                                                        else if (lowerTitle.includes('tặng') || lowerTitle.includes('bonus') || lowerTitle.includes('gift')) {
                                                            Icon = Gift;
                                                        } else if (lowerTitle.includes('tài liệu') || lowerTitle.includes('pdf') || lowerTitle.includes('checklist') || lowerTitle.includes('source code')) {
                                                            Icon = FileText;
                                                        } else if (lowerTitle.includes('bài tập') || lowerTitle.includes('quiz') || lowerTitle.includes('test')) {
                                                            Icon = Zap;
                                                        }

                                                        let iconColorClass = isDark ? "text-zinc-600 group-hover/lesson:text-primary" : "text-zinc-400 group-hover/lesson:text-primary";

                                                        return (
                                                            <div key={i} className="flex items-start gap-3 group/lesson py-2 px-3 -ml-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                                <div className="mt-1 shrink-0">
                                                                    <Icon className={cn(
                                                                        "w-5 h-5 transition-colors",
                                                                        iconColorClass
                                                                    )} />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className={cn(
                                                                        "text-[16px] font-bold transition-colors leading-snug",
                                                                        isDark ? "text-zinc-200 group-hover/lesson:text-white" : "text-zinc-700 group-hover/lesson:text-zinc-900"
                                                                    )}>
                                                                        {title}
                                                                    </span>
                                                                    {description && (
                                                                        <span className={cn(
                                                                            "text-sm mt-1 leading-relaxed whitespace-pre-line",
                                                                            isDark ? "text-zinc-400" : "text-muted-foreground"
                                                                        )}>
                                                                            {description}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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
