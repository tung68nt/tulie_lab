'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { Clock, BookOpen, Sparkles, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

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

    const handleBuyNow = () => {
        if (!bundle) return;
        router.push(`/checkout?bundleId=${bundle.id}`);
    };

    if (loading) return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );

    if (!bundle) return <div className="container py-20 text-center text-xl">Không tìm thấy combo</div>;

    const courses = bundle.courses?.map((bc: any) => bc.course) || [];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative bg-zinc-950 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden text-white">
                <DotPatternBackground className="opacity-[0.03]" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="container relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 py-1.5 px-4 text-xs font-bold tracking-wider">
                            Learning Path / Combo
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                            {bundle.name}
                        </h1>
                        <p className="text-lg text-zinc-400 leading-relaxed whitespace-pre-line border-l-2 border-primary/50 pl-6">
                            {bundle.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-500 pt-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="text-zinc-300">{courses.length} Khóa học chuyên sâu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-zinc-300">Truy cập trọn đời</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span className="text-zinc-300">Chứng chỉ hoàn thành</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
                            <div className="flex flex-col items-center sm:items-start mr-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-bold text-white">
                                        {bundle.salePrice?.toLocaleString()}₫
                                    </span>
                                    <span className="text-lg text-zinc-500 line-through">
                                        {bundle.originalPrice?.toLocaleString()}₫
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">Tiết kiệm {bundle.discountPercent}% so với mua lẻ</p>
                            </div>
                            <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={handleBuyNow}>
                                Đăng ký Combo ngay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Path Timeline */}
            <div className="container py-24 relative overflow-hidden">
                <DotPatternBackground className="opacity-[0.03] pointer-events-none" />
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                    {/* Sticky Header Side */}
                    <div className="w-full md:w-1/3 md:sticky md:top-32 h-fit">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Lộ trình học tập Chuyên sâu</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Các khóa học được sắp xếp theo trình tự logic, giúp bạn nắm vững kiến thức từ nền tảng đến chuyên sâu theo lộ trình bài bản.
                            </p>
                        </div>
                    </div>

                    {/* Timeline Side */}
                    <div className="flex-1 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

                        <div className="space-y-12">
                            {courses.map((course: any, index: number) => (
                                <div key={course.id} className="relative pl-20 group">
                                    {/* Number Indicator */}
                                    <div className="absolute left-0 top-0 flex items-center justify-center w-14 h-14 rounded-full bg-background border-2 border-zinc-200 dark:border-zinc-800 z-10 transition-colors group-hover:border-primary">
                                        <span className="text-xl font-bold">{index + 1}</span>
                                    </div>

                                    <div className="bg-card border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="w-full lg:w-2/5 aspect-video lg:aspect-auto relative overflow-hidden bg-zinc-100 dark:bg-zinc-900/50">
                                                <img
                                                    src={course.thumbnail || '/placeholder-course.jpg'}
                                                    alt={course.title}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    Phần {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 p-6 md:p-8">
                                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                                    {course.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-zinc-400">
                                                        {course.lessons?.length || 0} Bài học
                                                    </span>
                                                    <Link href={`/courses/${course.slug}`}>
                                                        <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2">
                                                            Học ngay
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA - Premium Redesign */}
            <div className="bg-[#050505] border-t border-zinc-900 py-24 md:py-32 overflow-hidden relative">
                {/* Enhanced Dot Pattern */}
                <DotPatternBackground className="opacity-10" withVignette={false} />

                {/* Faded 4 Corners Effect (Radial overlay of background color) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent opacity-100 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#050505] via-transparent to-transparent opacity-100 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-transparent to-transparent opacity-100 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#050505] via-transparent to-transparent opacity-100 pointer-events-none" />

                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                            {/* Decorative ambient light */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />

                            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] mb-6 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        Ưu đãi có hạn
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                                        Bắt đầu hành trình của bạn ngay hôm nay
                                    </h2>
                                    <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                                        Sở hữu trọn bộ {courses.length} khóa học chuyên sâu với lộ trình được thiết kế tối ưu, giúp bạn đạt mục tiêu nhanh hơn.
                                    </p>
                                </div>

                                <div className="w-full lg:w-fit shrink-0 bg-black/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Học phí trọn gói</p>
                                            <div className="flex items-end gap-3">
                                                <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                                                    {bundle.salePrice?.toLocaleString()}₫
                                                </span>
                                                <Badge variant="destructive" className="mb-2 bg-red-600 hover:bg-red-600 block sm:inline">
                                                    -{bundle.discountPercent}% OFF
                                                </Badge>
                                            </div>
                                            <p className="text-zinc-600 text-sm line-through">
                                                {bundle.originalPrice?.toLocaleString()}₫
                                            </p>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full px-12 h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                            onClick={handleBuyNow}
                                        >
                                            GHI DANH NGAY
                                            <ChevronRight className="ml-2 w-5 h-5" />
                                        </Button>

                                        <div className="flex items-center justify-center gap-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest pt-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                                                </div>
                                                Truy cập trọn đời
                                            </div>
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                                                </div>
                                                Hỗ trợ 24/7
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
