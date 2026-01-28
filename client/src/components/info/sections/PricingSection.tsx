import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Check, Wallet, Zap, Crown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';

export const PricingSection = ({ section }: { section: Section }) => {
    const items = section.items || [];

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
            case 'Wallet': return <Wallet className="w-5 h-5" />;
            case 'Zap': return <Zap className="w-5 h-5" />;
            case 'Crown': return <Crown className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <section className="py-12 md:py-20 relative overflow-hidden" id={section.id}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />
            <div className="container mx-auto relative z-10">
                <StandardSectionHeader section={section} align="center" />

                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(items.length, 3)} gap-6 max-w-7xl mx-auto`}>
                    {items.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={cn(
                                "group relative p-8 rounded-[32px] border bg-card flex flex-col h-full transition-all duration-300 hover:shadow-xl",
                                item.tag === 'Best Value' ? "border-primary/50 ring-1 ring-primary/20 shadow-lg shadow-primary/5" : "border-border hover:border-primary/30"
                            )}
                        >
                            {item.tag && (
                                <div className={cn(
                                    "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-lg text-xs font-bold border shadow-sm whitespace-nowrap tracking-wide capitalize",
                                    item.tag === 'Best Value' ? "bg-red-600 text-white border-red-600 shadow-red-500/20" :
                                        item.tag === 'Phổ biến' ? "bg-primary text-white border-primary shadow-primary/20" :
                                            "bg-zinc-900 text-white border-zinc-800 shadow-black/20"
                                )}>
                                    {item.tag}
                                </div>
                            )}

                            {/* Header Section with standardized height for alignment */}
                            <div className="min-h-[160px] md:min-h-[180px] flex flex-col mb-4">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    {item.icon && getIcon(item.icon)}
                                    {item.title}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-4xl font-semibold tracking-tight">{item.price}</span>
                                    {item.originalPrice && (
                                        <span className="text-lg text-neutral-400 line-through font-medium ml-2">
                                            {item.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Features List - Line now aligns across cards */}
                            <div className="flex-1 flex flex-col border-t border-zinc-100 pt-8 mt-2">
                                {item.features && (
                                    <div className="space-y-4 mb-8">
                                        {item.features.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                                    <Check className="w-3.5 h-3.5 text-zinc-900" />
                                                </div>
                                                <span className="text-[13px] font-medium text-foreground/80 leading-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* CTA Button - Pushed to bottom */}
                                <div className="mt-auto">
                                    <Link href={item.link || '#'}>
                                        <Button
                                            as="div"
                                            variant={item.tag === 'Best Value' ? 'default' : 'outline'}
                                            className={cn(
                                                "w-full text-sm font-semibold h-12 rounded-xl transition-all shadow-sm",
                                                item.tag === 'Best Value' ? "shadow-primary/25" : "group-hover:bg-primary group-hover:text-white"
                                            )}
                                        >
                                            {item.ctaText || 'Chọn gói này'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
