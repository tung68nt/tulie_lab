'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

import { Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { SectionTag } from '@/components/SectionTag';

export const DarkCTASection = ({ section, mainCourse }: { section: any; mainCourse?: any }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(amount);
    };
    return (
        <section className="section-dark py-24 md:py-40 flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-10 opacity-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] -z-10 opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.05] [background-size:32px_32px] -z-10" />
            {/* 4 Corner Dot Patterns removed in favor of more modern ambient glows */}

            <div className="container relative z-10 px-4 max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <SectionTag className="mb-8">
                            {section.tag || "Ưu đãi có hạn"}
                        </SectionTag>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.05] text-white tracking-tighter">
                            {section.title || "Sẵn sàng bứt phá thu nhập?"}
                        </h2>

                        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                            {section.subtitle || "Tham gia ngay cộng đồng 2,000+ học viên và sở hữu lộ trình đào tạo thực chiến nhất thị trường."}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm font-bold text-zinc-300">
                            {["Truy cập trọn đời", "Hỗ trợ 1:1", "Update liên tục"].map((t, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <CheckCircle2 size={12} className="text-primary" />
                                    </div>
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overlapping Price Card with better glassmorphism */}
                    <div className="w-full max-w-[440px] shrink-0 transform lg:rotate-2 hover:rotate-0 transition-all duration-700">
                        <div className="relative bg-white/5 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                            {/* Decorative internal glow */}
                            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] opacity-60" />
                            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] opacity-30" />
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-50" />

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold text-primary">Học phí trọn gói</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                            {mainCourse ? formatCurrency(mainCourse.salePrice || mainCourse.price || 0) : 'LIÊN HỆ'}
                                        </span>
                                        {mainCourse?.salePrice && mainCourse.price > mainCourse.salePrice && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-zinc-500 line-through decoration-red-500/50">
                                                    {formatCurrency(mainCourse.price)}
                                                </span>
                                                <div className="bg-red-500/10 text-red-400 text-[11px] font-bold py-1 px-2.5 rounded-lg border border-red-500/20">
                                                    -{Math.round((1 - (mainCourse.salePrice || 0) / (mainCourse.price || 1)) * 100)}%
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-zinc-400">Thời gian học</span>
                                        <span className="text-white">Trọn đời</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-zinc-400">Hình thức</span>
                                        <span className="text-white">Online Video + Live</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-zinc-400">Cam kết</span>
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
                                            className="w-full h-16 bg-white hover:bg-zinc-200 text-black text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            {section.ctaText || 'Đăng ký ngay'}
                                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </button>
                                    )}
                                    <p className="text-center text-[10px] text-zinc-500 mt-4 font-semibold">Đảm bảo bảo mật thanh toán</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
