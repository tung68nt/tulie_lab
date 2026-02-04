'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Watermark } from '@/components/system/security/Watermark';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Check, Play, ChevronDown, ChevronRight, ChevronsUpDown, Paperclip, Lightbulb } from 'lucide-react';
import { MentoringSidebar } from './MentoringSidebar';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TableOfContents } from '@/components/TableOfContents';
import { BackToTop } from '@/components/BackToTop';

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
    // Initialize lesson from server data immediately (no loading spinner)
    const sortedLessons = course?.lessons?.sort((a: any, b: any) => a.position - b.position) || [];
    const initialLesson = sortedLessons.find((l: any) => l.slug === lessonSlug) || null;

    const [currentLesson, setCurrentLesson] = useState<any>(initialLesson);
    const [hasAccess, setHasAccess] = useState(initialLesson?.isFree || course?.price === 0 || false);
    const [user, setUser] = useState<any>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [loadingSecure, setLoadingSecure] = useState(true);
    const [sidebarTab, setSidebarTab] = useState<'content' | 'mentoring'>('content');

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

    // Parallel fetch: auth, progress, secure content (runs in background)
    useEffect(() => {
        const fetchSecureData = async () => {
            if (!course || !lessonSlug) return;

            const foundLesson = sortedLessons.find((l: any) => l.slug === lessonSlug);
            if (!foundLesson) return;

            // Update current lesson reference if slug changed
            if (currentLesson?.slug !== lessonSlug) {
                setCurrentLesson(foundLesson);
            }

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
            } finally {
                setLoadingSecure(false);
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

    // Navigation - use sortedLessons defined at top
    const currentIndex = sortedLessons.findIndex((l: any) => l.slug === lessonSlug);
    const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
    const nextLesson = (currentIndex >= 0 && currentIndex < sortedLessons.length - 1) ? sortedLessons[currentIndex + 1] : null;
    const isLastLesson = currentIndex === sortedLessons.length - 1;
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

    // No more loading spinner - content shows immediately
    // Only show "not found" if lesson truly doesn't exist
    if (!currentLesson) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <h1 className="text-2xl font-bold">Không tìm thấy bài học</h1>
                <Link href={`/courses/${courseSlug}`}><Button as="div">Quay lại khóa học</Button></Link>
            </div>
        );
    }

    // Only show "locked" AFTER auth check completes, not during loading
    // This prevents flash of "locked" state while checking access
    if (!loadingSecure && !hasAccess) {
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

                {/* Course Header & Tabs */}
                <div className="border-b bg-background">
                    {/* Back Link */}
                    <div className="px-4 pt-4 pb-2">
                        <Link href={`/courses/${courseSlug}`} className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-2 group">
                            <span className="transition-transform group-hover:-translate-x-0.5">←</span> Quay lại
                        </Link>
                        <h2 className="font-bold text-sm text-foreground line-clamp-1">{course.title}</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-4 gap-4 mt-2">
                        <button
                            onClick={() => setSidebarTab('content')}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${sidebarTab === 'content' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        >
                            Bài học
                        </button>
                        <button
                            onClick={() => setSidebarTab('mentoring')}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${sidebarTab === 'mentoring' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        >
                            Mentoring 1:1
                        </button>
                    </div>
                </div>

                {sidebarTab === 'mentoring' ? (
                    <div className="flex-1 overflow-y-auto pb-20">
                        <MentoringSidebar userId={user?.id} />
                    </div>
                ) : (
                    <>
                        {/* Progress Bar */}
                        <div className="px-4 py-3 border-b bg-muted/10">
                            <div className="flex justify-between text-[11px] mb-1.5">
                                <span className="text-muted-foreground">Tiến độ <span className="font-bold text-foreground">{progress}%</span></span>
                                <span className="text-muted-foreground">{formatDuration(completedSeconds)} / {formatDuration(totalSeconds)}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        {/* Expand/Collapse All */}
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

                        {/* Content Tree */}
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
                                        <button
                                            onClick={() => toggleItem(chapterKey)}
                                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                                                ${chapterHasActive ? 'bg-muted/50' : 'hover:bg-muted/30'}
                                            `}
                                        >
                                            <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${!isChapterCollapsed ? 'rotate-90' : ''}`} />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-foreground truncate">{chapter.chapter}</h3>
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
                                                                    className={`w-full pl-6 pr-3 py-2 flex items-center gap-2 text-left transition-colors
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
                                                                                className={`flex items-start gap-3 py-2.5 pr-2 transition-all group
                                                                                    ${hasSection ? 'pl-8' : 'pl-4'}
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
                                                                                    <span className={`block text-[13px] leading-tight line-clamp-2 font-medium ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
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
                    </>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="max-w-5xl mx-auto p-4 md:p-6">
                    {currentLesson.videoUrl && (
                        <div className="w-full relative">
                            <VideoPlayer
                                url={currentLesson.videoUrl}
                                type={currentLesson.videoType}
                                title={currentLesson.title}
                                thumbnail={currentLesson.thumbnail}
                                className="w-full"
                            />
                            {user && (user.email || user.name) && (
                                <Watermark text={user.email || user.name} mode="absolute" />
                            )}
                        </div>
                    )}

                    {/* Lesson Guide (Prompts/Instructions) - Modern Redesign */}
                    {currentLesson.guide && (
                        <div className="mt-6 animate-in slide-in-from-top-4 duration-500">
                            <details className="group rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.03] to-transparent overflow-hidden transition-all shadow-sm">
                                <summary className="flex items-center justify-between py-2.5 px-4 cursor-pointer hover:bg-primary/[0.06] transition-colors list-none">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                                            <Lightbulb className="w-5 h-5 fill-primary/20" />
                                        </div>
                                        <div className="flex flex-col min-w-0 justify-center">
                                            <h3 className="text-sm font-bold text-primary/90 leading-tight">Hướng dẫn & Lưu ý học tập</h3>
                                            <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5 focus:outline-none">Mở rộng để xem thông tin bài học</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-semibold text-primary/60 group-open:hidden">Xem chi tiết</span>
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/5 text-primary/50 transition-transform group-open:rotate-90">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </summary>
                                <div className="p-4 pt-1 border-t border-primary/5 bg-card/30 backdrop-blur-[2px]">
                                    <MarkdownRenderer content={currentLesson.guide} />
                                </div>
                            </details>
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
                            <h3 className="text-sm font-semibold text-foreground mb-3 font-mono tracking-wider">Tài nguyên bài học</h3>
                            <div className="space-y-2">
                                {currentLesson.attachments.map((att: any) => (
                                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background border hover:border-muted-foreground transition-all group">
                                        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <span className="font-medium text-foreground group-hover:text-primary flex-1">{att.title || att.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documentation Content */}
                    {currentLesson.content && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-t pt-8 mt-4">
                            <div className="lg:col-span-9">
                                <MarkdownRenderer content={currentLesson.content} />
                            </div>

                            <div className="lg:col-span-3">
                                <aside className="sticky top-[100px]">
                                    {/* Mobile TOC (Accordion style) */}
                                    <div className="lg:hidden mb-6">
                                        <details className="group rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
                                            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors list-none">
                                                <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-primary/80">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                    </svg>
                                                    Mục lục bài học
                                                </div>
                                                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                                            </summary>
                                            <div className="p-6 border-t border-border/30 bg-card">
                                                <TableOfContents content={currentLesson.content} />
                                            </div>
                                        </details>
                                    </div>

                                    {/* Desktop TOC */}
                                    <div className="hidden lg:block p-3 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                                        <TableOfContents content={currentLesson.content} />
                                    </div>

                                </aside>
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
                        {!isLastLesson && nextLesson ? (
                            <Link href={`/learn/${courseSlug}/${nextLesson.slug}`}>
                                <Button as="div" size="sm" className="gap-2">
                                    Bài tiếp theo
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </Link>
                        ) : isLastLesson ? (
                            <Link href={`/courses/${courseSlug}`}>
                                <Button as="div" size="sm" className="gap-2">
                                    Hoàn thành khóa học
                                    <Check className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </main>
            <BackToTop />
        </div>
    );
}
