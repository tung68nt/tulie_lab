'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { SectionTag } from '@/components/SectionTag';
import { Button } from '@/components/Button';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ComboLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const [bundle, setBundle] = useState<any>(null);
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

    const courses = bundle.courses?.map((bc: any) => bc.course) || [];

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
                        <div className="flex flex-col">
                            <SectionTag className="mb-8">
                                Combo lộ trình chuyên sâu
                            </SectionTag>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-8 tracking-tight text-foreground">
                                {bundle.name}
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
                                {bundle.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-border/50">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-muted-foreground/60 mb-1 leading-none uppercase tracking-wider">Học phí combo</span>
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
                                    { icon: BookOpen, label: `${courses.length} khóa học chuyên nghiệp` },
                                    { icon: CheckCircle2, label: 'Chứng chỉ hoàn thành' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 text-sm font-bold text-muted-foreground/70">
                                        <item.icon className="w-4 h-4" strokeWidth={2.5} />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Side */}
                        <div className="relative group lg:ml-auto w-full max-w-[500px]">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-[2.5rem] blur-3xl opacity-50"></div>
                            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl skew-y-1 transform transition-all duration-700 hover:skew-y-0">
                                <Image
                                    src={bundle.thumbnail || "/placeholder.jpg"}
                                    alt={bundle.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Detail Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="max-w-4xl">
                        <div className="mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Nội dung lộ trình chi tiết
                            </h2>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Lộ trình bao gồm {courses.length} khóa học được thiết kế bài bản theo thứ tự từ cơ bản đến nâng cao.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {courses.map((course: any, idx: number) => (
                                <div key={course.id || idx} className="group relative flex flex-col md:flex-row gap-8 pb-12 border-b border-zinc-100 last:border-0">
                                    {/* Course Number & Info */}
                                    <div className="md:w-1/3 flex flex-col pt-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 bg-white">
                                                {idx + 1}
                                            </span>
                                            {/* Minimalist Tag instead of uppercase */}
                                            <span className="text-[10px] font-bold py-0.5 px-2 bg-zinc-100 text-zinc-600 rounded-md">
                                                Phần {idx + 1}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-zinc-900 mb-4 group-hover:text-zinc-950 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                                            {course.description}
                                        </p>
                                    </div>

                                    {/* Lessons List - The Detail Content Area */}
                                    <div className="md:w-2/3">
                                        <div className="bg-background border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
                                            <h4 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                Chi tiết bài học
                                            </h4>
                                            <div className="grid sm:grid-cols-1 gap-y-3">
                                                {course.lessons?.map((lesson: any, lidx: number) => (
                                                    <div
                                                        key={lesson.id || lidx}
                                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group/item"
                                                    >
                                                        <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-foreground group-hover/item:text-background transition-colors">
                                                            <span className="text-[10px] font-bold">{lidx + 1}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-muted-foreground group-hover/item:text-foreground transition-colors">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="py-24 relative overflow-hidden bg-foreground text-background">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <DotPatternBackground className="text-background" />
                </div>
                <div className="container relative z-10 mx-auto px-6 text-center max-w-[1200px]">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                            Tham gia lộ trình ngay hôm nay
                        </h2>
                        <p className="text-background/70 mb-10 text-lg font-medium">
                            Sở hữu trọn bộ {courses.length} khóa học với ưu đãi tốt nhất. Bắt đầu hành trình chinh phục mục tiêu của bạn.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => router.push(`/checkout?bundleId=${bundle.id}`)}
                            className="px-12 h-14 bg-background text-foreground hover:bg-background/90 rounded-2xl font-bold transition-all shadow-2xl shadow-background/5"
                        >
                            Đăng ký combo ngay
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
