'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Lesson {
    id: string;
    slug: string;
    title: string;
    description?: string;
    thumbnail?: string;
    duration?: string;
    isFree?: boolean;
    videoUrl?: string; // Added videoUrl
    type?: 'VIDEO' | 'QUIZ' | 'TEXT';
}

function getVideoThumbnail(url?: string): string | null {
    if (!url) return null;

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }

    // Add Vimeo later if needed
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

    return (
        <div className="border-b border-border/50 last:border-0">
            {/* Chapter Header - Click to Toggle */}
            <div
                className="bg-card px-4 pt-2 pb-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsChapterOpen(!isChapterOpen)}
            >
                <h3 className="font-bold text-[13px] text-foreground flex items-center gap-2 h-full py-1">
                    <span className="text-muted-foreground/60 transition-transform duration-200 shrink-0 flex items-center justify-center p-0.5" style={{ transform: isChapterOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex items-center">{chapterName}</span>
                    <span className="text-[11px] font-normal text-muted-foreground/60 ml-2 flex items-center">
                        ({chapterLessons.length} bài học)
                    </span>
                </h3>
            </div>

            {/* Chapter Lessons - Collapsible Content */}
            <div className={`transition-all duration-300 ease-in-out ${isChapterOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {chapterLessons.map((lesson: Lesson) => {
                    const isLocked = !isEnrolled && !lesson.isFree;
                    const isExpanded = expandedLessonId === lesson.id;

                    return (
                        <div key={lesson.id} className="group flex flex-col transition-colors border-t border-border/50 first:border-t-0 hover:bg-muted/30">
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
                                                    {/* Overlay Play Icon if it is a video */}
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

                                        // Placeholder logic
                                        if (hasVideo) {
                                            return (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                                                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            );
                                        }

                                        // No video -> Document icon
                                        return (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        );
                                    })()}

                                    {/* Duration Badge */}
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
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`text-[13px] font-medium leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                                                    {lesson.title}
                                                </h4>
                                                <span className="text-muted-foreground transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                    <ChevronDown className="w-3 h-3" />
                                                </span>
                                            </div>
                                            {lesson.isFree && !isEnrolled && (
                                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                                                    Học thử miễn phí
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                            {isLocked ? (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled>
                                                    <span className="text-xs">🔒</span>
                                                </Button>
                                            ) : (
                                                <Link href={`/learn/${courseSlug}/${lesson.slug}`}>
                                                    <Button size="sm" className="h-8 text-xs font-semibold shadow-sm px-4">
                                                        Vào học
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expandable Description */}
                                    {lesson.description && (
                                        <p className={`text-[11px] text-muted-foreground mt-2 leading-relaxed transition-all ${isExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}>
                                            {lesson.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
