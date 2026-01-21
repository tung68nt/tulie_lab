'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/Button';
import { VideoPlayer, VideoPlayerEmpty } from '@/components/VideoPlayer';
import { Watermark } from '@/components/system/security/Watermark';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Play, Clock, FileText, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Lock } from 'lucide-react';

// Helper function to parse duration string (e.g., "10:25" or "1:05:30") to seconds
function parseDurationToSeconds(duration: string): number {
    if (!duration) return 0;
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
        // Hours:Minutes:Seconds
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        // Minutes:Seconds
        return parts[0] * 60 + parts[1];
    }
    return 0;
}

// Helper function to format total seconds to display string (Minutes:Seconds or Hours:Minutes:Seconds)
function formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper to format total duration for labels (e.g., "1 giờ 30 phút")
function formatTotalDurationLabel(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

export default function LearnPage({ params }: { params: any }) {
    const [courseSlug, setCourseSlug] = useState<string>('');
    const [lessonSlug, setLessonSlug] = useState<string>('');

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(() => {
        // Initialize from localStorage if available (client-side only)
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('lms-collapsed-chapters');
                if (saved) return new Set(JSON.parse(saved));
            } catch (e) { /* ignore */ }
        }
        return new Set();
    });

    // Persist collapsed chapters to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && collapsedChapters.size >= 0) {
            localStorage.setItem('lms-collapsed-chapters', JSON.stringify([...collapsedChapters]));
        }
    }, [collapsedChapters]);

    // Handle params promise safely
    useEffect(() => {
        if (params instanceof Promise) {
            params.then(p => {
                if (p.courseSlug) setCourseSlug(p.courseSlug);
                if (p.lessonSlug) setLessonSlug(p.lessonSlug);
            });
        } else if (params && typeof params === 'object') {
            if (params.courseSlug) setCourseSlug(params.courseSlug);
            if (params.lessonSlug) setLessonSlug(params.lessonSlug);
        }
    }, [params]);

    useEffect(() => {
        // Fetch course data ONCE when courseSlug changes
        const fetchCourse = async () => {
            if (!courseSlug) return;
            try {
                const courseData: any = await api.courses.get(courseSlug);
                setCourse(courseData);
            } catch (error) {
                console.error('Failed to fetch course:', error);
            }
        };
        fetchCourse();
    }, [courseSlug]); // Only refetch when courseSlug changes

    useEffect(() => {
        // Fetch lesson content when lessonSlug changes (fast, uses cached course)
        const fetchLesson = async () => {
            if (!courseSlug || !lessonSlug || !course) return;
            setLoading(true);
            try {
                const foundLesson = course.lessons?.find((l: any) => l.slug === lessonSlug);

                if (!foundLesson) {
                    setLoading(false);
                    return;
                }

                let access = false;
                if (foundLesson.isFree || course.price === 0) {
                    access = true;
                } else {
                    try {
                        const userData: any = await api.auth.getMe().catch(() => null);
                        if (userData?.user || userData?.id) {
                            setUser(userData.user || userData);
                            const profile: any = await api.users.getProfile().catch(() => null);
                            if (profile && profile.enrollments) {
                                access = profile.enrollments.some((e: any) => e.course?.slug === courseSlug || e.courseId === course.id);
                            }
                        }
                    } catch {
                        access = false;
                    }
                }

                setHasAccess(access);

                if (access) {
                    try {
                        const secureContent = await api.courses.getContent(foundLesson.id);
                        setCurrentLesson(secureContent);

                        // Fetch progress
                        const progressData: any = await api.courses.getProgress(course.id).catch(() => ({}));
                        if (progressData && progressData.completedLessonIds) {
                            setCompletedLessons(progressData.completedLessonIds);
                        }
                    } catch (e) {
                        setCurrentLesson(foundLesson);
                    }
                } else {
                    setCurrentLesson(foundLesson);
                }
            } catch (e) {
                console.warn("Failed to load lesson data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [courseSlug, lessonSlug, course]); // Also depends on course being loaded

    const handleToggleComplete = async (lessonId: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

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

    // Get prev/next lessons
    const sortedLessons = course?.lessons?.sort((a: any, b: any) => a.position - b.position) || [];
    const currentIndex = sortedLessons.findIndex((l: any) => l.slug === lessonSlug);
    const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

    // Calculate progress
    const actualCompletedLessons = sortedLessons.filter((l: any) => completedLessons.includes(l.id));
    const completedCount = actualCompletedLessons.length;
    const totalLessonsCount = sortedLessons.length;
    const progress = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

    // Calculate duration progress
    const totalSeconds = sortedLessons.reduce((acc: number, l: any) => acc + parseDurationToSeconds(l.duration), 0);
    const completedSeconds = actualCompletedLessons.reduce((acc: number, l: any) => acc + parseDurationToSeconds(l.duration), 0);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground text-sm">Đang tải bài học...</p>
                </div>
            </div>
        );
    }

    if (!course || !currentLesson) {
        return (
            <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Không tìm thấy bài học</h1>
                <Link href={`/courses/${courseSlug}`}><Button as="div">Quay lại khóa học</Button></Link>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="fixed inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-6 text-white">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold">Nội dung bị khóa</h1>
                <p className="text-zinc-400 text-center max-w-md">Bạn cần đăng ký khóa học để xem bài học này.</p>
                <Link href={`/courses/${courseSlug}`}>
                    <Button as="div" className="bg-white !text-neutral-950 hover:bg-zinc-200 font-medium">Xem khóa học</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 overflow-visible pt-14">
            {/* Boxed Container - matches navbar container width (1200px) */}
            <div className="mx-auto max-w-[1200px] min-h-screen bg-background border-l border-r border-border relative overflow-visible shadow-sm">
                {/* Extend borders up to navbar using absolute positioned elements */}
                <div className="absolute -top-16 left-[-1px] w-px h-16 bg-border hidden md:block"></div>
                <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border hidden md:block"></div>

                <div className="flex flex-col-reverse md:flex-row min-h-screen">
                    {/* Left Sidebar - Course Navigation */}
                    <aside className="w-full md:w-80 border-r-0 border-t md:border-t-0 md:border-r border-border bg-muted/5 flex-shrink-0 h-auto md:h-[calc(100vh-56px)] relative md:sticky top-0 md:top-[56px] flex flex-col overflow-visible">
                        {/* Extend sidebar border up */}
                        <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border hidden md:block"></div>
                        {/* Course Header with Progress */}
                        <div className="p-4 border-b border-border/50 bg-background">
                            <Link href={`/courses/${courseSlug}`} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-3 group">
                                <span className="transition-transform group-hover:-translate-x-0.5">←</span> Quay lại khóa học
                            </Link>
                            <h2 className="font-bold text-sm text-foreground line-clamp-2">{course.title}</h2>

                            {/* Progress Bar */}
                            <div className="mt-3">
                                <div className="flex justify-between text-[11px] mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Tiến độ</span>
                                        <span className="font-bold text-foreground">{progress}%</span>
                                    </div>
                                    <span className="text-muted-foreground font-medium">
                                        {formatDuration(completedSeconds)} / {formatDuration(totalSeconds)}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-foreground rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-1.5 text-[11px] text-muted-foreground flex justify-between">
                                    <span>{completedCount} / {totalLessonsCount} bài học</span>
                                </div>
                            </div>
                        </div>

                        {/* Expand/Collapse All Controls */}
                        {(() => {
                            const chapters = [...new Set(sortedLessons.map((l: any) => l.chapter).filter(Boolean))];
                            if (chapters.length > 1) {
                                return (
                                    <div className="px-4 py-2 border-b border-border/50 flex gap-2 text-[11px]">
                                        <button
                                            onClick={() => setCollapsedChapters(new Set())}
                                            className="text-primary hover:underline"
                                        >
                                            Mở rộng tất cả
                                        </button>
                                        <span className="text-muted-foreground">|</span>
                                        <button
                                            onClick={() => setCollapsedChapters(new Set(chapters as string[]))}
                                            className="text-primary hover:underline"
                                        >
                                            Thu gọn tất cả
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Lessons List - Grouped by Chapter */}
                        <div className="flex-1 overflow-y-auto pb-20">
                            {(() => {
                                // Group lessons by chapter
                                const groupedLessons: { [key: string]: any[] } = {};
                                sortedLessons.forEach((lesson: any) => {
                                    const chapterKey = lesson.chapter || 'Giới thiệu';
                                    if (!groupedLessons[chapterKey]) groupedLessons[chapterKey] = [];
                                    groupedLessons[chapterKey].push(lesson);
                                });

                                return Object.entries(groupedLessons).map(([chapterName, lessons], chapterIdx) => {
                                    const isCollapsed = collapsedChapters.has(chapterName);
                                    const chapterHasActiveLesson = lessons.some((l: any) => l.slug === lessonSlug);
                                    const completedInChapter = lessons.filter((l: any) => completedLessons.includes(l.id)).length;
                                    const toggleChapter = () => {
                                        setCollapsedChapters(prev => {
                                            const newSet = new Set(prev);
                                            if (newSet.has(chapterName)) newSet.delete(chapterName);
                                            else newSet.add(chapterName);
                                            return newSet;
                                        });
                                    };

                                    return (
                                        <div key={chapterName}>
                                            {/* Chapter Header - Modern Design */}
                                            <div
                                                className={`px-4 py-3 cursor-pointer transition-all flex items-center justify-between border-b border-border/50
                                                    ${chapterHasActiveLesson ? 'bg-muted/50' : 'hover:bg-muted/50'}
                                                `}
                                                onClick={toggleChapter}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                                                        ${completedInChapter === lessons.length ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                                                    `}>
                                                        {completedInChapter === lessons.length ? <Check className="w-3.5 h-3.5" /> : chapterIdx + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-[13px] font-semibold text-foreground truncate">{chapterName}</h3>
                                                        <p className="text-[11px] text-muted-foreground">{completedInChapter}/{lessons.length} bài đã hoàn thành</p>
                                                    </div>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform flex-shrink-0 ${!isCollapsed ? 'rotate-180' : ''}`} />
                                            </div>

                                            {/* Lessons in Chapter - Modern Cards */}
                                            {!isCollapsed && (
                                                <div className="bg-background">
                                                    {lessons.map((lesson: any, idx: number) => {
                                                        const isActive = lesson.slug === lessonSlug;
                                                        const isCompleted = lesson.id && completedLessons.includes(lesson.id);
                                                        const globalIdx = sortedLessons.findIndex((l: any) => l.id === lesson.id);
                                                        const showSection = lesson.section && (idx === 0 || lesson.section !== lessons[idx - 1]?.section);

                                                        // Check if lesson has video content (has duration or videoUrl)
                                                        // If we don't have videoUrl in the list, we rely on duration > 0 or type !== 'TEXT'
                                                        // Assuming duration string usually exists for video lessons
                                                        const hasVideo = lesson.duration && lesson.duration !== '0:00' && lesson.type !== 'QUIZ';

                                                        return (
                                                            <div key={lesson.id}>
                                                                {showSection && (
                                                                    <div className={`py-2 pl-9 bg-muted/30 border-t border-border/50 ${idx === 0 ? 'border-t-0' : ''}`}>
                                                                        <p className="text-[12px] font-medium text-foreground">
                                                                            {lesson.section}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                <Link
                                                                    href={`/learn/${courseSlug}/${lesson.slug}`}
                                                                    className={`flex items-start gap-3 px-4 py-3 transition-all group
                                                                        ${isActive
                                                                            ? 'bg-muted'
                                                                            : 'hover:bg-muted/50'}
                                                                    `}
                                                                >
                                                                    {/* Status Indicator */}
                                                                    <div
                                                                        onClick={(e) => handleToggleComplete(lesson.id, e)}
                                                                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 border cursor-pointer transition-all
                                                                            ${isActive
                                                                                ? isCompleted
                                                                                    ? 'bg-green-600 text-white border-green-600'
                                                                                    : 'border-muted-foreground text-muted-foreground'
                                                                                : isCompleted
                                                                                    ? 'bg-green-500 border-green-500 text-white'
                                                                                    : 'border-input text-muted-foreground hover:border-muted-foreground'}
                                                                        `}
                                                                    >
                                                                        {isCompleted ? (
                                                                            <Check className="w-3 h-3" strokeWidth={3} />
                                                                        ) : (
                                                                            <span className="text-[10px] font-medium">{globalIdx + 1}</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Thumbnail - Only show if has video */}
                                                                    {hasVideo && (
                                                                        <div className="flex-shrink-0 w-24 h-14 bg-muted rounded-md overflow-hidden relative">
                                                                            {lesson.thumbnail ? (
                                                                                <img
                                                                                    src={lesson.thumbnail}
                                                                                    alt=""
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                                                    <Play className="w-5 h-5 text-muted-foreground" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Lesson Info */}
                                                                    <div className="flex-1 min-w-0 pt-0.5">
                                                                        <span className={`block text-[13px] leading-tight line-clamp-2 mb-1 ${isActive ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                                                                            {lesson.title}
                                                                        </span>
                                                                        {lesson.duration && (
                                                                            <span className={`text-[11px] block ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/80'}`}>
                                                                                {lesson.duration}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="max-w-4xl mx-auto p-4 md:p-6">
                            {/* Video Player - Responsive: Aspect Ratio on Mobile, Fixed Height on Desktop */}
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

                            {/* Lesson Title - Below video with spacing */}
                            <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h1 className="text-2xl font-bold text-foreground">{currentLesson.title}</h1>

                                <Button
                                    onClick={() => handleToggleComplete(currentLesson.id)}
                                    variant={completedLessons.includes(currentLesson.id) ? "outline" : "default"}
                                    className="gap-2 shrink-0"
                                >
                                    {completedLessons.includes(currentLesson.id) ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Đã hoàn thành
                                        </>
                                    ) : (
                                        "Đánh dấu hoàn thành"
                                    )}
                                </Button>
                            </div>

                            {/* Resources Section */}
                            {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                                <div className="bg-muted/10 rounded-xl border p-5 mb-6">
                                    <h3 className="text-sm font-semibold text-foreground mb-3">Resources</h3>
                                    <div className="space-y-2">
                                        {currentLesson.attachments.map((att: any) => (
                                            <a
                                                key={att.id}
                                                href={att.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border hover:border-zinc-400 hover:shadow-sm transition-all group"
                                            >
                                                <span className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                                                    {att.type === 'FILE' ? (
                                                        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                    )}
                                                </span>
                                                <span className="font-medium text-zinc-700 group-hover:text-zinc-900 flex-1">{att.title || att.name}</span>
                                                <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
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
                                ) : (
                                    <div></div>
                                )}

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
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </main >
                </div >
            </div >
        </div >
    );
}
