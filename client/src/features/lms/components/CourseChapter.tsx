"use client";

import React, { useState } from 'react';
import { ChevronDown, Play, Lock, FileText, Check } from 'lucide-react';
import { Button } from '@/components/Button';
import Link from 'next/link';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    duration?: string;
    videoUrl?: string;
    thumbnail?: string;
    isFree?: boolean;
    section?: string;
    learningOutcomes?: string | string[];
}

interface CourseChapterProps {
    chapterName: string;
    chapterLessons: Lesson[];
    chapterIndex: number;
    courseSlug: string;
    isEnrolled: boolean;
}

const getVideoThumbnail = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }
    return null;
};

export const CourseChapter: React.FC<CourseChapterProps> = ({
    chapterName,
    chapterLessons,
    chapterIndex,
    courseSlug,
    isEnrolled
}) => {
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
        <div className="border-b border-zinc-200 dark:border-white/5 last:border-0">
            {/* Chapter Header - Click to Toggle */}
            <div
                className="bg-zinc-50 dark:bg-zinc-900/50 px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors border-b border-zinc-100 dark:border-white/5"
                onClick={() => setIsChapterOpen(!isChapterOpen)}
            >
                <h3 className="font-bold text-[16px] text-zinc-900 dark:text-zinc-100 flex items-center gap-2 h-full m-0 leading-none">
                    <span className="text-zinc-400 dark:text-zinc-500 transition-transform duration-200 shrink-0" style={{ transform: isChapterOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                        <ChevronDown className="w-4 h-4" />
                    </span>
                    <span>{chapterName}</span>
                    <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 ml-2">
                        ({chapterLessons.length} bài học)
                    </span>
                </h3>
            </div>

            {/* Chapter Content - Sections and Lessons */}
            <div className={`transition-all duration-300 ease-in-out ${isChapterOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {Object.entries(lessonsBySection).map(([sectionName, sectionLessons]: [string, any], sIndex) => (
                    <div key={sectionName || sIndex} className="flex flex-col">
                        {sectionName && (
                            <div className="pl-8 pr-5 pt-8 pb-3 bg-zinc-100/30 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5 mb-1">
                                <h4 className="text-[14px] font-bold text-zinc-500 dark:text-zinc-400">
                                    {sectionName}
                                </h4>
                            </div>
                        )}
                        <div className="divide-y divide-zinc-100 dark:divide-white/5 bg-white dark:bg-zinc-900/50">
                            {sectionLessons.map((lesson: Lesson) => {
                                const isLocked = !isEnrolled && !lesson.isFree;
                                const isExpanded = expandedLessonId === lesson.id;

                                return (
                                    <div key={lesson.id} className="group flex flex-col transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
                                        <div
                                            className="flex items-start pl-5 pr-3 py-5 gap-3 cursor-pointer"
                                            onClick={() => toggleLesson(lesson.id)}
                                        >
                                            {/* Lesson Thumbnail */}
                                            <div className="shrink-0 w-24 h-16 bg-zinc-100 dark:bg-white/5 rounded-md overflow-hidden relative border border-zinc-200 dark:border-white/10">
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
                                                            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-white/5 text-zinc-400">
                                                                <svg className="w-8 h-8 fill-current text-zinc-300 dark:text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-white/5 text-zinc-300">
                                                            <FileText className="w-8 h-8 text-zinc-300 dark:text-white opacity-40" strokeWidth={1.5} />
                                                        </div>
                                                    );
                                                })()}

                                                {lesson.duration && (
                                                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-medium px-1 rounded-[2px] border border-white/10">
                                                        {lesson.duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Lesson Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h5 className={`text-[14px] font-bold line-clamp-1 transition-colors ${isExpanded ? 'text-primary' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                            {lesson.title}
                                                            <ChevronDown className={`inline-block ml-1 w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </h5>
                                                        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                                            {lesson.description || 'Không có mô tả cho bài học này'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                                        {lesson.isFree && (
                                                            <Link href={`/learn/${courseSlug}/${lesson.slug}`}>
                                                                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-500/20 whitespace-nowrap shadow-[0_0_8px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20 transition-colors">
                                                                    Học thử miễn phí
                                                                </div>
                                                            </Link>
                                                        )}
                                                        {isLocked ? (
                                                            <span className="text-zinc-400 dark:text-zinc-600"><Lock className="w-3.5 h-3.5" /></span>
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
                                                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    {lesson.learningOutcomes && (
                                                        <div className="bg-zinc-50 dark:bg-white/5 rounded-lg p-4 border border-zinc-100 dark:border-white/5">
                                                            <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                                Bạn sẽ học được gì
                                                            </p>
                                                            <div className="space-y-2">
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
                                                                                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                                                                                <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{line.replace(/^[-\u2022]\s*/, '')}</span>
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
};
