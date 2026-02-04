'use client';
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
    const originalPrice = mainCourse?.compareAtPrice ? Number(mainCourse.compareAtPrice) : (mainCourse?.originalPrice ? Number(mainCourse.originalPrice) : 0);

    return (
        <section className={cn(
            "relative w-full py-16 md:py-24 transition-all duration-500 overflow-hidden",
            section.backgroundTheme === 'dark'
                ? "bg-black text-white"
                : section.backgroundTheme === 'light'
                    ? "bg-white dark:bg-black text-zinc-950 dark:text-white"
                    : "bg-background text-foreground"
        )}>
            {/* Ambient Background Effects */}
            {(section.backgroundTheme === 'dark' || section.backgroundTheme === 'light') && (
                <div className={cn(
                    "absolute inset-0 pointer-events-none overflow-hidden",
                    section.backgroundTheme === 'light' ? "dark:block hidden" : "block"
                )}>
                    <div className="absolute top-[-5%] right-[-5%] w-[180px] md:w-[800px] h-[180px] md:h-[800px] bg-primary/10 md:bg-primary/20 rounded-full blur-[60px] md:blur-[160px] opacity-40 md:opacity-60 animate-pulse" />
                    <div className="absolute bottom-[-5%] left-[-5%] w-[120px] md:w-[600px] h-[120px] md:h-[600px] bg-blue-500/5 md:bg-blue-500/10 rounded-full blur-[50px] md:blur-[140px] opacity-30 md:opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[1000px] h-[200px] md:h-[1000px] bg-zinc-900/40 rounded-full blur-[80px] md:blur-[200px] -z-10" />
                </div>
            )}

            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={false}
                className="opacity-100"
            />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text content */}
                    <FadeIn direction="up" duration={0.8} fullWidth={true} className="flex flex-col justify-center space-y-4 md:space-y-6 text-center lg:text-left order-2 lg:order-1 w-full overflow-hidden">
                        <div className="flex justify-center lg:justify-start">
                            <SectionTag>
                                {section.tag || "🚀 Học để làm được"}
                            </SectionTag>
                        </div>

                        {/* Title with proper line height for Vietnamese */}
                        <h1 className={cn(
                            "text-2xl font-semibold sm:text-4xl md:text-5xl lg:text-7xl leading-[1.2] md:leading-tight py-2 break-all sm:break-words hyphens-auto",
                            section.backgroundTheme === 'dark'
                                ? "text-white"
                                : section.backgroundTheme === 'light'
                                    ? "text-foreground dark:text-white"
                                    : "text-foreground dark:text-white"
                        )}>
                            {section.title}
                        </h1>

                        {/* Subtitle */}
                        <p className={cn(
                            "mx-auto lg:mx-0 max-w-[600px] text-base md:text-lg lg:text-xl leading-relaxed",
                            section.backgroundTheme === 'dark' ? "text-zinc-300" : section.backgroundTheme === 'light' ? "text-muted-foreground dark:text-zinc-400" : "text-muted-foreground"
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
                                            const offset = 80;
                                            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                            window.scrollTo({
                                                top: elementPosition - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    variant={section.backgroundTheme === 'dark' ? "white" : "default"}
                                    className={cn(
                                        "w-full sm:w-auto text-base px-8 h-12 font-bold shadow-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]",
                                        section.backgroundTheme !== 'dark'
                                            ? "bg-black text-white hover:bg-zinc-800 dark:border dark:border-white/20 dark:bg-black"
                                            : "bg-white text-black hover:bg-zinc-200" // Explicit high contrast
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
                                    "w-full sm:w-auto text-base px-8 h-12 font-semibold transition-all backdrop-blur-sm",
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
                            "flex flex-col sm:flex-row flex-wrap items-center gap-2 md:gap-6 justify-center lg:justify-start pt-4 text-sm font-medium w-full",
                            section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-muted-foreground"
                        )}>
                            {(section.trustIndicators || ['Miễn phí thử', 'Hỗ trợ 24/7', 'Chứng chỉ']).map((indicator: string, index: number) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-center gap-1.5 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg group/indicator transition-all bg-black border border-white/10 text-white hover:bg-zinc-900 w-fit"
                                    )}
                                >
                                    <StatusDot color="white" className="w-1 md:w-1.5 h-1 md:h-1.5" />
                                    <span className="not-italic">{indicator}</span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>

                    {/* Image / Product Card */}
                    <FadeIn direction="up" delay={0.2} className="relative mx-auto lg:mr-0 w-full max-w-[400px] md:max-w-[650px] order-1 lg:order-2 p-0">
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
                                    <div className="relative w-full md:w-[45%] aspect-[16/10] md:aspect-[4/5] min-h-[160px] md:min-h-[300px] overflow-hidden rounded-t-[2.5rem] md:rounded-l-[2.5rem] md:rounded-tr-none">
                                        <Image
                                            src={mainCourse.thumbnail || section.image || "/hero_vibe_coding.png"}
                                            alt={courseTitle}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                        {/* Status Badge - No uppercase */}
                                        <div className="absolute top-6 left-6 z-10">
                                            <SectionTag
                                                variant="black-pill"
                                                showDot={false}
                                                animate={false}
                                                className="h-9 border-white/20 bg-black/60 shadow-none backdrop-blur-md"
                                            >
                                                {isCombo ? 'Combo lộ trình' : 'Khóa học'}
                                            </SectionTag>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-500">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Combo ưu đãi đặc biệt
                                                    </div>
                                                    <h3 className="font-semibold text-xl md:text-2xl leading-tight text-foreground">
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
                                                    <p className="text-[10px] font-bold text-zinc-400">Bao gồm {mainCourse.courses.length} khóa học:</p>
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
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm text-[10px] font-semibold">
                                                    <BookOpen className="w-3 h-3 text-primary" />
                                                    Lộ trình bài bản
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm text-[10px] font-semibold">
                                                    <TrendingUp className="w-3 h-3 text-primary" />
                                                    Hỗ trợ 1:1 chuyên sâu
                                                </div>
                                            </div>

                                            {/* Price Section - Stacked on mobile to prevent cutoff */}
                                            <div className="pt-6 border-t border-border space-y-6">
                                                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
                                                    <div className="space-y-0.5">
                                                        {Boolean(originalPrice > salePrice) && (
                                                            <span className="text-sm text-zinc-400 line-through font-medium flex items-baseline gap-0.5">
                                                                {new Intl.NumberFormat('vi-VN').format(originalPrice)}<sup className="text-[10px]">đ</sup>
                                                            </span>
                                                        )}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl md:text-4xl font-semibold text-foreground flex items-baseline gap-1">
                                                                {new Intl.NumberFormat('vi-VN').format(salePrice)}<sup className="text-xl">đ</sup>
                                                            </span>
                                                            {Boolean(originalPrice > salePrice) && (
                                                                <div className="bg-red-500/10 text-red-500 text-[10px] font-semibold py-1 px-2 rounded-full border border-red-500/20">
                                                                    -{Math.round((1 - salePrice / (originalPrice || 1)) * 100)}% Tiết kiệm
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        size="lg"
                                                        className="font-semibold text-sm shadow-xl border-0 h-12 px-8 transition-all hover:scale-[1.05] active:scale-[0.95] bg-black text-white hover:bg-zinc-800 flex items-center gap-2 rounded-xl"
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
                            <div className="relative aspect-video lg:aspect-[4/3] w-full min-h-[200px] md:min-h-[400px] shadow-2xl rounded-2xl ring-1 ring-border overflow-hidden bg-muted mx-auto">
                                {/* Explicitly fallback to placeholder if no section.image */}
                                <Image
                                    src={section.image || "/hero_vibe_coding.png"}
                                    alt="Hero"
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            </div>
                        )}
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
