import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Gift } from 'lucide-react';

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
        <section className="py-24 md:py-32 bg-[#050505] text-white relative overflow-hidden">
            {/* Dotted Background */}
            <div className="absolute inset-0 bg-dot-grid-dark opacity-30 pointer-events-none" />

            {/* Decorative Ribbons - Breathing Animation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm">
                <div className="bg-[#FF0000] text-white font-bold text-lg md:text-xl px-8 py-4 rounded-b-3xl shadow-[0_10px_40px_-10px_rgba(255,0,0,0.6)] uppercase tracking-wide text-center animate-pulse-slow relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <Gift className="w-6 h-6 animate-bounce" />
                        QUÀ TẶNG GIỚI HẠN
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
                </div>
            </div>

            <div className="container relative z-10 pt-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {section.title || "Quà Tặng Đặc Biệt"}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-light">
                        {section.subtitle || "Dành riêng cho 50 bạn đăng ký sớm nhất hôm nay"}
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Bonus Cards */}
                    {items.map((item, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-[#FF0000]/50 transition-all duration-500 hover:shadow-[10px_10px_50px_-10px_rgba(255,0,0,0.2)]">
                            {/* Header Stripe */}
                            <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-4 flex items-center border-b border-white/5">
                                <span className="bg-[#FF0000] text-white text-xs font-bold px-3 py-1 rounded-full mr-4 shadow-lg shadow-red-500/20">
                                    QUÀ TẶNG #{idx + 1}
                                </span>
                                <h3 className="text-lg md:text-xl font-bold truncate pr-4">{item.title}</h3>
                            </div>

                            <div className="flex flex-col md:flex-row">
                                {/* Image Column */}
                                <div className="relative w-full md:w-2/5 min-h-[260px] md:min-h-full bg-neutral-900 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title || ''}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-6xl bg-neutral-800">🎁</div>
                                    )}
                                    {/* Overlay Gradient on Image */}
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-900 via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10">
                                    <div className="space-y-6 mb-8">
                                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                                            {item.description}
                                        </p>

                                        {/* Features List */}
                                        {item.features && (
                                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <ul className="space-y-3">
                                                    {(Array.isArray(item.features) ? item.features : (item.features as string).split('\n')).map((feature: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm md:text-base text-gray-200">
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
                                            <div className="text-sm text-gray-500 line-through mb-0.5">Giá gốc: {parsePrice(item.originalPrice || item.price || 0).toLocaleString('vi-VN')}đ</div>
                                            <div className="text-2xl font-bold text-[#FF0000] drop-shadow-sm">
                                                MIỄN PHÍ <span className="text-sm text-gray-400 font-normal ml-1">(Khi mua Combo)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total Value Summary - Premium Redesign */}
                <div className="mt-24 relative">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-red-600/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl overflow-hidden ring-1 ring-white/5">

                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-xs md:text-sm font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                                Tổng trị giá quà tặng
                            </h3>

                            <div className="flex flex-col items-center justify-center mb-6 relative">
                                {totalValue > 0 && (
                                    <div className="flex items-center justify-center gap-3 md:gap-4 mb-2 animate-in fade-in zoom-in duration-1000">
                                        <span className="text-2xl md:text-4xl text-neutral-400/80 font-bold decoration-2 line-through relative">
                                            {totalValue.toLocaleString('vi-VN')}đ
                                            {/* Custom diagonal line for extra visibility */}
                                            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500/40 -rotate-3" />
                                        </span>
                                        <span className="bg-red-500/10 text-red-500 text-xs md:text-sm px-2 py-0.5 rounded border border-red-500/20 font-bold whitespace-nowrap">
                                            TIẾT KIỆM {totalValue.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start justify-center gap-1 relative px-4 py-2 -my-2 pb-4">
                                    <span className="text-8xl md:text-[9rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 drop-shadow-2xl select-none py-4 tracking-tight pr-2">
                                        0
                                    </span>
                                    <span className="text-4xl md:text-5xl font-medium text-neutral-500 mt-6 md:mt-8">đ</span>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 bg-[#FF0000]/10 border border-[#FF0000]/20 text-[#FF0000] px-5 py-2.5 rounded-full animate-pulse-slow">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF0000]"></span>
                                </span>
                                <span className="font-medium text-sm md:text-base tracking-wide">Chỉ nhận được khi đăng ký <span className="font-bold">NGAY HÔM NAY</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
