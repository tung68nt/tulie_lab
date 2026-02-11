'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ChevronDown, Lock, Play, FileText, BadgeCheck, Check } from 'lucide-react';

interface Lesson {
    id: string;
    slug: string;
    title: string;
    description?: string;
    learningOutcomes?: string | string[];
    thumbnail?: string;
    duration?: string;
    isFree?: boolean;
    videoUrl?: string;
    type?: 'VIDEO' | 'QUIZ' | 'TEXT';
    section?: string;
}

function getVideoThumbnail(url?: string): string | null {
    if (!url) return null;

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }

    return null;
}

interface CourseChapterProps {
    chapterName: string;
    chapterLessons: Lesson[];
    chapterIndex: number;
    courseSlug: string;
    isEnrolled: boolean;
}

export function CourseChapter({
    chapterName,
    chapterLessons,
    chapterIndex,
    courseSlug,
    isEnrolled
}: CourseChapterProps) {
    const [isChapterOpen, setIsChapterOpen] = useState(chapterIndex === 0);
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

    const toggleLesson = (lessonId: string) => {
        setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
    };

    // Group lessons by section
    const lessonsBySection = chapterLessons.reduce((acc: any, lesson) => {
        const section = lesson.section || '';
        if (!acc[section]) acc[section] = [];
        acc[section].push(lesson);
        return acc;
    }, {});

    return (
        <div className="border-b border-border/50 last:border-0">
            {/* Chapter Header - Click to Toggle */}
            <div
                className="bg-card px-8 py-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsChapterOpen(!isChapterOpen)}
            >
                <h3 className="font-bold text-[16px] text-zinc-900 dark:text-zinc-100 flex items-center gap-2 h-full m-0 leading-none py-1">
                    <span className="text-zinc-400 transition-transform duration-200 shrink-0 flex items-center justify-center p-0.5" style={{ transform: isChapterOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex items-center">{chapterName}</span>
                    <span className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 ml-2 flex items-center">
                        ({chapterLessons.length} bài học)
                    </span>
                </h3>
            </div>

            {/* Chapter Content - Sections and Lessons */}
            <div className={`transition-all duration-300 ease-in-out ${isChapterOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {Object.entries(lessonsBySection).map(([sectionName, sectionLessons]: [string, any], sIndex) => (
                    <div key={sectionName || sIndex} className="flex flex-col">
                        {sectionName && (
                            <div className="pl-5 pr-5 pt-6 pb-1 bg-muted/20 dark:bg-white/5 border-t border-border/30 dark:border-white/10">
                                <h4 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                                    {sectionName}
                                </h4>
                            </div>
                        )}
                        <div className="divide-y divide-border/30">
                            {sectionLessons.map((lesson: Lesson) => {
                                const isLocked = !isEnrolled && !lesson.isFree;
                                const isExpanded = expandedLessonId === lesson.id;

                                return (
                                    <div key={lesson.id} className="group flex flex-col transition-colors hover:bg-muted/30">
                                        <div
                                            className="flex items-start pl-5 pr-3 py-5 gap-3 cursor-pointer"
                                            onClick={() => toggleLesson(lesson.id)}
                                        >
                                            {/* Lesson Thumbnail */}
                                            <div className="shrink-0 w-24 h-16 bg-zinc-100 rounded-md overflow-hidden relative border border-zinc-200">
                                                {(() => {
                                                    const thumb = lesson.thumbnail || getVideoThumbnail(lesson.videoUrl);
                                                    const hasVideo = !!lesson.videoUrl;

                                                    if (thumb) {
                                                        return (
                                                            <>
                                                                <img src={thumb} alt={lesson.title} className="w-full h-full object-cover" />
                                                                {hasVideo && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                        <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                                                            <svg className="w-3 h-3 text-white fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    }

                                                    if (hasVideo) {
                                                        return (
                                                            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                                                                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300">
                                                            <FileText className="w-8 h-8 opacity-40" strokeWidth={1.5} />
                                                        </div>
                                                    );
                                                })()}

                                                {lesson.duration && (
                                                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-medium px-1 rounded-[2px]">
                                                        {lesson.duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Lesson Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                            <h4 className={`text-[15px] font-bold leading-tight ${isLocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors'}`}>
                                                                {lesson.title}
                                                            </h4>
                                                            <span className="text-zinc-400 transition-transform duration-200 shrink-0" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                                <ChevronDown className="w-3 h-3" />
                                                            </span>
                                                        </div>
                                                        {lesson.description && (
                                                            <div className="text-[14px] font-medium text-zinc-600 dark:text-zinc-400 mb-1 leading-relaxed line-clamp-1 group-hover:line-clamp-none">
                                                                {lesson.description}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="shrink-0 flex items-center gap-3 pt-1" onClick={(e) => e.stopPropagation()}>
                                                        {lesson.isFree && !isEnrolled && (
                                                            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap shadow-[0_0_10px_-2px_rgba(16,185,129,0.1)]">
                                                                Học thử miễn phí
                                                            </span>
                                                        )}
                                                        {isLocked ? (
                                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                                <span className="text-[13px] font-medium">Mua để tiếp tục</span>
                                                                <Lock size={14} className="opacity-60" />
                                                            </div>
                                                        ) : (
                                                            <Link href={`/learn/${courseSlug}/${lesson.slug}`}>
                                                                <Button size="sm" className="h-[38px] text-[13px] font-bold shadow-sm px-5 flex items-center gap-2 rounded-xl">
                                                                    <Play size={15} />
                                                                    Vào học
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expandable Content - Outcomes */}
                                                <div className={`transition-all duration-300 overflow-hidden ${isExpanded && lesson.learningOutcomes ? 'max-h-[500px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    {lesson.learningOutcomes && (
                                                        <div className="mt-3 pl-1">
                                                            <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 mb-2">Bạn sẽ học được gì:</p>
                                                            <div className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 space-y-2">
                                                                {(() => {
                                                                    let outcomes: string[] = [];
                                                                    const raw = lesson.learningOutcomes;
                                                                    if (typeof raw === 'string') outcomes = raw.split('\n');
                                                                    else if (Array.isArray(raw)) outcomes = raw.map(String);

                                                                    return outcomes
                                                                        .map(o => o.trim())
                                                                        .filter(o => o && o !== '-' && o !== '•')
                                                                        .map((line, i) => (
                                                                            <div key={i} className="flex gap-2 items-start">
                                                                                <div className="shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                                                                                    <Check className="w-2.5 h-2.5 text-emerald-500" strokeWidth={2.5} />
                                                                                </div>
                                                                                <span className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">{line.replace(/^[-\u2022]\s*/, '')}</span>
                                                                            </div>
                                                                        ));
                                                                })()}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
