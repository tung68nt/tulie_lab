'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { DynamicIcon } from '@/components/DynamicIcon';

export function UpsellSection({ section }: { section: Section }) {
    if (!section.items) return null;

    return (
        <section className="py-16 bg-background border-t border-border/50">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground">{section.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {section.items.map((item: any, index: number) => (
                        <div key={item.id || index} className="relative group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                            {item.tag && (
                                <div className="absolute -top-3 right-4 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                    {item.tag}
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-6">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color || 'from-gray-100 to-gray-200'} text-foreground shadow-inner`}>
                                    <DynamicIcon name={item.icon || 'Package'} className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-primary">{item.price}</span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-muted-foreground line-through decoration-red-500/50">{item.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm mb-6 min-h-[3rem]">{item.description}</p>

                            <ul className="space-y-3 mb-8">
                                {item.features?.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <DynamicIcon name="Check" className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
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
                                className="w-full font-bold group-hover:scale-[1.02] transition-transform"
                            >
                                Thêm vào lộ trình của tôi
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
