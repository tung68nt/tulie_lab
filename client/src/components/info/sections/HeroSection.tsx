'use client';

import { SectionTag } from '@/components/SectionTag';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { SectionBackground } from '../SectionBackground';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ShoppingBag, Star, Zap, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

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
        <section className="w-full pt-8 pb-4 md:pt-10 md:pb-8 lg:pt-16 lg:pb-16 bg-background relative transition-colors duration-300">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={section.backgroundTheme === 'dark'}
            />

            <div className="container relative z-10">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text content */}
                    <div className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
                        {/* Badge tag */}
                        <div className="flex justify-center lg:justify-start">
                            <SectionTag>
                                {section.tag || "🚀 Học để làm được"}
                            </SectionTag>
                        </div>

                        {/* Title with proper line height for Vietnamese */}
                        <h1 className={cn(
                            "text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-tight py-2",
                            section.backgroundTheme === 'dark'
                                ? "text-white"
                                : "bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white"
                        )}>
                            {section.title}
                        </h1>

                        {/* Subtitle */}
                        <p className={cn(
                            "mx-auto lg:mx-0 max-w-[600px] text-base md:text-lg lg:text-xl leading-relaxed",
                            section.backgroundTheme === 'dark' ? "text-zinc-100" : "text-muted-foreground"
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
                                    className="w-full sm:w-auto text-base px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    {section.ctaText || 'Đăng ký ngay'}
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            )}
                            <Link href="/contact">
                                <Button as="div" variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-12 font-semibold hover:bg-muted transition-all">
                                    Liên hệ tư vấn
                                </Button>
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className={cn(
                            "flex items-center gap-6 justify-center lg:justify-start pt-4 text-sm",
                            section.backgroundTheme === 'dark' ? "text-zinc-200" : "text-muted-foreground"
                        )}>
                            {(section.trustIndicators || ['Miễn phí thử', 'Hỗ trợ 24/7', 'Chứng chỉ']).map((indicator: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <svg className={cn("h-5 w-5", section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-foreground")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{indicator}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image / Product Card */}
                    <div className="relative mx-auto lg:mr-0 w-full max-w-[600px] order-1 lg:order-2 p-4 lg:p-8">
                        {mainCourse ? (
                            /* Unified Product Card for Courses/Combos */
                            <div className="relative group">
                                {/* Glow background */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur-3xl opacity-50 transition-opacity duration-1000 group-hover:opacity-70"></div>

                                <div className="relative bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border-white/10">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={mainCourse.thumbnail || section.image || "/placeholder.jpg"}
                                            alt={courseTitle}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                {isCombo ? 'COMBO LỘ TRÌNH' : 'KHOÁ HỌC'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-xl md:text-2xl leading-tight">
                                                    {courseTitle}
                                                </h3>
                                                <p className="text-muted-foreground text-sm line-clamp-1">
                                                    {mainCourse.description || "Lộ trình đào tạo thực chiến A-Z"}
                                                </p>
                                            </div>
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                                                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                                <span className="text-xs font-bold">4.9</span>
                                            </div>
                                        </div>

                                        {/* Price Section */}
                                        <div className="pt-4 border-t border-dashed space-y-4">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Học phí</p>
                                                    <div className="text-2xl md:text-3xl font-bold text-primary">
                                                        {formatCurrency(salePrice)}
                                                    </div>
                                                </div>
                                                {(originalPrice > salePrice) && (
                                                    <div className="text-right">
                                                        <span className="text-sm text-zinc-500 line-through decoration-red-500/50">
                                                            {formatCurrency(originalPrice)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Activation Type Selection */}
                                            <div className="space-y-2 pt-2">
                                                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Hình thức kích hoạt:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => setActivationType('EMAIL')}
                                                        className={`text-[11px] px-3 py-2 rounded-xl border transition-all ${activationType === 'EMAIL'
                                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white font-bold'
                                                            : 'bg-transparent text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                                            }`}
                                                    >
                                                        Kích hoạt ngay (Email)
                                                    </button>
                                                    <button
                                                        onClick={() => setActivationType('CODE')}
                                                        className={`text-[11px] px-3 py-2 rounded-xl border transition-all ${activationType === 'CODE'
                                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white font-bold'
                                                            : 'bg-transparent text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                                            }`}
                                                    >
                                                        Mua mã kích hoạt
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Main Buy Button */}
                                            <Button
                                                size="lg"
                                                className="w-full font-bold text-sm shadow-xl border-0 h-12 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse-slow bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                                                onClick={() => {
                                                    const url = isCombo
                                                        ? `/checkout?bundleId=${mainCourse.id}&activationType=${activationType}`
                                                        : `/checkout?courseId=${mainCourse.id}&activationType=${activationType}`;
                                                    router.push(url);
                                                }}
                                            >
                                                {activationType === 'CODE' ? 'Mua mã ngay' : 'Đăng ký ngay'}
                                            </Button>

                                            <p className="text-center text-[10px] text-muted-foreground font-medium">Hoàn tiền trong 30 ngày nếu không hài lòng</p>
                                        </div>

                                        {/* Quick Features */}
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed">
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
                                <div className="relative aspect-[4/3] w-full shadow-2xl rounded-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden bg-muted">
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
                    </div>
                </div>
            </div>
        </section>
    );
}
