'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { Clock } from 'lucide-react';
import { sendGTMEvent } from '@/lib/gtm';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CourseChapter } from '@/components/lms/CourseChapter';

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

export default function CoursePage({ params }: { params: any }) {
    // Safely handle params which might be a Promise (Next.js 15+) or a plain object
    const [slug, setSlug] = useState<string>('');
    const router = useRouter();
    const { addToast } = useToast();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
    const [activationType, setActivationType] = useState<'EMAIL' | 'CODE'>('EMAIL');

    // Handle params promise safely
    useEffect(() => {
        if (params instanceof Promise) {
            params.then(p => setSlug(p.slug));
        } else if (params && typeof params === 'object' && params.slug) {
            setSlug(params.slug);
        }
    }, [params]);

    // Mock discount end date (e.g., 24 hours from now) for demo purposes
    // In a real app, this should come from the backend course data (course.discountEndDate)
    // Mock discount end date (e.g., 24 hours from now) for demo purposes
    // In a real app, this should come from the backend course data (course.discountEndDate)
    const [discountEndDate, setDiscountEndDate] = useState<Date | null>(null);

    useEffect(() => {
        setDiscountEndDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch course and user profile in PARALLEL for faster loading
                const [courseData, userProfile]: [any, any] = await Promise.all([
                    api.courses.get(slug),
                    api.users.getProfile().catch(() => null) // Don't fail if not logged in
                ]);

                setCourse(courseData);

                // Track ViewContent event
                sendGTMEvent('view_item', {
                    currency: 'VND',
                    value: courseData.price,
                    items: [{
                        item_id: courseData.id,
                        item_name: courseData.title,
                        price: courseData.price
                    }]
                });

                // Check enrollment from parallel-fetched profile
                if (userProfile) {
                    setIsLoggedIn(true);
                    if (userProfile.enrollments) {
                        setIsEnrolled(userProfile.enrollments.some((e: any) => e.course?.slug === slug));
                    }
                } else {
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
    const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [regLoading, setRegLoading] = useState(false);

    const handleRegisterInterest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regForm.email || !regForm.name) {
            addToast('Vui lòng nhập tên và email', 'error');
            return;
        }
        setRegLoading(true);
        try {
            await api.post(`/courses/${course.id}/register-interest`, regForm);
            addToast('Đăng ký nhận thông tin thành công! Chúng tôi sẽ liên hệ sớm.', 'success');
            setRegForm({ name: '', email: '', phone: '', message: '' });
        } catch (error: any) {
            addToast(error.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setRegLoading(false);
        }
    };

    const handleBuyNow = async () => {
        if (!course) return;

        // Track InitiateCheckout
        sendGTMEvent('begin_checkout', {
            currency: 'VND',
            value: course.price,
            items: [{
                item_id: course.id,
                item_name: course.title,
                price: course.price
            }]
        });

        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        setIsPurchasing(true);
        try {
            // If course is free, enroll via checkout (backend handles auto-completion)
            // But if buying CODE for free course (unlikely but possible logic), force checkout flow or handle differently.
            // Assuming free courses are always direct enrollment for now unless specified.
            if (course.price === 0 && activationType !== 'CODE') {
                await api.payments.checkout({ courseId: course.id, options: { activationType } });
                addToast('Đăng ký thành công!', 'success');
                router.push('/dashboard'); // or /my-learning
                return;
            }

            // Redirect to checkout page
            router.push(`/checkout?courseId=${course.id}&activationType=${activationType}`);
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
            <div className="bg-zinc-950 pt-32 pb-16 text-white md:pt-40 md:pb-24">
                <div className="container">
                    <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-400">
                                <span className={`mr-2 h-2 w-2 rounded-full ${course.deploymentStatus === 'COMING_SOON' ? 'bg-yellow-500'
                                    : course.deploymentStatus === 'UPDATING' ? 'bg-blue-500'
                                        : 'bg-emerald-500'
                                    }`}></span>
                                {course.deploymentStatus === 'COMING_SOON' ? 'Workshop Sắp ra mắt'
                                    : course.deploymentStatus === 'UPDATING' ? 'Workshop Đang nâng cấp'
                                        : 'Workshop Chính thức'}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                {course.title}
                            </h1>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-[600px] whitespace-pre-line">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-zinc-500">
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
                                    try {
                                        const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
                                        const totalSeconds = lessons
                                            .filter((l: any) => l && l.duration)
                                            .reduce((acc: number, lesson: any) => {
                                                const d = parseDurationToSeconds(lesson.duration);
                                                return acc + (isNaN(d) ? 0 : d);
                                            }, 0);
                                        return totalSeconds > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-zinc-400" />
                                                <span className="text-zinc-300">{formatTotalDuration(totalSeconds)}</span>
                                            </div>
                                        ) : null;
                                    } catch (e) {
                                        return null;
                                    }
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
                                    {/* Countdown Timer */}
                                    {(!course.deploymentStatus || course.deploymentStatus === 'RELEASED') && course.price > 0 && !isEnrolled && discountEndDate && (
                                        <div className="mb-6">
                                            <CountdownTimer targetDate={discountEndDate} title="Ưu đãi giới hạn kết thúc sau:" />
                                        </div>
                                    )}

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-zinc-400 mb-1">Học phí</p>
                                            <div className="text-2xl font-bold text-white">
                                                {(course.price == null || Number(course.price) === 0) ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(course.price))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {course.price != null && Number(course.price) > 0 && <span className="line-through text-zinc-600 text-xs">{(Number(course.price) * 1.5).toLocaleString()} ₫</span>}
                                        </div>
                                    </div>

                                    {(!course.deploymentStatus || course.deploymentStatus === 'RELEASED') ? (
                                        !isEnrolled ? (
                                            <>
                                                {/* Activation Type Selection */}
                                                <div className="mt-4 mb-4 space-y-2">
                                                    <p className="text-xs text-zinc-400 font-medium">Hình thức kích hoạt:</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => setActivationType('EMAIL')}
                                                            className={`text-xs px-3 py-2 rounded-lg border transition-all ${activationType === 'EMAIL'
                                                                ? 'bg-white text-black border-white font-bold'
                                                                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                                                }`}
                                                        >
                                                            Kích hoạt ngay (Email)
                                                        </button>
                                                        <button
                                                            onClick={() => setActivationType('CODE')}
                                                            className={`text-xs px-3 py-2 rounded-lg border transition-all ${activationType === 'CODE'
                                                                ? 'bg-white text-black border-white font-bold'
                                                                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                                                }`}
                                                        >
                                                            Mua mã kích hoạt
                                                        </button>
                                                    </div>
                                                    {activationType === 'CODE' && (
                                                        <p className="text-xs text-zinc-500 mt-1">
                                                            Bạn sẽ nhận được mã kích hoạt qua email để tặng hoặc kích hoạt sau.
                                                        </p>
                                                    )}
                                                </div>

                                                <Button
                                                    size="lg"
                                                    disabled={isPurchasing}
                                                    className="w-full font-bold text-sm shadow-xl border-0 relative h-10"
                                                    style={{ backgroundColor: 'white', color: 'black' }}
                                                    onClick={handleBuyNow}
                                                >
                                                    {isPurchasing ? (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                                        </div>
                                                    ) : (
                                                        course.price === 0 ? 'Đăng ký miễn phí' : (activationType === 'CODE' ? 'Mua mã ngay' : 'Đăng ký ngay')
                                                    )}
                                                </Button>
                                            </>
                                        ) : (
                                            <Link href={`/learn/${course.slug}/${course.lessons?.[0]?.slug || ''}`}>
                                                <Button
                                                    as="div"
                                                    size="lg"
                                                    className="w-full font-bold text-sm shadow-xl mt-4 border-0 h-10"
                                                    style={{ backgroundColor: 'white', color: 'black' }}
                                                >
                                                    Vào học ngay
                                                </Button>
                                            </Link>
                                        )
                                    ) : (
                                        <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                                            <h3 className="text-white font-bold mb-2">
                                                {course.deploymentStatus === 'COMING_SOON' ? 'Sắp ra mắt' : 'Đang cập nhật'}
                                            </h3>
                                            <p className="text-sm text-zinc-400 mb-4">
                                                Để lại thông tin để nhận thông báo ưu đãi khi khóa học ra mắt.
                                            </p>
                                            <form onSubmit={handleRegisterInterest} className="space-y-3">
                                                <Input
                                                    placeholder="Họ và tên"
                                                    value={regForm.name}
                                                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                                                    required
                                                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                                                />
                                                <Input
                                                    type="email"
                                                    placeholder="Email nhận thông tin"
                                                    value={regForm.email}
                                                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                                                    required
                                                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                                                />
                                                <Input
                                                    placeholder="Số điện thoại (Tùy chọn)"
                                                    value={regForm.phone}
                                                    onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                                                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={regLoading}
                                                    className="w-full font-bold"
                                                    variant="default"
                                                >
                                                    {regLoading ? 'Đang gửi...' : 'Nhận thông tin'}
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                    {(!course.deploymentStatus || course.deploymentStatus === 'RELEASED') && (
                                        <p className="text-center text-xs text-zinc-500 mt-3">Hoàn tiền trong 30 ngày nếu không hài lòng</p>
                                    )}
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
                                    <div className="">
                                        {/* Group lessons by chapter */}
                                        {Object.entries((course.lessons || []).filter((l: any) => l).reduce((acc: any, lesson: any) => {
                                            const chapter = lesson.chapter || 'Chương 1: Mở đầu'; // Default chapter if missing
                                            if (!acc[chapter]) acc[chapter] = [];
                                            acc[chapter].push(lesson);
                                            return acc;
                                        }, {})).map(([chapterName, chapterLessons]: [string, any], chapterIndex: number) => (
                                            <CourseChapter
                                                key={chapterName}
                                                chapterName={chapterName}
                                                chapterLessons={chapterLessons}
                                                chapterIndex={chapterIndex}
                                                courseSlug={course.slug}
                                                isEnrolled={isEnrolled}
                                            />
                                        ))}
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
                                    {(() => {
                                        let outcomes: string[] = [];
                                        try {
                                            if (typeof course.learningOutcomes === 'string') {
                                                outcomes = course.learningOutcomes.split('\n');
                                            } else if (Array.isArray(course.learningOutcomes)) {
                                                outcomes = course.learningOutcomes.map(String);
                                            }
                                        } catch (e) {
                                            console.error('Error parsing learning outcomes', e);
                                        }

                                        return outcomes.length > 0 ? (
                                            <ul className="space-y-3 text-sm text-muted-foreground">
                                                {outcomes.map((line: string, i: number) => line.trim() && (
                                                    <li key={i} className="flex gap-2">✓ {line.replace(/^- /, '')}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Nội dung đang cập nhật...</p>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
