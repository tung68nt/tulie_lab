'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { Clock, BookOpen, Sparkles, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/Badge';

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
        // For bundles, we might need a specific checkout logic or just add each course to cart
        // But the backend createOrder expects individual items.
        // For now, let's redirect to checkout with a bundle parameter if supported, 
        // or handle it by adding items to cart.
        // Actually, the current checkout page supports courseId or productId.
        // We might need to update checkout to support bundleId or just use product linking.

        // TEMPORARY: Redirect to shop if no direct bundle purchase logic yet
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
                <div className="absolute inset-0 bg-[radial-gradient(#fab005_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 py-1.5 px-4 text-xs font-bold uppercase tracking-wider">
                            Learning Path / Combo
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
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
                                <p className="text-xs text-zinc-500 mt-1 italic">Tiết kiệm {bundle.discountPercent}% so với mua lẻ</p>
                            </div>
                            <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={handleBuyNow}>
                                Đăng ký Combo ngay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Path Timeline */}
            <div className="container py-20 relative">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Lộ trình học tập chi tiết</h2>
                    <p className="text-muted-foreground">
                        Các khóa học được sắp xếp theo trình tự logic, giúp bạn nắm vững kiến thức từ nền tảng đến chuyên sâu.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Timeline Line */}
                    <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent -translate-x-1/2 md:-translate-x-px" />

                    <div className="space-y-20">
                        {courses.map((course: any, index: number) => (
                            <div key={course.id} className={`relative flex flex-col md:flex-row gap-12 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Step Indicator */}
                                <div className="absolute left-[27px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-background border-4 border-primary z-10 shadow-xl overflow-hidden group">
                                    <span className="text-xl font-bold group-hover:scale-110 transition-transform">{index + 1}</span>
                                </div>

                                {/* Content Side */}
                                <div className="w-full md:w-[calc(50%-40px)] pl-16 md:pl-0">
                                    <div className="group bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={course.thumbnail || '/placeholder-course.jpg'}
                                                alt={course.title}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                                                    <PlayCircle className="w-8 h-8" />
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Phần {index + 1}
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                                                {course.description}
                                            </p>
                                            <Link href={`/courses/${course.slug}`}>
                                                <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-bold gap-2 group/btn">
                                                    Chi tiết khóa học
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Empty Side (Visual Balance) */}
                                <div className="hidden md:block w-[calc(50%-40px)]">
                                    <div className="p-8 opacity-40">
                                        <div className="space-y-4">
                                            <div className="h-4 w-1/4 bg-muted rounded-full" />
                                            <div className="h-8 w-3/4 bg-muted rounded-xl" />
                                            <div className="h-20 w-full bg-muted rounded-2xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-zinc-50 border-y py-20 mt-20">
                <div className="container text-center max-w-2xl">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-6">Bắt đầu hành trình chinh phục ngay hôm nay</h2>
                    <p className="text-muted-foreground mb-10">
                        Đừng để cơ hội học tập trôi qua. Sở hữu trọn bộ {courses.length} khóa học chuyên sâu với mức giá ưu đãi nhất.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <div className="text-left">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Giá ưu đãi Combo</p>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-black text-foreground">{bundle.salePrice?.toLocaleString()}₫</span>
                                <Badge variant="destructive" className="animate-bounce">-{bundle.discountPercent}% OFF</Badge>
                            </div>
                        </div>
                        <Button size="lg" className="px-12 h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20" onClick={handleBuyNow}>
                            GHI DANH NGAY
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
