'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { Clock } from 'lucide-react';

// Helper function to parse duration string to seconds
function parseDurationToSeconds(duration: string): number {
    if (!duration) return 0;
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
}

// Helper function to format total seconds
function formatTotalDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
}

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseData = await api.courses.get(slug);
                setCourse(courseData);

                try {
                    const user = await api.users.getProfile() as any;
                    setIsLoggedIn(true);
                    if (user && user.enrollments) {
                        setIsEnrolled(user.enrollments.some((e: any) => e.course.slug === slug));
                    }
                } catch {
                    setIsLoggedIn(false);
                }
            } catch (e) {
                // Low-level fallback for development or offline
                setCourse({
                    id: 'mock-1',
                    title: 'Fullstack Next.js 14 (Demo)',
                    slug: slug,
                    description: 'Nội dung demo (không kết nối được server).',
                    price: 1200000,
                    lessons: [
                        { id: 'l1', title: 'Giới thiệu về Next.js', slug: 'intro', isFree: true },
                        { id: 'l2', title: 'Cài đặt dự án', slug: 'setup', isFree: false },
                        { id: 'l3', title: 'Routing và Layouts', slug: 'routing', isFree: false },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const [isPurchasing, setIsPurchasing] = useState(false);

    const handleBuyNow = async () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        if (!course) return;

        setIsPurchasing(true);
        try {
            // If course is free, enroll via checkout (backend handles auto-completion)
            if (course.price === 0) {
                await api.payments.checkout({ courseId: course.id });
                addToast('Đăng ký thành công!', 'success');
                router.push('/dashboard'); // or /my-learning
                return;
            }

            // Redirect to checkout page
            router.push(`/checkout?courseId=${course.id}`);
        } catch (e: any) {
            if (process.env.NODE_ENV !== 'production') {
                console.error("Enrollment/Checkout failed:", e);
            }
            addToast(e.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.', 'error');
            setIsPurchasing(false);
        }
    };

    if (loading) return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );

    if (!course) return <div className="container py-20 text-center text-xl">Không tìm thấy khóa học</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="bg-zinc-950 py-16 text-white md:py-24">
                <div className="container">
                    <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-400">
                                Workshop Chính thức
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                {course.title}
                            </h1>
                            <p className="text-lg text-zinc-400 md:text-xl leading-relaxed max-w-[600px] whitespace-pre-line">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-300">Giảng viên Chuyên nghiệp</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-300">Truy cập trọn đời</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-300">{course.lessons?.length || 0} Bài học</span>
                                </div>
                                {(() => {
                                    const totalSeconds = (course.lessons || []).reduce((acc: number, lesson: any) =>
                                        acc + parseDurationToSeconds(lesson.duration), 0);
                                    return totalSeconds > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-zinc-400" />
                                            <span className="text-zinc-300">{formatTotalDuration(totalSeconds)}</span>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>

                        {/* Preview / Enrollment Card */}
                        <div className="relative md:mt-10 lg:mt-0">
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                                {/* Thumbnail / Preview */}
                                <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-800 mb-6 relative group cursor-pointer">
                                    {course.introVideoUrl ? (
                                        <iframe
                                            src={course.introVideoUrl}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title="Introduction Video"
                                        />
                                    ) : course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
                                            <div className="text-center">
                                                <span className="text-5xl">🎬</span>
                                                <p className="text-zinc-400 text-sm mt-2">Chưa có video preview</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-sm text-zinc-400">Học phí</p>
                                            <div className="text-3xl font-bold text-white">
                                                {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {course.price > 0 && <span className="line-through text-zinc-600 text-sm">{(course.price * 1.5).toLocaleString()} ₫</span>}
                                        </div>
                                    </div>

                                    {!isEnrolled ? (
                                        <Button
                                            size="lg"
                                            disabled={isPurchasing}
                                            className="w-full font-bold text-lg shadow-xl mt-4 border-0 relative"
                                            style={{ backgroundColor: 'white', color: 'black' }}
                                            onClick={handleBuyNow}
                                        >
                                            {isPurchasing ? (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                                </div>
                                            ) : (
                                                course.price === 0 ? 'Đăng ký miễn phí' : 'Đăng ký ngay'
                                            )}
                                        </Button>
                                    ) : (
                                        <Link href={`/learn/${course.slug}/${course.lessons?.[0]?.slug || ''}`}>
                                            <Button
                                                size="lg"
                                                className="w-full font-bold text-lg shadow-xl mt-4 border-0"
                                                style={{ backgroundColor: 'white', color: 'black' }}
                                            >
                                                Vào học ngay
                                            </Button>
                                        </Link>
                                    )}
                                    <p className="text-center text-xs text-zinc-500 mt-3">Hoàn tiền trong 30 ngày nếu không hài lòng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-16 mt-12 bg-background md:mt-20">
                <div className="grid gap-12 md:grid-cols-3">
                    <div className="md:col-span-2">
                        {/* Course Curriculum */}
                        <section className="mb-12">
                            <h2 className="mb-6 text-2xl font-bold">Nội dung khóa học</h2>
                            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                {course.lessons && course.lessons.length > 0 ? (
                                    <div className="divide-y">
                                        {course.lessons.map((lesson: any, index: number) => {
                                            const isLocked = !isEnrolled && !lesson.isFree;
                                            const isExpanded = expandedLessonId === lesson.id;

                                            const showChapter = lesson.chapter && (index === 0 || lesson.chapter !== course.lessons[index - 1].chapter);
                                            const showSection = lesson.section && (index === 0 || lesson.section !== course.lessons[index - 1].section || (lesson.chapter && lesson.chapter !== course.lessons[index - 1].chapter));

                                            return (
                                                <div key={lesson.id} className="group flex flex-col transition-colors border-b last:border-0">
                                                    {showChapter && (
                                                        <div className="bg-zinc-50 px-4 py-3 border-b">
                                                            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-900 flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded bg-black"></span>
                                                                {lesson.chapter}
                                                            </h3>
                                                        </div>
                                                    )}
                                                    {showSection && (
                                                        <div className="bg-zinc-50/50 px-4 py-2 border-b">
                                                            <p className="text-xs font-semibold text-zinc-500 italic">
                                                                {lesson.section}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="hover:bg-muted/50 transition-colors">
                                                        <div
                                                            className="flex items-center justify-between p-4 cursor-pointer"
                                                            onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className={`font-medium ${isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'}`}>
                                                                            {lesson.title}
                                                                        </h3>
                                                                        {lesson.isFree && !isEnrolled && (
                                                                            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                                                                                Free
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">{lesson.duration || ''} {lesson.duration ? '•' : ''} {isExpanded ? 'Thu gọn' : 'Chi tiết'}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {isLocked ? (
                                                                    <Button variant="ghost" size="sm" disabled>
                                                                        🔒
                                                                    </Button>
                                                                ) : (
                                                                    <Link href={`/learn/${course.slug}/${lesson.slug}`} onClick={(e) => e.stopPropagation()}>
                                                                        <Button variant="ghost" size="sm" className="text-primary">
                                                                            Vào học
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                                <span className="text-muted-foreground text-xs transform transition-transform duration-200">
                                                                    {isExpanded ? '▲' : '▼'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Expandable Content in Grid Transition */}
                                                        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                            <div className="overflow-hidden">
                                                                <div className="px-16 pb-4 text-sm text-muted-foreground">
                                                                    <div className="p-4 bg-muted/30 rounded-lg">
                                                                        <p className="mb-2 font-medium text-foreground">Trong bài học này, bạn sẽ:</p>
                                                                        <ul className="list-disc pl-4 space-y-1">
                                                                            <li>Hiểu rõ về các khái niệm cốt lõi.</li>
                                                                            <li>Thực hành thông qua các ví dụ thực tế.</li>
                                                                            <li>Nắm vững kiến thức để áp dụng vào dự án.</li>
                                                                        </ul>
                                                                        {/* Fallback mock description if not present in API */}
                                                                        <p className="mt-3 italic opacity-80">{lesson.description || "Nội dung chi tiết cho bài học này đang được cập nhật. Giảng viên sẽ cung cấp các tài liệu và video hướng dẫn cụ thể."}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        Nội dung đang được cập nhật.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Instructor Section */}
                        <section>
                            <h2 className="mb-6 text-2xl font-bold">Giảng viên</h2>
                            <div className="flex items-start gap-4 rounded-xl border p-6">
                                {course.instructor?.avatar ? (
                                    <img
                                        src={course.instructor.avatar}
                                        alt={course.instructor.name}
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                                        {(course.instructor?.name || 'A').charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg">{course.instructor?.name || 'Academy Tulie Team'}</h3>
                                    <p className="text-sm text-zinc-500 mb-2">{course.instructor?.title || 'Đội ngũ giảng viên chuyên nghiệp'}</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {course.instructor?.bio || 'Chúng tôi là đội ngũ đam mê công nghệ, cam kết mang lại nền tảng học tập tốt nhất cho bạn.'}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Sticky (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 space-y-6">
                            <div>
                                <h3 className="mb-6 text-2xl font-bold">Bạn sẽ học được gì</h3>
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    {course.learningOutcomes ? (
                                        <ul className="space-y-3 text-sm text-muted-foreground">
                                            {course.learningOutcomes.split('\n').map((line: string, i: number) => line.trim() && (
                                                <li key={i} className="flex gap-2">✓ {line.replace(/^- /, '')}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Nội dung đang cập nhật...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
