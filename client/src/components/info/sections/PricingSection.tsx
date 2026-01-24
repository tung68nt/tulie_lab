
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
                    {/* Main Pricing Grid (Membership Packages) */}
                    <div className={`gap-8 mx-auto ${section.items.filter((item: any) => !item.title.toLowerCase().includes('mua lẻ')).length === 1 ? 'flex justify-center max-w-md' : section.items.filter((item: any) => !item.title.toLowerCase().includes('mua lẻ')).length === 2 ? 'grid md:grid-cols-2 max-w-4xl' : 'grid md:grid-cols-3 max-w-6xl'}`}>
                        {section.items.filter((item: any) => !item.title.toLowerCase().includes('mua lẻ')).map((item: any, index: number) => {
                            const isPopular = item.tag === 'Best Value' || item.tag === 'VIP' || item.tag === 'Phổ biến' || item.tag === 'VIP Support';
                            return (
                                <div key={item.id || index} className={`relative group rounded-3xl border ${isPopular ? 'border-primary/50 shadow-lg' : 'border-border shadow-sm'} bg-card p-6 md:p-8 flex flex-col transition-all duration-300 w-full max-w-md mx-auto hover:shadow-xl hover:border-primary/30`}>
                                    {item.tag && (
                                        <div className={`absolute -top-3.5 left-6 ${isPopular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10`}>
                                            {item.tag}
                                        </div>
                                    )}

                                    <div className="mb-6 text-center">
                                        <div className="mb-4 inline-flex p-2.5 rounded-xl bg-muted/30 text-foreground">
                                            <DynamicIcon name={item.icon || 'Package'} className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                        <div className="flex items-center justify-center gap-1.5 mb-2">
                                            <span className="text-3xl font-bold text-foreground">{item.price}</span>
                                            {item.originalPrice && (
                                                <span className="text-base text-muted-foreground line-through decoration-red-500/40">{item.originalPrice}</span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px] mx-auto">{item.description}</p>
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

                                    <Link href={item.link || '/checkout'} className="w-full mt-auto">
                                        <Button
                                            variant={isPopular ? 'default' : 'outline'}
                                            size="lg"
                                            className={`w-full font-bold h-11 rounded-xl text-sm ${isPopular ? 'shadow-md translate-y-0 active:translate-y-0.5' : ''}`}
                                        >
                                            {item.ctaText || 'Đăng ký ngay'}
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Single Product Section (Mua Lẻ) */}
                    {section.items.some((item: any) => item.title.toLowerCase().includes('mua lẻ')) && (
                        <div className="flex justify-center mt-12">
                            {section.items.filter((item: any) => item.title.toLowerCase().includes('mua lẻ')).map((item: any, index: number) => (
                                <div key={item.id || index} className="relative group rounded-3xl border border-border shadow-sm bg-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 w-full max-w-4xl hover:shadow-xl hover:border-primary/30">
                                    {item.tag && (
                                        <div className="absolute -top-3.5 left-6 bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                            {item.tag}
                                        </div>
                                    )}

                                    <div className="flex-shrink-0 text-center md:text-left md:min-w-[200px]">
                                        <div className="mb-4 inline-flex p-2.5 rounded-xl bg-muted/30 text-foreground">
                                            <DynamicIcon name={item.icon || 'Package'} className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                        <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px] mx-auto md:mx-0">{item.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 flex-1 py-4 border-t md:border-t-0 md:border-l border-border md:pl-8">
                                        {item.features?.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 text-sm">
                                                <div className="mt-0.5 rounded-full bg-green-500/10 p-1">
                                                    <DynamicIcon name="Check" className="w-3 h-3 text-green-600 shrink-0" />
                                                </div>
                                                <span className="whitespace-nowrap">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                        <Link href={item.link || '/shop'} className="w-full">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="w-full md:px-8 font-bold h-11 rounded-xl text-sm"
                                            >
                                                {item.ctaText || 'Khám phá ngay'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
