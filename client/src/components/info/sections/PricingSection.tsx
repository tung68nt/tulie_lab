
'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { DynamicIcon } from '@/components/DynamicIcon';

export function PricingSection({ section }: { section: Section }) {
    if (!section.items) return null;

    return (
        <section className="py-16 bg-background">
            <div className="container px-4 mx-auto">


                <div className="space-y-12">
                    {/* Main Pricing Grid (Includes Single and Membership Packages) */}
                    <div className={`gap-8 mx-auto ${section.items.length === 1 ? 'flex justify-center max-w-md' : section.items.length === 2 ? 'grid md:grid-cols-2 max-w-4xl' : 'grid md:grid-cols-3 max-w-6xl'}`}>
                        {section.items.map((item: any, index: number) => {
                            const isPopular = item.tag === 'Best Value' || item.tag === 'VIP' || item.tag === 'Phổ biến' || item.tag === 'VIP Support';
                            const isSingle = item.title.toLowerCase().includes('mua lẻ') || item.title.toLowerCase().includes('single');

                            return (
                                <div key={item.id || index} className={`relative group rounded-3xl border ${isPopular ? 'border-primary/50 shadow-lg' : 'border-border shadow-sm'} bg-card p-6 md:p-8 flex flex-col transition-all duration-300 w-full max-w-md mx-auto hover:shadow-xl hover:border-primary/30`}>
                                    {item.tag && (
                                        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 whitespace-nowrap ${item.tag === 'Best Value'
                                                ? 'bg-red-600 text-white shadow-red-200'
                                                : (item.tag.toLowerCase().includes('mua lẻ') || item.tag.toLowerCase().includes('single'))
                                                    ? 'bg-zinc-900 text-white'
                                                    : 'bg-muted text-muted-foreground border border-border'
                                            }`}>
                                            {item.tag}
                                        </div>
                                    )}

                                    <div className="mb-6 text-center">
                                        <div className="mb-4 inline-flex p-2.5 rounded-xl bg-muted/30 text-foreground">
                                            <DynamicIcon name={item.icon || (isSingle ? 'Package' : 'Zap')} className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                        <div className="flex items-center justify-center gap-1.5 mb-2">
                                            <span className="text-3xl font-bold text-foreground">{item.price}</span>
                                            {item.originalPrice && (
                                                <span className="text-base text-muted-foreground line-through decoration-red-500/40">{item.originalPrice}</span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px] mx-auto min-h-[3rem]">{item.description}</p>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        {item.features?.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 text-sm">
                                                <div className="mt-0.5 rounded-full bg-green-500/10 p-1">
                                                    <DynamicIcon name="Check" className="w-3 h-3 text-green-600 shrink-0" />
                                                </div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link href={item.link || (isSingle ? '/shop' : '/checkout')} className="w-full mt-auto">
                                        <Button
                                            variant={isPopular ? 'default' : 'outline'}
                                            size="lg"
                                            className={`w-full font-bold h-11 rounded-xl text-sm ${isPopular ? 'shadow-md translate-y-0 active:translate-y-0.5' : ''}`}
                                        >
                                            {item.ctaText || (isSingle ? 'Xem cửa hàng' : 'Đăng ký ngay')}
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
