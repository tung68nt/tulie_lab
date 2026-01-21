'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

interface Lesson {
    id: string;
    slug: string;
    title: string;
    description?: string;
    thumbnail?: string;
    duration?: string;
    isFree?: boolean;
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
                className="bg-card px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsChapterOpen(!isChapterOpen)}
            >
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    {isChapterOpen ? (
                        <span className="text-muted-foreground text-xs">▼</span>
                    ) : (
                        <span className="text-muted-foreground text-xs">▶</span>
                    )}
                    {chapterName}
                    <span className="text-xs font-normal text-muted-foreground ml-2">
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
                                <div className="shrink-0 w-24 h-16 bg-zinc-200 rounded-md overflow-hidden relative border border-zinc-200">
                                    {lesson.thumbnail && typeof lesson.thumbnail === 'string' ? (
                                        <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                            {/* Play Icon Placeholder */}
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    )}
                                    {/* Duration Badge */}
                                    {lesson.duration && (
                                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded-sm">
                                            {lesson.duration}
                                        </div>
                                    )}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`text-sm font-medium leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                                                    {lesson.title}
                                                </h4>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {isExpanded ? '▲' : '▼'}
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
                                                    <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                                                        Vào học
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expandable Description */}
                                    {lesson.description && (
                                        <p className={`text-xs text-muted-foreground mt-2 leading-relaxed transition-all ${isExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}>
                                            {lesson.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
