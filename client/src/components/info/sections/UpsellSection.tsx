'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { DynamicIcon } from '@/components/DynamicIcon';

export function UpsellSection({ section, upsellCourse, upsellProduct, upsellPrice }: { section: Section; upsellCourse?: any; upsellProduct?: any; upsellPrice?: any }) {
    // If we have dynamic upsell items, we should prioritize them over static section items
    // But for now, let's merge them or replace if dynamic exists.
    // If upsellCourse or upsellProduct exists, we use them.

    let displayItems = section.items || [];

    if (upsellCourse || upsellProduct) {
        displayItems = [];
        if (upsellCourse) {
            displayItems.push({
                id: upsellCourse.id,
                title: upsellCourse.title,
                price: upsellPrice ? Number(upsellPrice).toLocaleString('vi-VN') + 'đ' : (upsellCourse.salePrice ? Number(upsellCourse.salePrice).toLocaleString('vi-VN') + 'đ' : Number(upsellCourse.price).toLocaleString('vi-VN') + 'đ'),
                originalPrice: upsellCourse.salePrice ? Number(upsellCourse.price).toLocaleString('vi-VN') + 'đ' : undefined,
                description: upsellCourse.description || 'Ưu đãi đặc biệt dành riêng cho bạn.',
                ctaText: 'Đăng ký ngay',
                icon: 'BookOpen',
                color: 'from-blue-100 to-blue-200'
            });
        }
        if (upsellProduct) {
            displayItems.push({
                id: upsellProduct.id,
                title: upsellProduct.name,
                price: upsellPrice ? Number(upsellPrice).toLocaleString('vi-VN') + 'đ' : (upsellProduct.price ? Number(upsellProduct.price).toLocaleString('vi-VN') + 'đ' : '0đ'),
                originalPrice: undefined,
                description: upsellProduct.description || 'Module bổ trợ cực kỳ hấp dẫn.',
                ctaText: 'Thêm vào giỏ hàng',
                icon: 'Package',
                color: 'from-purple-100 to-purple-200'
            });
        }
    }

    if (!displayItems || displayItems.length === 0) return null;

    return (
        <section className="py-16 bg-background border-t border-border/50">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground">{section.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                                className={`w-full font-bold group-hover:scale-[1.02] transition-transform ${isRetail ? "bg-white text-black border-2 border-black hover:bg-gray-50" : ""}`}
                            >
                                {item.ctaText || "Thêm vào lộ trình của tôi"}
                            </Button>
                        );

                        return (
                            <div key={item.id || index} className="relative group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col">
                                {item.tag && (
                                    <div className={`absolute -top-3 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 uppercase ${isRetail ? "bg-gray-200 text-gray-800" : "bg-black text-white"}`}>
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

                                <ul className="space-y-3 mb-8 flex-1">
                                    {item.features?.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <DynamicIcon name="Check" className="w-4 h-4 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {item.link && item.link !== '#payment' ? (
                                    <Link href={item.link} className="w-full block">
                                        {ButtonComponent}
                                    </Link>
                                ) : ButtonComponent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
