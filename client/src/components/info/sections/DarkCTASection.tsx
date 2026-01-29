'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

import { Zap, CheckCircle2 } from 'lucide-react';

export const DarkCTASection = ({ section, mainCourse }: { section: any; mainCourse?: any }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(amount);
    };
    return (
        <section className="section-dark py-20 md:py-32 flex items-center justify-center relative overflow-hidden">
            {section.showDotPattern !== false && <DotPatternBackground />}

            <div className="container relative z-10 px-4 max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary mb-6 animate-fade-up">
                            <Zap size={14} className="fill-current" />
                            <span className="text-[10px] font-bold uppercase">Ưu đãi có hạn</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-400 to-white py-2">
                            {section.title || "Sẵn sàng bứt phá thu nhập?"}
                        </h2>

                        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-medium">
                            {section.subtitle || "Tham gia ngay cộng đồng 2,000+ học viên và sở hữu lộ trình đào tạo thực chiến nhất thị trường."}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-bold text-neutral-300">
                            {["Truy cập trọn đời", "Hỗ trợ 1:1", "Update liên tục"].map((t, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-primary" />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overlapping Price Card */}
                    <div className="w-full max-w-[400px] shrink-0 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                        <div className="relative bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-50" />

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-primary uppercase">Học phí trọn gói</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                                            {mainCourse ? formatCurrency(mainCourse.salePrice || mainCourse.price || 0) : 'LIÊN HỆ'}
                                        </span>
                                        {mainCourse?.salePrice && mainCourse.price > mainCourse.salePrice && (
                                            <span className="text-lg text-neutral-500 line-through decoration-red-500/50">
                                                {formatCurrency(mainCourse.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-neutral-400">Thời gian học</span>
                                        <span className="text-white">Trọn đời</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-neutral-400">Hình thức</span>
                                        <span className="text-white">Online Video + Live</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-neutral-400">Cam kết</span>
                                        <span className="text-white">Hoàn tiền 100%</span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    {section.ctaLink && (
                                        <button
                                            onClick={() => {
                                                const el = document.getElementById(section.ctaLink?.replace('#', '') || 'payment-section');
                                                if (el) {
                                                    const offset = 80;
                                                    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                                    window.scrollTo({
                                                        top: elementPosition - offset,
                                                        behavior: 'smooth'
                                                    });
                                                } else if (!section.ctaLink.startsWith('#')) {
                                                    window.location.href = section.ctaLink;
                                                }
                                            }}
                                            className="w-full h-16 bg-white hover:bg-neutral-200 text-black text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            {section.ctaText || 'Đăng ký ngay'}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                    <p className="text-center text-[10px] text-neutral-500 mt-4 font-semibold uppercase">Đảm bảo bảo mật thanh toán</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
