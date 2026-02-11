'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { Clock, ChevronDown, ChevronUp, Lock, Check, PlayCircle, Sparkles, CheckCircle2, Users, BarChart } from 'lucide-react';
import { sendGTMEvent } from '@/lib/gtm';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CourseChapter } from '@/features/lms/components/CourseChapter';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { Badge } from '@/components/Badge';
import { SectionTag } from '@/components/SectionTag';
import { QuickEdit } from '@/components/admin/QuickEdit';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

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
    const [pricingAddOns, setPricingAddOns] = useState<any[]>([]);
    const [selectedAddOnId, setSelectedAddOnId] = useState<string | null>(null);

    // Handle params promise safely
    useEffect(() => {
        if (params instanceof Promise) {
            params.then((p: any) => setSlug(p.slug));
        } else if (params && typeof params === 'object' && params.slug) {
            setSlug(params.slug);
        }
    }, [params]);

    // Discount End Date logic
    // Currently, backend does not support discountEndDate, so we default to null to avoid showing a fake timer.
    // If we want to show a timer, we should add discountEndDate to the Course model and API.
    const [discountEndDate, setDiscountEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (course?.discountEndDate) {
            setDiscountEndDate(new Date(course.discountEndDate));
        }
    }, [course]);

    useEffect(() => {
        // Guard: Don't fetch if slug is empty
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch course, user profile, and pricing add-ons in PARALLEL
                const [courseData, userProfile, addOns]: [any, any, any] = await Promise.all([
                    api.courses.get(slug),
                    api.users.getProfile().catch(() => null), // Don't fail if not logged in
                    api.pricingAddOns.list().catch(() => []) // Don't fail if no add-ons
                ]);

                setCourse(courseData);
                setPricingAddOns(Array.isArray(addOns) ? addOns : []);

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

            // Redirect to checkout page with addOnId if selected
            const addOnParam = selectedAddOnId ? `&addOnId=${selectedAddOnId}` : '';
            router.push(`/checkout?courseId=${course.id}&activationType=${activationType}${addOnParam}`);
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
            <div className="bg-[#050505] pt-24 md:pt-28 pb-16 text-white md:pb-24 relative overflow-hidden">
                {/* Background pattern */}
                <DotPatternBackground className="opacity-[0.25] dark:opacity-[0.4] text-zinc-500 dark:text-zinc-400" withVignette={false} />

                {/* Corner Glows / Fades */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

                {/* 4 Corner Shadow Overlays for 'Faded' look */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="container relative z-10">
                    <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:gap-20">
                        <div className="space-y-6">
                            <SectionTag variant="black-pill" className="mb-4">
                                {course.deploymentStatus === 'COMING_SOON' ? 'Sắp ra mắt'
                                    : course.deploymentStatus === 'UPDATING' ? 'Đang nâng cấp'
                                        : 'Chính thức'}
                            </SectionTag>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                {course.title}
                            </h1>
                            <MarkdownRenderer
                                content={course.description || ''}
                                className="prose-invert text-zinc-300 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-zinc-50 prose-headings:text-zinc-50"
                            />
                            <div className="space-y-4 pt-4">
                                {/* Key Benefits Row */}
                                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-zinc-200">{course.infoInstructor || "Giảng viên Chuyên nghiệp"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-zinc-200">{course.infoDuration || "Truy cập trọn đời"}</span>
                                    </div>
                                </div>

                                {/* Stats Pill Row */}
                                {(() => {
                                    try {
                                        const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
                                        const totalSeconds = lessons
                                            .filter((l: any) => l && l.duration)
                                            .reduce((acc: number, lesson: any) => {
                                                const d = parseDurationToSeconds(lesson.duration);
                                                return acc + (isNaN(d) ? 0 : d);
                                            }, 0);

                                        return (
                                            <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-primary/10 dark:bg-primary/5 border border-primary/20 text-xs font-semibold shadow-[0_0_15px_-3px_rgba(var(--primary),0.1)] backdrop-blur-sm">
                                                <div className="flex items-center gap-2.5 border-r border-zinc-200 dark:border-white/10 pr-4">
                                                    <PlayCircle className="w-4 h-4 text-primary" />
                                                    <span className="text-zinc-900 dark:text-zinc-50">{course.infoLessons || `${course.lessons?.length || 0} Bài học`}</span>
                                                </div>
                                                {totalSeconds > 0 && (
                                                    <div className="flex items-center gap-2.5 pl-1">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span className="text-zinc-900 dark:text-zinc-50">{formatTotalDuration(totalSeconds)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
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
                                                {(() => {
                                                    const basePrice = Number(course.price) || 0;
                                                    const addOnPrice = selectedAddOnId
                                                        ? Number(pricingAddOns.find(a => a.id === selectedAddOnId)?.priceAddon || 0)
                                                        : 0;
                                                    const total = basePrice + addOnPrice;
                                                    return total === 0
                                                        ? 'Miễn phí'
                                                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
                                                })()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {course.compareAtPrice != null && Number(course.compareAtPrice) > Number(course.price || 0) && (
                                                <span className="line-through text-zinc-600 text-xs">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(course.compareAtPrice))}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pricing Add-ons Selection */}
                                    {pricingAddOns.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs text-zinc-400">Chọn gói học:</p>
                                            <div className="space-y-2">
                                                {/* Base option - no add-on */}
                                                <label
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${!selectedAddOnId
                                                        ? 'bg-white/10 border-white/30'
                                                        : 'border-zinc-800 hover:border-zinc-700'
                                                        }`}
                                                >
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="addOn"
                                                            checked={!selectedAddOnId}
                                                            onChange={() => setSelectedAddOnId(null)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${!selectedAddOnId
                                                            ? 'border-white bg-white'
                                                            : 'border-zinc-700 bg-transparent'}`}
                                                        >
                                                            {!selectedAddOnId && <div className="w-2 h-2 rounded-full bg-black" />}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className={`text-sm transition-colors ${!selectedAddOnId ? 'text-white font-medium' : 'text-zinc-500'}`}>Chỉ E-learning</span>
                                                    </div>
                                                    <span className="text-sm text-zinc-400">+0đ</span>
                                                </label>

                                                {/* Add-on options */}
                                                {pricingAddOns.map((addOn) => (
                                                    <label
                                                        key={addOn.id}
                                                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAddOnId === addOn.id
                                                            ? 'bg-white/10 border-white/30'
                                                            : 'border-zinc-800 hover:border-zinc-700'
                                                            }`}
                                                    >
                                                        <div className="relative flex items-center justify-center mt-0.5">
                                                            <input
                                                                type="radio"
                                                                name="addOn"
                                                                checked={selectedAddOnId === addOn.id}
                                                                onChange={() => setSelectedAddOnId(addOn.id)}
                                                                className="sr-only"
                                                            />
                                                            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${selectedAddOnId === addOn.id
                                                                ? 'border-white bg-white'
                                                                : 'border-zinc-700 bg-transparent'}`}
                                                            >
                                                                {selectedAddOnId === addOn.id && <div className="w-2 h-2 rounded-full bg-black" />}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className={`text-sm transition-colors ${selectedAddOnId === addOn.id ? 'text-white font-medium' : 'text-zinc-500'}`}>{addOn.name}</span>
                                                            {addOn.features?.length > 0 && (
                                                                <ul className="mt-1 space-y-0.5">
                                                                    {addOn.features.slice(0, 2).map((f: string, i: number) => (
                                                                        <li key={i} className="text-xs text-zinc-500">• {f}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-zinc-400 shrink-0">
                                                            {Number(addOn.priceAddon) > 0
                                                                ? `+${new Intl.NumberFormat('vi-VN').format(Number(addOn.priceAddon))}đ`
                                                                : 'Miễn phí'}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
                                                                ? 'bg-white text-black border-white font-semibold'
                                                                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500'
                                                                }`}
                                                        >
                                                            Kích hoạt ngay (Email)
                                                        </button>
                                                        <button
                                                            onClick={() => setActivationType('CODE')}
                                                            className={`text-xs px-3 py-2 rounded-lg border transition-all ${activationType === 'CODE'
                                                                ? 'bg-white text-black border-white font-semibold'
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
                                                    className="w-full font-semibold text-sm shadow-xl border-0 relative h-10"
                                                    variant="white"
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
                                            {course.deploymentStatus === 'COMING_SOON' && course.releaseDate ? (
                                                <div className="mb-4">
                                                    <p className="text-xs text-zinc-500 mb-2">Dự kiến phát hành vào:</p>
                                                    <div className="text-primary font-bold text-lg bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-3">
                                                        <Clock className="w-5 h-5" />
                                                        {new Intl.DateTimeFormat('vi-VN', {
                                                            weekday: 'long',
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }).format(new Date(course.releaseDate))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-zinc-400 mb-4">
                                                    Để lại thông tin để nhận thông báo ưu đãi khi khóa học ra mắt.
                                                </p>
                                            )}
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
            <div className="container py-6 mt-8 bg-background md:mt-12 relative">
                <DotPatternBackground className="opacity-[0.08] dark:opacity-[0.1]" withVignette={false} />
                <div className="grid gap-8 md:gap-12 md:grid-cols-3 relative z-10">
                    <div className="md:col-span-2">
                        {/* Course Curriculum */}
                        <section className="mb-12">
                            <h2 className="mb-6 text-2xl font-bold">Nội dung khóa học</h2>
                            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                {course.lessons && course.lessons.length > 0 ? (
                                    <div className="">
                                        {/* Check if course has structure defined */}
                                        {(() => {
                                            const hasStructure = course.structure && Array.isArray(course.structure) && course.structure.length > 0;
                                            const hasChapters = course.lessons.some((l: any) => l && l.chapter);

                                            // If no structure and no chapters, show flat list
                                            if (!hasStructure && !hasChapters) {
                                                return (
                                                    <div className="divide-y">
                                                        {course.lessons.map((lesson: any, index: number) => {
                                                            if (!lesson) return null;
                                                            const isExpanded = expandedLessonId === lesson.id;
                                                            return (
                                                                <div key={lesson.id || index} className="group flex flex-col transition-colors border-t border-border/50 first:border-t-0 hover:bg-muted/10">
                                                                    <div
                                                                        className="flex items-start p-4 gap-3 cursor-pointer"
                                                                        onClick={() => setExpandedLessonId(isExpanded ? null : (lesson.id || String(index)))}
                                                                    >
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                                                                    {index + 1}
                                                                                </span>
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{lesson.title}</h4>
                                                                                        <span className="text-zinc-400">
                                                                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                                        </span>
                                                                                    </div>
                                                                                    {lesson.duration && (
                                                                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                                                                                            {lesson.duration}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="shrink-0 flex items-center gap-3" onClick={e => e.stopPropagation()}>
                                                                            {lesson.isFree ? (
                                                                                <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                                                                                    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[13px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap shadow-[0_0_10px_-2px_rgba(16,185,129,0.1)]">
                                                                                        Học thử miễn phí
                                                                                    </span>
                                                                                </Link>
                                                                            ) : !isEnrolled ? (
                                                                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 bg-muted dark:bg-white/5 px-2 py-1 rounded border border-border dark:border-white/10 font-bold">
                                                                                    <Lock size={12} className="opacity-60" /> Khóa
                                                                                </span>
                                                                            ) : (
                                                                                <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                                                                                    <Button as="div" size="sm" className="h-8 text-xs">Vào học</Button>
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {/* Expandable Description */}
                                                                    {isExpanded && lesson.description && (
                                                                        <div className="px-4 pb-4 pt-0 pl-14">
                                                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                                                                                {lesson.description}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }

                                            // Show grouped by chapters
                                            return Object.entries((course.lessons || []).filter((l: any) => l).reduce((acc: any, lesson: any) => {
                                                const chapter = lesson.chapter || 'Chưa phân loại';
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
                                            ));
                                        })()}
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
                            <h2 className="mb-8 text-2xl font-bold">Giảng viên</h2>
                            <Link
                                href={course.instructor?.slug ? `/instructors/${course.instructor.slug}` : '/instructors'}
                                className="block rounded-xl border bg-card overflow-hidden hover:border-foreground/20 transition-colors"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="shrink-0">
                                            {course.instructor?.avatar ? (
                                                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-border">
                                                    <img
                                                        src={course.instructor.avatar}
                                                        alt={course.instructor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold ring-2 ring-border">
                                                    {(course.instructor?.name || 'T').charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Title only */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base">{course.instructor?.name || 'Tulie Academy Team'}</h3>
                                            <p className="text-sm text-muted-foreground">{course.instructor?.title || ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </section>
                    </div>

                    {/* Sidebar / Sticky (Desktop) */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 space-y-6">
                            <div>
                                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Bạn sẽ học được gì</h2>
                                <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-card dark:bg-zinc-900/50 backdrop-blur-sm p-6 shadow-sm">
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

                                        const filteredOutcomes = outcomes.filter(line => line && line.trim() && line.toLowerCase() !== 'null');

                                        return filteredOutcomes.length > 0 ? (
                                            <ul className="space-y-4">
                                                {filteredOutcomes.map((line: string, i: number) => (
                                                    <li key={i} className="flex gap-3 items-start text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                                                        <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                                                            <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                                                        </div>
                                                        <span className="leading-relaxed">{line.replace(/^- /, '')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic opacity-50">Nội dung đang cập nhật...</p>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Quick Edit for Admins */}
            {course && <QuickEdit editUrl={`/admin/courses/${course.id}`} />}
        </div>
    );
}
