'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { Clock, ChevronDown, ChevronUp, Lock, Check, PlayCircle, CheckCircle2 } from 'lucide-react';
import { sendGTMEvent } from '@/lib/gtm';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CourseChapter } from '@/features/lms/components/CourseChapter';
import { DotPatternBackground } from '@/components/DotPatternBackground';
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

    useEffect(() => {
        if (params instanceof Promise) {
            params.then((p: any) => setSlug(p.slug));
        } else if (params && typeof params === 'object' && params.slug) {
            setSlug(params.slug);
        }
    }, [params]);

    const [discountEndDate, setDiscountEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (course?.discountEndDate) {
            setDiscountEndDate(new Date(course.discountEndDate));
        }
    }, [course]);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [courseData, userProfile, addOns]: [any, any, any] = await Promise.all([
                    api.courses.get(slug),
                    api.users.getProfile().catch(() => null),
                    api.pricingAddOns.list().catch(() => [])
                ]);

                setCourse(courseData);
                setPricingAddOns(Array.isArray(addOns) ? addOns : []);

                sendGTMEvent('view_item', {
                    currency: 'VND',
                    value: courseData.price,
                    items: [{
                        item_id: courseData.id,
                        item_name: courseData.title,
                        price: courseData.price
                    }]
                });

                if (userProfile) {
                    setIsLoggedIn(true);
                    if (userProfile.enrollments) {
                        setIsEnrolled(userProfile.enrollments.some((e: any) => e.course?.slug === slug));
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (e) {
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
            if (course.price === 0 && activationType !== 'CODE') {
                await api.payments.checkout({ courseId: course.id, options: { activationType } });
                addToast('Đăng ký thành công!', 'success');
                router.push('/dashboard');
                return;
            }

            const addOnParam = selectedAddOnId ? `&addOnId=${selectedAddOnId}` : '';
            router.push(`/checkout?courseId=${course.id}&activationType=${activationType}${addOnParam}`);
        } catch (e: any) {
            addToast(e.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.', 'error');
            setIsPurchasing(false);
        }
    };

    if (loading) return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-primary " />
        </div>
    );

    if (!course) return <div className="container py-20 text-center text-xl">Không tìm thấy khóa học</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="bg-[#050505] pt-24 md:pt-28 pb-16 text-white md:pb-24 relative overflow-hidden">
                <DotPatternBackground className="opacity-[0.25] dark:opacity-[0.4] text-zinc-500 dark:text-zinc-400" withVignette={false} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="container relative z-10">
                    <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:gap-20">
                        <div className="space-y-6">
                            <SectionTag variant="black-pill" className="mb-4">
                                {course.deploymentStatus === 'COMING_SOON' ? 'Sắp ra mắt'
                                    : course.deploymentStatus === 'UPDATING' ? 'Đang nâng cấp'
                                        : 'Chính thức'}
                            </SectionTag>
                            <div className="md:max-w-[90%]">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                    {course.title}
                                </h1>
                                <MarkdownRenderer
                                    content={course.description || ''}
                                    className="prose-invert text-zinc-300 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-zinc-50 prose-headings:text-zinc-50 text-[14px] md:text-base leading-relaxed"
                                />
                            </div>
                            <div className="space-y-4 pt-4">
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
                                            <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-semibold shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)] backdrop-blur-md">
                                                <div className="flex items-center gap-2.5 border-r border-white/10 pr-4">
                                                    <PlayCircle className="w-4 h-4 text-white" />
                                                    <span className="text-zinc-50">{course.infoLessons || `${course.lessons?.length || 0} Bài học`}</span>
                                                </div>
                                                {totalSeconds > 0 && (
                                                    <div className="flex items-center gap-2.5 pl-1">
                                                        <Clock className="w-4 h-4 text-white" />
                                                        <span className="text-zinc-50">{formatTotalDuration(totalSeconds)}</span>
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

                        <div className="relative md:mt-10 lg:mt-0">
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                                <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-800 mb-6 relative group cursor-pointer">
                                    {course.introVideoUrl ? (
                                        <iframe src={course.introVideoUrl} className="w-full h-full" allowFullScreen title="Introduction Video" />
                                    ) : course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
                                            <p className="text-zinc-400 text-sm">Chưa có video preview</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {(!course.deploymentStatus || course.deploymentStatus === 'RELEASED') && course.price > 0 && !isEnrolled && discountEndDate && (
                                        <div className="mb-6">
                                            <CountdownTimer targetDate={discountEndDate} title="Ưu đãi giới hạn kết thúc sau:" />
                                        </div>
                                    )}

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-zinc-400 mb-1">Học phí</p>
                                            <div className="flex items-baseline gap-2">
                                                <div className="text-2xl font-bold text-white">
                                                    {(() => {
                                                        const basePrice = Number(course.price) || 0;
                                                        const addOnPrice = selectedAddOnId
                                                            ? Number(pricingAddOns.find(a => a.id === selectedAddOnId)?.priceAddon || 0)
                                                            : 0;
                                                        const total = basePrice + addOnPrice;
                                                        return total === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
                                                    })()}
                                                </div>
                                                {course.compareAtPrice && Number(course.compareAtPrice) > Number(course.price) && (
                                                    <div className="text-sm text-zinc-500 line-through">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(course.compareAtPrice))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {pricingAddOns.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs text-zinc-400">Chọn gói học:</p>
                                            <div className="space-y-2">
                                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${!selectedAddOnId ? 'bg-white/10 border-white/30' : 'border-zinc-800 hover:border-zinc-700'}`}>
                                                    <input type="radio" name="addOn" checked={!selectedAddOnId} onChange={() => setSelectedAddOnId(null)} className="sr-only" />
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!selectedAddOnId ? 'border-primary bg-primary' : 'border-zinc-700'}`}>
                                                        {!selectedAddOnId && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                    <span className={`text-sm ${!selectedAddOnId ? 'text-white font-medium' : 'text-zinc-500'}`}>Chỉ E-learning</span>
                                                </label>
                                                {pricingAddOns.map((addOn) => (
                                                    <label key={addOn.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAddOnId === addOn.id ? 'bg-white/10 border-white/30' : 'border-zinc-800 hover:border-zinc-700'}`}>
                                                        <input type="radio" name="addOn" checked={selectedAddOnId === addOn.id} onChange={() => setSelectedAddOnId(addOn.id)} className="sr-only" />
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${selectedAddOnId === addOn.id ? 'border-primary bg-primary' : 'border-zinc-700'}`}>
                                                            {selectedAddOnId === addOn.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className={`text-sm ${selectedAddOnId === addOn.id ? 'text-white font-medium' : 'text-zinc-500'}`}>{addOn.name}</span>
                                                        </div>
                                                        <span className="text-sm text-zinc-400">+{new Intl.NumberFormat('vi-VN').format(Number(addOn.priceAddon))}đ</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {!isEnrolled ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <button onClick={() => setActivationType('EMAIL')} className={`text-xs px-3 py-2 rounded-lg border transition-all ${activationType === 'EMAIL' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-400 border-zinc-700'}`}>Kích hoạt ngay</button>
                                                <button onClick={() => setActivationType('CODE')} className={`text-xs px-3 py-2 rounded-lg border transition-all ${activationType === 'CODE' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-400 border-zinc-700'}`}>Mua mã kích hoạt</button>
                                            </div>
                                            <Button size="lg" disabled={isPurchasing} className="w-full font-bold mt-4" variant="white" onClick={handleBuyNow}>
                                                {isPurchasing ? 'Đang xử lý...' : (course.price === 0 ? 'Đăng ký miễn phí' : 'Thanh toán ngay')}
                                            </Button>
                                        </>
                                    ) : (
                                        <Link href={`/learn/${course.slug}/${course.lessons?.[0]?.slug || ''}`}>
                                            <Button as="div" size="lg" className="w-full font-bold mt-4" variant="white">Vào học ngay</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-6 mt-6 md:mt-12 relative">
                {/* mobile outcomes - outside grid to avoid affecting desktop alignment */}
                <section className="md:hidden mb-8">
                    <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">Bạn sẽ học được gì</h2>
                    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-card dark:bg-zinc-900/50 p-5 shadow-sm">
                        {(() => {
                            const outcomes = course.learningOutcomes;
                            const isRichText = outcomes && (outcomes.includes('<') || outcomes.includes('*') || outcomes.includes('[') || (outcomes.startsWith('[') && outcomes.endsWith(']')));

                            if (isRichText) {
                                return <MarkdownRenderer content={outcomes} />;
                            }

                            const outcomesList = Array.isArray(outcomes) ? outcomes : (outcomes || '').split('\n').filter((l: string) => l.trim());
                            return outcomesList.length > 0 ? (
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {outcomesList.map((line: string, i: number) => (
                                        <li key={i} className="flex gap-3 items-start text-sm text-zinc-900 dark:text-zinc-100">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                                                <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                                            </div>
                                            <span>{line.replace(/^- /, '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-zinc-500 italic">Nội dung đang cập nhật...</p>
                            );
                        })()}
                    </div>
                </section>

                <div className="grid gap-8 md:gap-12 md:grid-cols-3 items-start">
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Nội dung khóa học</h2>
                            <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-card dark:bg-zinc-900/50 overflow-hidden divide-y divide-zinc-100 dark:divide-white/5 shadow-sm">
                                {course.lessons && course.lessons.length > 0 ? (
                                    <>
                                        {(() => {
                                            const hasStructure = course.structure && Array.isArray(course.structure) && course.structure.length > 0;
                                            const hasChapters = course.lessons.some((l: any) => l && l.chapter);

                                            if (!hasStructure && !hasChapters) {
                                                return (
                                                    <div className="divide-y divide-zinc-100 dark:divide-white/5">
                                                        {course.lessons.map((lesson: any, index: number) => {
                                                            const isExpanded = expandedLessonId === lesson.id;
                                                            return (
                                                                <div key={lesson.id} className="group flex flex-col transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
                                                                    <div className="flex items-start p-4 gap-3 cursor-pointer" onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
                                                                                <div className="flex-1">
                                                                                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{lesson.title}</h4>
                                                                                    {lesson.duration && <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{lesson.duration}</p>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="shrink-0 flex items-center gap-3">
                                                                            {lesson.isFree ? (
                                                                                <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                                                                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors">Học thử miễn phí</span>
                                                                                </Link>
                                                                            ) : !isEnrolled ? (
                                                                                <Lock size={14} className="text-zinc-400" />
                                                                            ) : (
                                                                                <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                                                                                    <Button size="sm" className="h-7 text-[10px] px-3">Vào học</Button>
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }

                                            const lessonsByChapter = (course.lessons || []).reduce((acc: any, lesson: any) => {
                                                const chapter = lesson.chapter || 'Chưa phân loại';
                                                if (!acc[chapter]) acc[chapter] = [];
                                                acc[chapter].push(lesson);
                                                return acc;
                                            }, {});

                                            return Object.entries(lessonsByChapter).map(([chapterName, chapterLessons]: [string, any], index: number) => (
                                                <CourseChapter
                                                    key={chapterName}
                                                    chapterName={chapterName}
                                                    chapterLessons={chapterLessons}
                                                    chapterIndex={index}
                                                    courseSlug={course.slug}
                                                    isEnrolled={isEnrolled}
                                                />
                                            ));
                                        })()}
                                    </>
                                ) : (
                                    <div className="p-8 text-center text-zinc-500">Nội dung đang được cập nhật.</div>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Giảng viên</h2>
                            <Link
                                href={course.instructor?.slug ? `/instructors/${course.instructor.slug}` : '/instructors'}
                                className="block rounded-xl border border-zinc-200 dark:border-white/5 bg-card dark:bg-zinc-900/50 overflow-hidden hover:border-primary/20 transition-colors shadow-sm"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="shrink-0">
                                            {course.instructor?.avatar ? (
                                                <img src={course.instructor.avatar} alt={course.instructor.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-white/5" />
                                            ) : (
                                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">{(course.instructor?.name || 'T').charAt(0)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{course.instructor?.name || 'Tulie Academy Team'}</h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{course.instructor?.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </section>
                    </div>

                    <div className="hidden md:block">
                        <div className="sticky top-24">
                            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Bạn sẽ học được gì</h2>
                            <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-card dark:bg-zinc-900/50 p-6 shadow-sm">
                                {(() => {
                                    const outcomes = course.learningOutcomes;
                                    const isRichText = outcomes && (outcomes.includes('<') || outcomes.includes('*') || outcomes.includes('[') || (outcomes.startsWith('[') && outcomes.endsWith(']')));

                                    if (isRichText) {
                                        return <MarkdownRenderer content={outcomes} />;
                                    }

                                    const outcomesList = Array.isArray(outcomes) ? outcomes : (outcomes || '').split('\n').filter((l: string) => l.trim());
                                    return outcomesList.length > 0 ? (
                                        <ul className="space-y-4">
                                            {outcomesList.map((line: string, i: number) => (
                                                <li key={i} className="flex gap-3 items-start text-sm text-zinc-900 dark:text-zinc-100">
                                                    <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                                                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                                                    </div>
                                                    <span>{line.replace(/^- /, '')}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-zinc-500 italic">Nội dung đang cập nhật...</p>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {course && <QuickEdit editUrl={`/admin/courses/${course.id}`} />}
        </div>
    );
}
