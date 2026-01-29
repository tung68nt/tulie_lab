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
        <section className="py-24 md:py-32 relative overflow-hidden bg-background">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={2}
            />

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Sticky Sidebar Header */}
                    <div className="w-full lg:w-1/3 lg:sticky lg:top-32 lg:h-fit">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                                <span className="text-[10px] font-bold">Lộ trình học tập</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                {section.title || "Lộ trình học tập Chuyên sâu"}
                            </h2>
                            <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-medium">
                                {section.subtitle || "Các khóa học được sắp xếp theo trình tự logic, giúp bạn nắm vững kiến thức từ nền tảng đến chuyên sâu theo lộ trình bài bản."}
                            </p>
                        </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

                        <div className="space-y-12 pb-24">
                            {modules.map((module: any, index: number) => {
                                const isExpanded = expandedModule === index;
                                return (
                                    <div key={index} className="relative pl-16 md:pl-24 group">
                                        {/* Timeline Marker */}
                                        <div className="absolute left-0 top-6 w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border border-zinc-200 flex items-center justify-center z-10 shadow-sm transition-all group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                                            <span className="text-base md:text-xl font-bold text-zinc-900">{index + 1}</span>
                                        </div>

                                        {/* Module Card */}
                                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                                            <div className="flex flex-col md:flex-row h-full">
                                                {/* Thumbnail */}
                                                <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto min-h-[200px]">
                                                    <Image
                                                        src={module.image || "/placeholder.jpg"}
                                                        alt={module.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                                                        Phần {index + 1}
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="flex-1 p-8 flex flex-col justify-center">
                                                    <div className="space-y-4">
                                                        <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                                                            {module.title}
                                                        </h3>

                                                        <div className="flex items-center gap-6 text-xs font-semibold text-zinc-500 tracking-tight">
                                                            <span>{module.lessons?.length || 0} Bài học</span>
                                                        </div>

                                                        <div className="flex items-center gap-4 pt-4">
                                                            <button
                                                                onClick={() => setExpandedModule(isExpanded ? null : index)}
                                                                className="h-10 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-bold flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                                            >
                                                                Nội dung {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            </button>

                                                            <button className="h-10 px-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                                                                Học ngay <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable Lessons List */}
                                            {isExpanded && module.lessons && (
                                                <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 border-t border-dashed border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <div className="space-y-3">
                                                        {module.lessons.map((lesson: string, i: number) => (
                                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
                                                                <div className="mt-1 h-5 w-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                                    {lesson.toLowerCase().includes('tài liệu') ? (
                                                                        <FileText size={12} strokeWidth={3} />
                                                                    ) : (
                                                                        <PlayCircle size={12} strokeWidth={3} />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                                    {lesson}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
