'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/types/sections';
import { BookOpen, PlayCircle, ChevronDown, ChevronUp, Lock, Eye, Clock, FileText, HelpCircle } from 'lucide-react';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations/FadeIn';
import { StandardSectionHeader } from '../StandardSectionHeader';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';

interface Chapter {
    id: string;
    title: string;
    position: number;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    type: 'VIDEO' | 'TEXT' | 'QUIZ';
    duration?: number;
    isFree?: boolean;
    position: number;
}

interface Course {
    id: string;
    title: string;
    slug: string;
    chapters?: Chapter[];
}

export const CourseContentSection = ({ section }: { section: Section }) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const isDark = section.backgroundTheme === 'dark';

    // Get courseId from section config
    const courseId = section.courseId;

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                setLoading(false);
                return;
            }

            try {
                const res: any = await api.courses.getById(courseId);
                setCourse(res);
                // Expand first chapter by default
                if (res?.chapters && res.chapters.length > 0) {
                    setExpandedChapters(new Set([res.chapters[0].id]));
                }
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev => {
            const next = new Set(prev);
            if (next.has(chapterId)) {
                next.delete(chapterId);
            } else {
                next.add(chapterId);
            }
            return next;
        });
    };

    const expandAll = () => {
        if (course?.chapters) {
            setExpandedChapters(new Set(course.chapters.map(c => c.id)));
        }
    };

    const collapseAll = () => {
        setExpandedChapters(new Set());
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            const remainMins = mins % 60;
            return `${hours}h${remainMins}p`;
        }
        return `${mins}p${secs.toString().padStart(2, '0')}s`;
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <PlayCircle className="w-4 h-4" />;
            case 'TEXT': return <FileText className="w-4 h-4" />;
            case 'QUIZ': return <HelpCircle className="w-4 h-4" />;
            default: return <PlayCircle className="w-4 h-4" />;
        }
    };

    // Calculate totals
    const totalChapters = course?.chapters?.length || 0;
    const totalLessons = course?.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0;
    const totalDuration = course?.chapters?.reduce((acc, ch) =>
        acc + (ch.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0), 0
    ) || 0;

    return (
        <section className="py-12 md:py-16 relative bg-background">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={true}
            />

            <div className="container px-4 mx-auto relative z-10">
                <StandardSectionHeader section={section} />

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                )}

                {/* No Course Selected */}
                {!loading && !courseId && (
                    <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Chưa chọn khóa học. Vui lòng chọn khóa học trong phần cấu hình section.</p>
                    </div>
                )}

                {/* Course Not Found */}
                {!loading && courseId && !course && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Không tìm thấy khóa học.</p>
                    </div>
                )}

                {/* Course Content */}
                {!loading && course && (
                    <FadeIn direction="up" duration={0.6}>
                        <div className="max-w-[900px] mx-auto">
                            {/* Summary Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        {totalChapters} chương
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4" />
                                        {totalLessons} bài học
                                    </span>
                                    {totalDuration > 0 && (
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {formatDuration(totalDuration)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs">
                                        Mở tất cả
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">
                                        Thu gọn
                                    </Button>
                                </div>
                            </div>

                            {/* Chapters List */}
                            <div className="border border-border rounded-2xl overflow-hidden bg-card">
                                {course.chapters?.sort((a, b) => a.position - b.position).map((chapter, chapterIndex) => {
                                    const isExpanded = expandedChapters.has(chapter.id);
                                    const lessonCount = chapter.lessons?.length || 0;
                                    const chapterDuration = chapter.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0;

                                    return (
                                        <div key={chapter.id} className="border-b border-border last:border-b-0">
                                            {/* Chapter Header */}
                                            <button
                                                onClick={() => toggleChapter(chapter.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-4 md:p-5 text-left transition-colors",
                                                    isDark
                                                        ? "hover:bg-zinc-800/50"
                                                        : "hover:bg-zinc-50",
                                                    isExpanded && (isDark ? "bg-zinc-800/30" : "bg-zinc-50/50")
                                                )}
                                            >
                                                {/* Chapter Number */}
                                                <div className={cn(
                                                    "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold",
                                                    isDark
                                                        ? "bg-zinc-800 text-white"
                                                        : "bg-zinc-900 text-white"
                                                )}>
                                                    {chapterIndex + 1}
                                                </div>

                                                {/* Chapter Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={cn(
                                                        "font-semibold text-base md:text-lg leading-snug line-clamp-2",
                                                        isDark ? "text-white" : "text-zinc-900"
                                                    )}>
                                                        {chapter.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                        <span>{lessonCount} bài</span>
                                                        {chapterDuration > 0 && (
                                                            <span>{formatDuration(chapterDuration)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expand Icon */}
                                                <div className="shrink-0 text-muted-foreground">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </button>

                                            {/* Lessons List */}
                                            {isExpanded && chapter.lessons && chapter.lessons.length > 0 && (
                                                <div className={cn(
                                                    "border-t",
                                                    isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50/30"
                                                )}>
                                                    {chapter.lessons.sort((a, b) => a.position - b.position).map((lesson, lessonIndex) => (
                                                        <div
                                                            key={lesson.id}
                                                            className={cn(
                                                                "flex items-center gap-3 px-4 md:px-5 py-3 transition-colors border-b last:border-b-0",
                                                                isDark
                                                                    ? "border-zinc-800 hover:bg-zinc-800/30"
                                                                    : "border-zinc-100 hover:bg-white"
                                                            )}
                                                        >
                                                            {/* Lesson Number */}
                                                            <span className="w-6 text-center text-xs text-muted-foreground font-medium shrink-0">
                                                                {chapterIndex + 1}.{lessonIndex + 1}
                                                            </span>

                                                            {/* Lesson Icon */}
                                                            <div className={cn(
                                                                "shrink-0 relative -top-[0.5px]",
                                                                lesson.isFree ? "text-primary" : "text-muted-foreground"
                                                            )}>
                                                                {getLessonIcon(lesson.type)}
                                                            </div>

                                                            {/* Lesson Title */}
                                                            <span className={cn(
                                                                "flex-1 text-sm font-medium line-clamp-1",
                                                                isDark ? "text-zinc-300" : "text-zinc-700"
                                                            )}>
                                                                {lesson.title}
                                                            </span>

                                                            {/* Free Badge or Lock */}
                                                            {lesson.isFree ? (
                                                                <SectionTag size="sm" variant="primary" showDot={false} className="shrink-0">
                                                                    <div className="flex items-center gap-1">
                                                                        <Eye className="w-3 h-3" />
                                                                        <span className="whitespace-nowrap">Học thử</span>
                                                                    </div>
                                                                </SectionTag>
                                                            ) : (
                                                                <Lock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                                                            )}

                                                            {/* Duration */}
                                                            {lesson.duration && (
                                                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                                                    {formatDuration(lesson.duration)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeIn>
                )}
            </div>
        </section>
    );
};
