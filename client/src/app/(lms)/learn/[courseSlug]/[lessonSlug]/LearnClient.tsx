'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Watermark } from '@/components/system/security/Watermark';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Check, Play, ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react';

// Helper function to parse duration string
function parseDurationToSeconds(duration: string): number {
    if (!duration) return 0;
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
}

function formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface LearnClientProps {
    course: any;
    lessonSlug: string;
    courseSlug: string;
}

export function LearnClient({ course, lessonSlug, courseSlug }: LearnClientProps) {
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Collapsed state: chapters and sections
    const [collapsedItems, setCollapsedItems] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('lms-collapsed-items');
                if (saved) return new Set(JSON.parse(saved));
            } catch { /* ignore */ }
        }
        return new Set();
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('lms-collapsed-items', JSON.stringify([...collapsedItems]));
        }
    }, [collapsedItems]);

    // Parallel fetch: auth, progress, secure content
    useEffect(() => {
        const fetchSecureData = async () => {
            if (!course || !lessonSlug) return;
            setLoading(true);

            const foundLesson = course.lessons?.find((l: any) => l.slug === lessonSlug);
            if (!foundLesson) { setLoading(false); return; }

            const isFreeAccess = foundLesson.isFree || course.price === 0;

            try {
                const [authResult, progressResult] = await Promise.all([
                    api.auth.getMe().catch(() => null),
                    course.id ? api.courses.getProgress(course.id).catch(() => null) : null,
                ]);

                let access = isFreeAccess;

                if (authResult && (authResult as any).user) setUser((authResult as any).user);
                else if (authResult && (authResult as any).id) setUser(authResult);

                if (!isFreeAccess && (authResult as any)?.id) {
                    try {
                        const profile: any = await api.users.getProfile().catch(() => null);
                        if (profile?.enrollments) {
                            access = profile.enrollments.some((e: any) => e.course?.slug === courseSlug || e.courseId === course.id);
                        }
                    } catch { access = false; }
                }

                setHasAccess(access);
                if (progressResult && (progressResult as any).completedLessonIds) {
                    setCompletedLessons((progressResult as any).completedLessonIds);
                }

                if (access) {
                    try {
                        const secureContent = await api.courses.getContent(foundLesson.id);
                        setCurrentLesson(secureContent);
                    } catch { setCurrentLesson(foundLesson); }
                } else {
                    setCurrentLesson(foundLesson);
                }
            } catch (e) {
                console.warn("Failed to load lesson data", e);
                setCurrentLesson(foundLesson);
            } finally {
                setLoading(false);
            }
        };
        fetchSecureData();
    }, [course, lessonSlug, courseSlug]);

    const handleToggleComplete = async (lessonId: string, e?: React.MouseEvent) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const isCompleted = completedLessons.includes(lessonId);
        const previousState = [...completedLessons];
        try {
            if (isCompleted) {
                setCompletedLessons(completedLessons.filter(id => id !== lessonId));
                await api.courses.markUncomplete(lessonId);
            } else {
                setCompletedLessons([...completedLessons, lessonId]);
                await api.courses.markComplete(lessonId);
            }
        } catch (error) {
            console.error('Error toggling lesson complete:', error);
            setCompletedLessons(previousState);
        }
    };

    const toggleItem = (key: string) => {
        setCollapsedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };

    // Data processing
    const sortedLessons = course?.lessons?.sort((a: any, b: any) => a.position - b.position) || [];
    const currentIndex = sortedLessons.findIndex((l: any) => l.slug === lessonSlug);
    const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
    const actualCompletedLessons = sortedLessons.filter((l: any) => completedLessons.includes(l.id));
    const completedCount = actualCompletedLessons.length;
    const totalLessonsCount = sortedLessons.length;
    const progress = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
    const totalSeconds = sortedLessons.reduce((acc: number, l: any) => acc + parseDurationToSeconds(l.duration), 0);
    const completedSeconds = actualCompletedLessons.reduce((acc: number, l: any) => acc + parseDurationToSeconds(l.duration), 0);

    // Build hierarchical structure: Chapter > Section > Lessons
    const buildHierarchy = () => {
        const hierarchy: { chapter: string; sections: { section: string; lessons: any[] }[] }[] = [];

        sortedLessons.forEach((lesson: any) => {
            const chapterName = lesson.chapter || 'Nội dung';
            const sectionName = lesson.section || '';

            let chapter = hierarchy.find(c => c.chapter === chapterName);
            if (!chapter) {
                chapter = { chapter: chapterName, sections: [] };
                hierarchy.push(chapter);
            }

            let section = chapter.sections.find(s => s.section === sectionName);
            if (!section) {
                section = { section: sectionName, lessons: [] };
                chapter.sections.push(section);
            }

            section.lessons.push(lesson);
        });

        return hierarchy;
    };

    const hierarchy = buildHierarchy();
    const allChapters = hierarchy.map(c => `ch:${c.chapter}`);
    const allSections = hierarchy.flatMap(c => c.sections.filter(s => s.section).map(s => `sec:${c.chapter}:${s.section}`));
    const allItems = [...allChapters, ...allSections];

    const expandAll = () => setCollapsedItems(new Set());
    const collapseAll = () => setCollapsedItems(new Set(allItems));

    // Loading/Error states
    if (loading && !currentLesson) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground text-sm">Đang tải nội dung...</p>
                </div>
            </div>
        );
    }

    if (!currentLesson) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <h1 className="text-2xl font-bold">Không tìm thấy bài học</h1>
                <Link href={`/courses/${courseSlug}`}><Button as="div">Quay lại khóa học</Button></Link>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold">Nội dung bị khóa</h1>
                <p className="text-muted-foreground max-w-md">Bạn cần đăng ký khóa học để xem bài học này.</p>
                <Link href={`/courses/${courseSlug}`}><Button as="div">Xem khóa học</Button></Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col-reverse md:flex-row min-h-screen">
            {/* Sidebar */}
            <aside className="w-full md:w-80 border-r-0 border-t md:border-t-0 md:border-r border-border bg-background flex-shrink-0 h-auto md:h-[calc(100vh-56px)] relative md:sticky top-0 md:top-[56px] flex flex-col overflow-visible">
                <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border hidden md:block"></div>

                {/* Course Header */}
                <div className="p-4 border-b bg-background">
                    <Link href={`/courses/${courseSlug}`} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-3 group">
                        <span className="transition-transform group-hover:-translate-x-0.5">←</span> Quay lại khóa học
                    </Link>
                    <h2 className="font-bold text-sm text-foreground line-clamp-2">{course.title}</h2>

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-[11px] mb-1.5">
                            <span className="text-muted-foreground">Tiến độ <span className="font-bold text-foreground">{progress}%</span></span>
                            <span className="text-muted-foreground">{formatDuration(completedSeconds)} / {formatDuration(totalSeconds)}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">{completedCount}/{totalLessonsCount} bài học</p>
                    </div>
                </div>

                {/* Expand/Collapse All - Cleaner Design */}
                {hierarchy.length > 1 && (
                    <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{hierarchy.length} chương</span>
                        <button
                            onClick={collapsedItems.size > 0 ? expandAll : collapseAll}
                            className="text-[11px] text-primary hover:underline flex items-center gap-1"
                        >
                            <ChevronsUpDown className="w-3 h-3" />
                            {collapsedItems.size > 0 ? 'Mở tất cả' : 'Thu gọn'}
                        </button>
                    </div>
                )}

                {/* Content Tree - Clean Hierarchy */}
                <div className="flex-1 overflow-y-auto pb-20">
                    {hierarchy.map((chapter, chapterIdx) => {
                        const chapterKey = `ch:${chapter.chapter}`;
                        const isChapterCollapsed = collapsedItems.has(chapterKey);
                        const chapterLessons = chapter.sections.flatMap(s => s.lessons);
                        const completedInChapter = chapterLessons.filter(l => completedLessons.includes(l.id)).length;
                        const isChapterComplete = completedInChapter === chapterLessons.length && chapterLessons.length > 0;
                        const chapterHasActive = chapterLessons.some(l => l.slug === lessonSlug);

                        return (
                            <div key={chapterKey} className={chapterIdx > 0 ? 'border-t border-border' : ''}>
                                {/* Chapter Header */}
                                <button
                                    onClick={() => toggleItem(chapterKey)}
                                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                                        ${chapterHasActive ? 'bg-muted/50' : 'hover:bg-muted/30'}
                                    `}
                                >
                                    <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${!isChapterCollapsed ? 'rotate-90' : ''}`} />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-foreground truncate">{chapter.chapter}</h3>
                                        <p className="text-[11px] text-muted-foreground">
                                            {isChapterComplete ? (
                                                <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Hoàn thành</span>
                                            ) : (
                                                `${completedInChapter}/${chapterLessons.length} bài`
                                            )}
                                        </p>
                                    </div>
                                </button>

                                {/* Chapter Content */}
                                {!isChapterCollapsed && (
                                    <div className="bg-muted/10">
                                        {chapter.sections.map((section, secIdx) => {
                                            const sectionKey = `sec:${chapter.chapter}:${section.section}`;
                                            const hasSection = !!section.section;
                                            const isSectionCollapsed = hasSection && collapsedItems.has(sectionKey);
                                            const sectionHasActive = section.lessons.some(l => l.slug === lessonSlug);

                                            return (
                                                <div key={sectionKey}>
                                                    {/* Section Header (if has section name) */}
                                                    {hasSection && (
                                                        <button
                                                            onClick={() => toggleItem(sectionKey)}
                                                            className={`w-full pl-8 pr-4 py-2 flex items-center gap-2 text-left transition-colors
                                                                ${sectionHasActive ? 'bg-muted/50' : 'hover:bg-muted/20'}
                                                            `}
                                                        >
                                                            <ChevronRight className={`w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform ${!isSectionCollapsed ? 'rotate-90' : ''}`} />
                                                            <span className="text-[12px] font-medium text-foreground/80 truncate">{section.section}</span>
                                                            <span className="text-[10px] text-muted-foreground ml-auto">{section.lessons.length}</span>
                                                        </button>
                                                    )}

                                                    {/* Lessons */}
                                                    {(!hasSection || !isSectionCollapsed) && (
                                                        <div>
                                                            {section.lessons.map((lesson: any) => {
                                                                const isActive = lesson.slug === lessonSlug;
                                                                const isCompleted = completedLessons.includes(lesson.id);
                                                                const hasVideo = lesson.duration && lesson.duration !== '0:00' && lesson.type !== 'QUIZ';

                                                                return (
                                                                    <Link
                                                                        key={lesson.id}
                                                                        href={`/learn/${courseSlug}/${lesson.slug}`}
                                                                        className={`flex items-start gap-3 py-2.5 pr-4 transition-all group
                                                                            ${hasSection ? 'pl-12' : 'pl-8'}
                                                                            ${isActive ? 'bg-primary/10' : 'hover:bg-muted/30'}
                                                                        `}
                                                                    >
                                                                        {/* Completion indicator */}
                                                                        <div
                                                                            onClick={(e) => handleToggleComplete(lesson.id, e)}
                                                                            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-all
                                                                                ${isCompleted
                                                                                    ? 'bg-green-500 text-white'
                                                                                    : 'border border-muted-foreground/50 hover:border-muted-foreground'}
                                                                            `}
                                                                        >
                                                                            {isCompleted && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                                                        </div>

                                                                        {/* Thumbnail (only for video lessons) */}
                                                                        {hasVideo && (
                                                                            <div className="flex-shrink-0 w-16 h-10 bg-muted rounded overflow-hidden relative">
                                                                                {lesson.thumbnail ? (
                                                                                    <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                                        <Play className="w-4 h-4 text-muted-foreground" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {/* Lesson Info */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className={`block text-[13px] leading-tight line-clamp-2 ${isActive ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                                                                                {lesson.title}
                                                                            </span>
                                                                            {lesson.duration && (
                                                                                <span className="text-[11px] text-muted-foreground">{lesson.duration}</span>
                                                                            )}
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    {currentLesson.videoUrl && (
                        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 w-full aspect-video md:aspect-auto md:h-[50vh] md:max-h-[500px] relative">
                            <VideoPlayer
                                url={currentLesson.videoUrl}
                                type={currentLesson.videoType}
                                title={currentLesson.title}
                                thumbnail={currentLesson.thumbnail}
                                className="w-full h-full"
                            />
                            {user && (user.email || user.name) && (
                                <Watermark text={user.email || user.name} mode="absolute" />
                            )}
                        </div>
                    )}

                    <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-foreground">{currentLesson.title}</h1>
                        <Button
                            onClick={() => handleToggleComplete(currentLesson.id)}
                            variant={completedLessons.includes(currentLesson.id) ? "outline" : "default"}
                            className="gap-2 shrink-0"
                        >
                            {completedLessons.includes(currentLesson.id) ? (
                                <><Check className="w-4 h-4" /> Đã hoàn thành</>
                            ) : (
                                "Đánh dấu hoàn thành"
                            )}
                        </Button>
                    </div>

                    {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                        <div className="bg-muted/10 rounded-xl border p-5 mb-6">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Tài nguyên</h3>
                            <div className="space-y-2">
                                {currentLesson.attachments.map((att: any) => (
                                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background border hover:border-muted-foreground transition-all group">
                                        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className="font-medium text-foreground group-hover:text-primary flex-1">{att.title || att.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                        {prevLesson ? (
                            <Link href={`/learn/${courseSlug}/${prevLesson.slug}`}>
                                <Button as="div" variant="outline" size="sm" className="gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Bài trước
                                </Button>
                            </Link>
                        ) : <div />}
                        {nextLesson ? (
                            <Link href={`/learn/${courseSlug}/${nextLesson.slug}`}>
                                <Button as="div" size="sm" className="gap-2">
                                    Bài tiếp theo
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </Link>
                        ) : (
                            <Link href={`/courses/${courseSlug}`}>
                                <Button as="div" size="sm" className="gap-2">
                                    Hoàn thành khóa học
                                    <Check className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
