'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { SectionTag } from '@/components/SectionTag';
import { Button } from '@/components/Button';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

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
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
            {/* Minimalist Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-zinc-100">
                <DotPatternBackground className="text-zinc-200/50" />

                <div className="container relative z-10 mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <SectionTag className="mb-8 border-zinc-200 bg-white shadow-none">
                            Combo lộ trình chuyên sâu
                        </SectionTag>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.15] mb-8 tracking-tight text-zinc-950">
                            {bundle.name}
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed mb-12 max-w-2xl">
                            {bundle.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-zinc-100">
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-zinc-400 mb-1 leading-none">Học phí combo</span>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-semibold text-zinc-950 leading-none">
                                        {formatCurrency(salePrice)}
                                    </span>
                                    {originalPrice > salePrice && (
                                        <span className="text-sm text-zinc-400 line-through decoration-zinc-300">
                                            {formatCurrency(originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Button
                                size="lg"
                                onClick={() => router.push(`/checkout?bundleId=${bundle.id}`)}
                                className="w-full sm:w-auto px-10 h-14 bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl font-medium transition-all shadow-none"
                            >
                                Đăng ký combo ngay
                            </Button>
                        </div>

                        {/* Trust indicators - B&W, Minimalist */}
                        <div className="flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-zinc-50">
                            {[
                                { icon: Clock, label: 'Truy cập trọn đời' },
                                { icon: BookOpen, label: `${courses.length} khóa học chuyên nghiệp` },
                                { icon: CheckCircle2, label: 'Chứng chỉ hoàn thành' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-zinc-400">
                                    <item.icon className="w-4 h-4 text-zinc-400" strokeWidth={2} />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Detail Section */}
            <section className="py-24 bg-zinc-50/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-16">
                            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-950 mb-4">
                                Nội dung lộ trình chi tiết
                            </h2>
                            <p className="text-zinc-500 leading-relaxed">
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
                                        <div className="bg-white border border-zinc-100 rounded-3xl p-6 md:p-8">
                                            <h4 className="text-sm font-semibold text-zinc-950 mb-6 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-zinc-400" />
                                                Chi tiết bài học
                                            </h4>
                                            <div className="grid sm:grid-cols-1 gap-y-3">
                                                {course.lessons?.map((lesson: any, lidx: number) => (
                                                    <div
                                                        key={lesson.id || lidx}
                                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100 group/item"
                                                    >
                                                        <div className="w-5 h-5 rounded-md bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-zinc-950 group-hover/item:text-white transition-colors">
                                                            <span className="text-[10px] font-bold">{lidx + 1}</span>
                                                        </div>
                                                        <span className="text-sm font-medium text-zinc-600 group-hover/item:text-zinc-900 transition-colors">
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
            <section className="py-24 relative overflow-hidden bg-zinc-950 text-white">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <DotPatternBackground className="text-white/20" />
                </div>
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                            Tham gia lộ trình ngay hôm nay
                        </h2>
                        <p className="text-zinc-400 mb-10 text-lg">
                            Sở hữu trọn bộ {courses.length} khóa học với ưu đãi tốt nhất. Bắt đầu hành trình chinh phục mục tiêu của bạn.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => router.push(`/checkout?bundleId=${bundle.id}`)}
                            className="px-12 h-14 bg-white text-zinc-950 hover:bg-zinc-100 rounded-2xl font-semibold transition-all shadow-2xl shadow-white/5"
                        >
                            Đăng ký combo ngay
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
