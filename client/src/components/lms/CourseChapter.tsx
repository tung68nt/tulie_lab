'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ChevronDown, Lock } from 'lucide-react';

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
                className="bg-card px-4 pt-2 pb-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsChapterOpen(!isChapterOpen)}
            >
                <h3 className="font-bold text-[15px] text-foreground flex items-center gap-2 h-full py-1">
                    <span className="text-muted-foreground/60 transition-transform duration-200 shrink-0 flex items-center justify-center p-0.5" style={{ transform: isChapterOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex items-center">{chapterName}</span>
                    <span className="text-[12px] font-normal text-muted-foreground/60 ml-2 flex items-center">
                        ({chapterLessons.length} bài học)
                    </span>
                </h3>
            </div>

            {/* Chapter Content - Sections and Lessons */}
            <div className={`transition-all duration-300 ease-in-out ${isChapterOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {Object.entries(lessonsBySection).map(([sectionName, sectionLessons]: [string, any], sIndex) => (
                    <div key={sectionName || sIndex} className="flex flex-col">
                        {sectionName && (
                            <div className="px-5 py-2 bg-muted/20 border-t border-border/30">
                                <h4 className="text-[14px] font-semibold text-muted-foreground/80">
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
                                            className="flex items-start p-3 gap-3 cursor-pointer"
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
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
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
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <h4 className={`text-[13px] font-medium leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                                                                {lesson.title}
                                                            </h4>
                                                            <span className="text-muted-foreground/60 transition-transform duration-200 shrink-0" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                                <ChevronDown className="w-3 h-3" />
                                                            </span>
                                                            {lesson.isFree && !isEnrolled && (
                                                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 whitespace-nowrap">
                                                                    Học thử miễn phí
                                                                </span>
                                                            )}
                                                        </div>
                                                        {lesson.description && (
                                                            <div className="text-[12px] text-muted-foreground mb-1 leading-relaxed line-clamp-1 group-hover:line-clamp-none">
                                                                {lesson.description}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                                        {isLocked ? (
                                                            <div className="flex items-center justify-center w-8 h-8 opacity-40">
                                                                <Lock size={14} />
                                                            </div>
                                                        ) : (
                                                            <Link href={`/learn/${courseSlug}/${lesson.slug}`}>
                                                                <Button size="sm" className="h-8 text-[12px] font-semibold shadow-sm px-4">
                                                                    Vào học
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expandable Content - Outcomes */}
                                                <div className={`transition-all duration-300 overflow-hidden ${isExpanded && lesson.learningOutcomes ? 'max-h-[500px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    {lesson.learningOutcomes && (
                                                        <div className="bg-muted/30 rounded-lg p-2.5 border border-border/30">
                                                            <p className="text-[11px] font-bold text-foreground mb-1.5 uppercase tracking-wider">Bạn sẽ học được gì:</p>
                                                            <div className="text-[12px] text-muted-foreground space-y-1.5">
                                                                {(() => {
                                                                    let outcomes: string[] = [];
                                                                    const raw = lesson.learningOutcomes;
                                                                    if (typeof raw === 'string') outcomes = raw.split('\n');
                                                                    else if (Array.isArray(raw)) outcomes = raw.map(String);

                                                                    return outcomes
                                                                        .map(o => o.trim())
                                                                        .filter(o => o && o !== '-' && o !== '•')
                                                                        .map((line, i) => (
                                                                            <div key={i} className="flex gap-2">
                                                                                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                                                                                <span>{line.replace(/^[-\u2022]\s*/, '')}</span>
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
