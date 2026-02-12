'use client';

import { useEffect, useState, use } from 'react';
import { api, getMediaUrl } from '@/lib/api';
import { Bundle, Course, Lesson } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { SectionTag } from '@/components/SectionTag';
import { Button } from '@/components/Button';
import { DotPatternBackground } from '@/components/DotPatternBackground';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ComboLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const [bundle, setBundle] = useState<Bundle | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [data, userProfile] = await Promise.all([
                    api.bundles.get(slug),
                    api.users.getProfile().catch(() => null)
                ]);
                setBundle(data);
                setIsLoggedIn(!!userProfile);
            } catch (e) {
                console.error(e);
                addToast('Không tìm thấy thông tin combo', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );

    if (!bundle) return <div className="container py-20 text-center text-xl">Không tìm thấy combo</div>;

    const courses = bundle.courses?.map((bc) => bc.course) || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const salePrice = bundle.salePrice || bundle.price || 0;
    const originalPrice = bundle.price || bundle.originalPrice || 0;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Minimalist Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-border/50">
                <DotPatternBackground className="text-muted-foreground/15" />

                <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col items-start text-left">
                            <SectionTag
                                className="mb-8 w-fit shrink-0 overflow-hidden"
                                variant="black-pill"
                                animate={false}
                                bold={false}
                                size="lg"
                            >
                                Combo lộ trình
                            </SectionTag>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-8 tracking-tight text-foreground">
                                {bundle.name}
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
                                {bundle.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-border/50">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-muted-foreground/60 mb-1 leading-none">Học phí combo</span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-foreground leading-none">
                                            {formatCurrency(salePrice)}
                                        </span>
                                        {originalPrice > salePrice && (
                                            <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/30">
                                                {formatCurrency(originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={() => router.push(`/checkout?bundleId=${bundle.id}`)}
                                    className="w-full sm:w-auto px-10 h-14 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-bold transition-all shadow-xl shadow-foreground/5"
                                >
                                    Đăng ký combo ngay
                                </Button>
                            </div>

                            {/* Trust indicators - B&W, Minimalist */}
                            <div className="flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-border/10">
                                {[
                                    { icon: Clock, label: 'Truy cập trọn đời' },
                                    { icon: BookOpen, label: `${courses.length} khóa học chuyên nghiệp` }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground/70">
                                        <item.icon className="w-4 h-4" strokeWidth={2.5} />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Side */}
                        <div className="relative group lg:ml-auto w-full max-w-[440px]">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-[2.5rem] blur-3xl opacity-50"></div>
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl transition-all duration-700">
                                <img
                                    src={getMediaUrl(bundle.thumbnail || "") || "/hero_vibe_coding.png"}
                                    alt={bundle.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Detail Section */}
            <section className="py-24 relative overflow-hidden bg-muted/20">
                <DotPatternBackground className="text-muted-foreground/10" />

                <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
                    <div className="mb-20 text-center max-w-2xl mx-auto">
                        <SectionTag className="mb-6 mx-auto">Nội dung chi tiết</SectionTag>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Lộ trình học tập toàn diện
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            Lộ trình này được liên kết từ {courses.length} khóa học chuyên sâu, thiết kế bài bản để giúp bạn làm chủ kỹ năng từ cơ bản đến thực chiến nhất.
                        </p>
                    </div>

                    <div className="space-y-10">
                        {courses.map((course: Course, idx: number) => (
                            <div key={course.id || idx} className="group relative bg-background border border-border/50 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="flex flex-col lg:flex-row gap-10 md:gap-12">
                                    {/* Left: Course Info & Thumbnail */}
                                    <div className="lg:w-2/5 flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-bold py-1 px-3 bg-muted text-muted-foreground rounded-full">
                                                Phần {idx + 1}
                                            </span>
                                        </div>

                                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border border-border/50 group-hover:border-primary/20 transition-colors">
                                            <img
                                                src={getMediaUrl(course.thumbnail || "") || "/hero_vibe_coding.png"}
                                                alt={course.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>

                                        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                                            {course.description}
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-border/50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-muted-foreground mb-1">Giá gốc khoá học</span>
                                                <span className="text-lg font-bold text-foreground">{formatCurrency(course.price || 0)}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="rounded-full gap-2 font-bold group/btn" onClick={() => router.push(`/courses/${course.slug}`)}>
                                                Xem chi tiết <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right: Lessons List */}
                                    <div className="lg:w-3/5">
                                        <div className="h-full bg-muted/30 rounded-[2rem] p-8 md:p-10 border border-border/30">
                                            <h4 className="text-sm font-bold text-foreground mb-8 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border/50">
                                                    <BookOpen className="w-4 h-4 text-primary" />
                                                </div>
                                                Nội dung bài học
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                {course.lessons?.map((lesson: Lesson, lidx: number) => (
                                                    <div
                                                        key={lesson.id || lidx}
                                                        className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-transparent hover:border-primary/20 hover:bg-background transition-all group/item"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                                                            <span className="text-[10px] font-bold">{lidx + 1}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-muted-foreground group-hover/item:text-foreground transition-colors line-clamp-1">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                ))}
                                                {(!course.lessons || course.lessons.length === 0) && (
                                                    <p className="text-sm text-muted-foreground col-span-2">Đang cập nhật bài học...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="py-24 relative overflow-hidden bg-[#050505] text-white">
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <DotPatternBackground className="text-white" />
                </div>
                <div className="container relative z-10 mx-auto px-6 text-center max-w-[1240px]">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">
                            Tham gia lộ trình ngay hôm nay
                        </h2>
                        <p className="text-zinc-400 mb-10 text-lg font-medium">
                            Sở hữu trọn bộ {courses.length} khóa học với ưu đãi tốt nhất. Bắt đầu hành trình chinh phục mục tiêu của bạn.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => router.push(`/checkout?bundleId=${bundle.id}`)}
                            className="px-12 h-14 bg-white !text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all shadow-2xl shadow-white/5"
                        >
                            Đăng ký combo ngay
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
