
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


                <div className={`gap-8 mx-auto ${section.items.length === 1 ? 'flex justify-center max-w-md' : section.items.length === 2 ? 'grid md:grid-cols-2 max-w-4xl' : 'grid md:grid-cols-3 max-w-6xl'}`}>
                    {section.items.map((item: any, index: number) => {
                        const isPopular = item.tag === 'Best Value' || item.tag === 'VIP' || item.tag === 'Phổ biến' || item.tag === 'VIP Support';
                        return (
                            <div key={item.id || index} className={`relative group rounded-2xl border ${isPopular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-border shadow-sm'} bg-card p-6 md:p-8 flex flex-col transition-all duration-300 w-full max-w-md`}>
                                {item.tag && (
                                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${isPopular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10`}>
                                        {item.tag}
                                    </div>
                                )}

                                <div className="mb-6 text-center">
                                    <div className="mb-4 inline-flex p-3 rounded-2xl bg-muted/50 text-foreground">
                                        <DynamicIcon name={item.icon || 'Package'} className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="text-4xl font-bold text-primary">{item.price}</span>
                                        {item.originalPrice && (
                                            <span className="text-lg text-muted-foreground line-through decoration-red-500/50">{item.originalPrice}</span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
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
                                        className={`w-full font-bold h-12 rounded-xl text-base ${isPopular ? 'shadow-sm hover:shadow-md transition-all' : ''}`}
                                    >
                                        {item.ctaText || 'Đăng ký ngay'}
                                    </Button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
