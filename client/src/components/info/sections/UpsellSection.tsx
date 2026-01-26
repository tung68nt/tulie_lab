'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { DynamicIcon } from '@/components/DynamicIcon';

import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export function UpsellSection({ section, upsellCourse, upsellProduct, upsellPrice }: { section: Section; upsellCourse?: any; upsellProduct?: any; upsellPrice?: any }) {

    if (!displayItems || displayItems.length === 0) return null;

    return (
        <section className="py-24 bg-background border-t border-zinc-100 relative overflow-hidden">
            {section.showDotPattern && <DotPatternBackground />}
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-semibold tracking-tight mb-4 text-zinc-900">{section.title}</h2>
                    <p className="text-zinc-500 text-lg leading-relaxed">{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {displayItems.map((item: any, index: number) => {
                        const isRetail = item.id?.includes('retail') || item.title?.includes('Mua lẻ');
                        const ButtonComponent = (
                            <Button
                                onClick={() => {
                                    if (!item.link || item.link === '#payment') {
                                        const el = document.getElementById('payment-section');
                                        if (el) {
                                            const offset = 80;
                                            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                            window.scrollTo({
                                                top: elementPosition - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }
                                }}
                                variant={isRetail ? "outline" : "default"}
                                className={`w-full py-6 rounded-2xl shadow-none transition-all duration-300 ${isRetail
                                    ? "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                                    : "bg-zinc-950 text-white hover:bg-zinc-800"
                                    }`}
                            >
                                {item.ctaText || "Đăng ký ngay"}
                            </Button>
                        );

                        return (
                            <div key={item.id || index} className="relative group rounded-[2rem] border border-zinc-100 bg-white p-8 hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col">
                                {item.tag && (
                                    <div className="absolute -top-3 right-8 text-[10px] font-medium px-3 py-1 rounded-full border border-zinc-100 bg-white text-zinc-600 tracking-wide">
                                        {item.tag}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 mb-6 group-hover:bg-zinc-100 transition-colors duration-300`}>
                                        <DynamicIcon name={item.icon || 'Package'} className="w-6 h-6 stroke-[1.5px]" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">{item.title}</h3>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-2xl font-semibold text-zinc-900">{item.price}</span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-zinc-400 line-through font-normal">{item.originalPrice}</span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-zinc-500 text-sm leading-relaxed mb-8 min-h-[3rem]">{item.description}</p>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {item.features?.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0">
                                                <DynamicIcon name="Check" className="w-2.5 h-2.5 text-zinc-400 stroke-[3px]" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    {item.link && item.link !== '#payment' ? (
                                        <Link href={item.link} className="w-full block">
                                            {ButtonComponent}
                                        </Link>
                                    ) : ButtonComponent}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
