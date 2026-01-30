import { SectionTag } from '@/components/SectionTag';
import { FadeIn } from '@/components/animations/FadeIn';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { SectionBackground } from '../SectionBackground';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { StatusDot } from '@/components/StatusDot';
import { BookOpen, FileText, PlayCircle, Star, Zap, ChevronDown, ChevronUp, ArrowRight, ChevronRight, TrendingUp } from 'lucide-react';

export function HeroSection({ section, mainCourse }: { section: any; mainCourse?: any }) {
    const router = useRouter();
    const [activationType, setActivationType] = useState<'EMAIL' | 'CODE'>('EMAIL');
    const isCombo = mainCourse?.type === 'BUNDLE' || mainCourse?.isBundle;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const courseTitle = mainCourse?.title || mainCourse?.name || section.title;
    const salePrice = mainCourse?.salePrice || mainCourse?.price || 0;
    const originalPrice = mainCourse?.price || mainCourse?.originalPrice || 0;

    return (
        <section className={cn(
            "relative w-full py-16 md:py-24 transition-all duration-500",
            section.backgroundTheme === 'dark' ? "bg-black text-white" : "bg-background text-foreground"
        )}>
            {/* Ambient Background Effects */}
            {section.backgroundTheme === 'dark' && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-60 animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-zinc-900/40 rounded-full blur-[200px] -z-10" />
                </div>
            )}

            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={false}
                className="opacity-100"
            />

            <div className="container relative z-10">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text content */}
                    <FadeIn direction="up" duration={0.8} className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
                        <div className="flex justify-center lg:justify-start">
                            <SectionTag variant={section.backgroundTheme === 'dark' ? 'dark' : 'default'}>
                                {section.tag || "🚀 Học để làm được"}
                            </SectionTag>
                        </div>

                        {/* Title with proper line height for Vietnamese */}
                        <h1 className={cn(
                            "text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-tight py-2",
                            section.backgroundTheme === 'dark'
                                ? "text-white"
                                : "text-foreground"
                        )}>
                            {section.title}
                        </h1>

                        {/* Subtitle */}
                        <p className={cn(
                            "mx-auto lg:mx-0 max-w-[600px] text-base md:text-lg lg:text-xl leading-relaxed",
                            section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-muted-foreground"
                        )}>
                            {section.subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            {section.ctaText && (
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        const el = document.getElementById('payment-section');
                                        if (el) {
                                            const offset = 80; // Adjust for header
                                            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                            window.scrollTo({
                                                top: elementPosition - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    className={cn(
                                        "w-full sm:w-auto text-base px-8 h-12 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]",
                                        "bg-white text-black hover:bg-zinc-200"
                                    )}
                                >
                                    {section.ctaText || 'Đăng ký ngay'}
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            )}
                            <Link href="/contact">
                                <Button as="div" variant="outline" size="lg" className={cn(
                                    "w-full sm:w-auto text-base px-8 h-12 font-bold transition-all backdrop-blur-sm",
                                    section.backgroundTheme === 'dark'
                                        ? "border-white/40 text-white hover:bg-white/10"
                                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                )}>
                                    Liên hệ tư vấn
                                </Button>
                            </Link>
                        </div>

                        {/* Trust indicators - removed uppercase */}
                        <div className={cn(
                            "flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-6 text-sm font-semibold",
                            section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-muted-foreground"
                        )}>
                            {(section.trustIndicators || ['Miễn phí thử', 'Hỗ trợ 24/7', 'Chứng chỉ']).map((indicator: string, index: number) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-full shadow-lg group/indicator transition-all",
                                        section.backgroundTheme === 'dark'
                                            ? "bg-black/50 border border-zinc-800 text-white hover:bg-zinc-900"
                                            : "bg-background border border-border text-foreground hover:bg-accent/50"
                                    )}
                                >
                                    <StatusDot color={section.backgroundTheme === 'dark' ? "white" : "black"} />
                                    <span className="not-italic tracking-wide">{indicator}</span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Image / Product Card */}
                    <FadeIn direction="up" delay={0.2} className="relative mx-auto lg:mr-0 w-full max-w-[850px] order-1 lg:order-2 p-4 lg:p-8">
                        {mainCourse ? (
                            /* Unified Product Card for Courses/Combos */
                            <div className="relative group">
                                {/* Glow background */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur-3xl opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>

                                <div className="relative bg-card/80 dark:bg-zinc-900/40 backdrop-blur-3xl border border-border/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] flex flex-col md:flex-row">
                                    {/* Glass glow internally */}
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] opacity-30 pointer-events-none" />
                                    {/* Thumbnail */}
                                    <div className="relative w-full md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden rounded-t-[2.5rem] md:rounded-l-[2.5rem] md:rounded-tr-none">
                                        <Image
                                            src={mainCourse.thumbnail || section.image || "/placeholder.jpg"}
                                            alt={courseTitle}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                        {/* Status Badge - No uppercase */}
                                        <div className="absolute top-6 left-6 z-10">
                                            <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                                {isCombo ? 'Combo lộ trình' : 'Khóa học'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Combo ưu đãi đặc biệt
                                                    </div>
                                                    <h3 className="font-bold text-xl md:text-2xl leading-tight text-foreground">
                                                        {courseTitle}
                                                    </h3>
                                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                                                        {mainCourse.description || "Lộ trình đào tạo thực chiến A-Z"}
                                                    </p>
                                                </div>
                                                {/* Rating */}
                                                <div className="hidden sm:flex items-center gap-1 bg-muted px-2 py-1 rounded-lg shrink-0">
                                                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-xs font-bold text-foreground">4.9</span>
                                                </div>
                                            </div>

                                            {/* Course List for Bundle */}
                                            {isCombo && mainCourse.courses && mainCourse.courses.length > 0 && (
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bao gồm {mainCourse.courses.length} khóa học:</p>
                                                    <ul className="space-y-2">
                                                        {mainCourse.courses.map((c: any, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                                <span className="truncate">{c.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm text-[10px] font-bold">
                                                    <BookOpen className="w-3 h-3 text-primary" />
                                                    Lộ trình bài bản
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm text-[10px] font-bold">
                                                    <TrendingUp className="w-3 h-3 text-primary" />
                                                    Hỗ trợ 1:1 chuyên sâu
                                                </div>
                                            </div>

                                            {/* Price Section - Simplified layout */}
                                            <div className="pt-6 border-t border-border space-y-6">
                                                <div className="flex flex-row items-center justify-between gap-4">
                                                    <div className="space-y-0.5">
                                                        {originalPrice > salePrice && (
                                                            <span className="text-sm text-zinc-400 line-through font-medium">
                                                                {formatCurrency(originalPrice)}
                                                            </span>
                                                        )}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                                                                {formatCurrency(salePrice)}
                                                            </span>
                                                            {originalPrice > salePrice && (
                                                                <div className="bg-red-500/10 text-red-500 text-[10px] font-bold py-1 px-2 rounded-full border border-red-500/20">
                                                                    -{Math.round((1 - salePrice / (originalPrice || 1)) * 100)}% Tiết kiệm
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        size="lg"
                                                        className="font-bold text-sm shadow-xl border-0 h-12 px-8 transition-all hover:scale-[1.05] active:scale-[0.95] bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center gap-2 rounded-xl"
                                                        onClick={() => {
                                                            const url = isCombo
                                                                ? `/checkout?bundleId=${mainCourse.id}`
                                                                : `/checkout?courseId=${mainCourse.id}`;
                                                            router.push(url);
                                                        }}
                                                    >
                                                        Chi tiết
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Features */}
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-border">
                                            {[
                                                { icon: Zap, label: "Truy cập trọn đời", color: "text-amber-500" },
                                                { icon: BookOpen, label: isCombo ? "Hệ thống khoá học" : "Video bài giảng 4K", color: "text-blue-500" }
                                            ].map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                                    <f.icon className={cn("w-3.5 h-3.5", f.color)} />
                                                    <span>{f.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Standard Hero Image */
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50"></div>
                                <div className="relative aspect-[4/3] w-full shadow-2xl rounded-2xl ring-1 ring-border overflow-hidden bg-muted">
                                    {section.image && (
                                        <Image
                                            src={section.image}
                                            alt="Hero"
                                            fill
                                            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                                            priority
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        )}
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
