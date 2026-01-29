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
                {/* Centered Header */}
                <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider">Lộ trình học tập</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                        {String(section.title || "Lộ trình học tập Chuyên sâu")}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {String(section.subtitle || "Các khóa học được sắp xếp theo trình tự logic, giúp bạn nắm vững kiến thức từ nền tảng đến chuyên sâu.")}
                    </p>
                </div>

                {/* Vertical Stack Content */}
                <div className="max-w-[1000px] mx-auto space-y-8">
                    {modules.map((module: any, index: number) => {
                        const isExpanded = expandedModule === index;
                        return (
                            <div key={index} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-primary/50">
                                <div className="flex flex-col md:flex-row">
                                    {/* Thumbnail - Left Side */}
                                    <div className="relative w-full md:w-[35%] aspect-video md:aspect-auto min-h-[220px]">
                                        <Image
                                            src={module.image || "/placeholder.jpg"}
                                            alt={String(module.title || '')}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <div className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                                                Module {index + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content - Right Side */}
                                    <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                                        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
                                            {String(module.title || '')}
                                        </h3>

                                        <div className="flex items-center gap-6 mb-8 text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span>{module.lessons?.length || 0} bài học</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span>Video & Tài liệu</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setExpandedModule(isExpanded ? null : index)}
                                                className="flex-1 md:flex-none h-12 px-8 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                            >
                                                {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && module.lessons && (
                                    <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {module.lessons.map((lesson: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                        <PlayCircle size={14} fill="currentColor" className="opacity-20" />
                                                        <span className="absolute text-[10px] font-bold">{i + 1}</span>
                                                    </div>
                                                    <span className="text-sm font-medium line-clamp-1">{lesson}</span>
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
