import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';

interface BonusSectionProps {
    section: Section;
}

const parsePrice = (price?: string | number | null) => {
    if (price === null || price === undefined) return 0;
    if (typeof price === 'number') return isNaN(price) ? 0 : price;
    return parseInt(String(price).replace(/\D/g, '')) || 0;
};

export const BonusSection: React.FC<BonusSectionProps> = ({ section }) => {
    const items = section.items || [];
    const totalValue = items.reduce((sum, item) => sum + (parsePrice(item.originalPrice) || parsePrice(item.price) || 0), 0);

    return (
        <section className="pt-24 pb-40 md:pt-32 md:pb-56 relative overflow-hidden bg-[#050505] text-white transition-colors duration-300">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity !== undefined ? section.overlayOpacity : 0.8}
                glowVariant={5} // Unique variant for BonusSection
            />

            {/* Decorative Ribbons - Bright Red, Static */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm">
                <div className="bg-[#FF0000] text-white font-bold text-lg md:text-xl px-8 py-4 rounded-b-3xl shadow-[0_10px_40px_-10px_rgba(255,0,0,0.6)] text-center relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <Gift className="w-6 h-6" />
                        Quà tặng giới hạn
                    </span>
                </div>
            </div>

            <div className="container relative z-10 pt-12">
                <StandardSectionHeader
                    section={section}
                    titleOverride={section.title || "Quà Tặng Đặc Biệt"}
                    subtitleOverride={section.subtitle || "Dành riêng cho 50 bạn đăng ký sớm nhất hôm nay"}
                />

                <FadeIn direction="up" delay={0.4} duration={0.6}>
                    <div className="flex flex-col gap-8">
                        {/* Bonus Cards */}
                        {items.map((item, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-3xl bg-neutral-900/80 backdrop-blur-md border border-white/20 hover:border-[#FF0000]/60 transition-all duration-500 hover:shadow-[10px_10px_50px_-10px_rgba(255,0,0,0.3)]">
                                {/* Header Stripe */}
                                <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-4 flex items-center border-b border-white/5">
                                    <span className="bg-[#FF0000] text-white text-[10px] font-bold px-3 py-1 rounded-lg mr-4 shadow-lg shadow-red-500/20 whitespace-nowrap">
                                        Quà tặng #{idx + 1}
                                    </span>
                                    <h3 className="text-lg md:text-xl font-bold truncate pr-4 text-white">{item.title}</h3>
                                </div>

                                <div className="flex flex-col md:flex-row">
                                    {/* Image Column */}
                                    <div className="relative w-full md:w-2/5 min-h-[260px] md:min-h-full bg-neutral-900 overflow-hidden">
                                        {item.image ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title || ''}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-6xl bg-neutral-800">🎁</div>
                                        )}
                                        {/* Overlay Gradient on Image */}
                                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-900 via-transparent to-transparent opacity-80" />
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10">
                                        <div className="space-y-6 mb-8">
                                            <p className="text-white text-lg leading-relaxed font-normal">
                                                {item.description}
                                            </p>

                                            {/* Features List */}
                                            {item.features && (
                                                <div className="bg-background/5 rounded-xl p-4 border border-white/5">
                                                    <ul className="space-y-3">
                                                        {(Array.isArray(item.features) ? item.features : (item.features as string).split('\n')).map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm md:text-base text-zinc-100 font-medium">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF0000] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,0,0,1)]" />
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Tag Footer */}
                                        <div className="mt-auto flex items-end justify-end gap-3 pt-6 border-t border-white/10">
                                            <div className="text-right">
                                                <div className="text-sm text-zinc-300 line-through mb-0.5 font-medium">Giá gốc: {parsePrice(item.originalPrice || item.price || 0).toLocaleString('vi-VN')}đ</div>
                                                <div className="text-2xl font-bold text-[#FF0000] drop-shadow-sm">
                                                    Miễn phí <span className="text-sm text-zinc-400 font-normal ml-1">(Khi mua Combo)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {/* Total Value Summary - Compact & Modern Redesign */}
                <FadeIn direction="up" delay={0.6} duration={0.8}>
                    <div className="mt-16 md:mt-24 relative max-w-4xl mx-auto">
                        {/* Ambient Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative bg-white backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group/bonus-sum">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover/bonus-sum:scale-150 transition-transform duration-1000" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                                <div className="text-center md:text-left space-y-2">
                                    <h3 className="text-sm md:text-base font-bold text-zinc-950">
                                        Tổng giá trị quà tặng
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <div className="relative">
                                            <span className="text-3xl md:text-5xl text-zinc-950 font-black tracking-tight">
                                                {totalValue.toLocaleString('vi-VN')}đ
                                            </span>
                                            {/* Solid Red Strike-through */}
                                            <div className="absolute top-[55%] left-[-5%] right-[-5%] h-[4px] bg-[#FF0000] opacity-100 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                                        </div>
                                        <span className="bg-red-500 text-white text-[10px] md:text-xs px-4 py-2 rounded-full font-black shadow-lg shadow-red-500/30 tracking-wider">
                                            TIẾT KIỆM {totalValue.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end">
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-6xl md:text-8xl font-bold text-zinc-950 dark:text-white drop-shadow-2xl">0</span>
                                        <span className="text-2xl md:text-3xl font-bold text-zinc-950/80 dark:text-white/80">đ</span>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                                        <span className="text-[11px] md:text-xs font-bold whitespace-nowrap">Chỉ nhận được khi đăng ký ngay hôm nay</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
