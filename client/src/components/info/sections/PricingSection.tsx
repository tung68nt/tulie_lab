import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Check, Wallet, Zap, Crown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <section className="container py-12 md:py-20" id={section.id}>
            {(section.title || section.subtitle) && (
                <div className="text-center mb-12 space-y-4">
                    {section.title && <h2 className="text-3xl md:text-5xl font-bold">{section.title}</h2>}
                    {section.subtitle && <p className="text-xl text-muted-foreground">{section.subtitle}</p>}
                </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(items.length, 3)} gap-6 max-w-7xl mx-auto`}>
                {items.map((item: any, index: number) => (
                    <div
                        key={index}
                        className={cn(
                            "group relative p-8 rounded-3xl border bg-card flex flex-col h-full transition-all duration-300 hover:shadow-xl",
                            item.tag === 'Best Value' ? "border-primary/50 ring-1 ring-primary/20 shadow-lg shadow-primary/5" : "border-border hover:border-primary/30"
                        )}
                    >
                        {item.tag && (
                            <div className={cn(
                                "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold border shadow-sm whitespace-nowrap uppercase tracking-wider",
                                item.tag === 'Best Value' ? "bg-red-600 text-white border-red-600" :
                                    item.tag === 'Phổ biến' ? "bg-primary text-white border-primary" :
                                        "bg-zinc-900 text-white border-zinc-800"
                            )}>
                                {item.tag}
                            </div>
                        )}

                        <div className="mb-8 mt-4">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                {item.icon && getIcon(item.icon)}
                                {item.title}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-4xl font-bold tracking-tight">{item.price}</span>
                                {item.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through font-medium ml-2">
                                        {item.originalPrice}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {item.description}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto mb-8">
                            <Link href={item.link || '#'}>
                                <Button
                                    as="div"
                                    variant={item.tag === 'Best Value' ? 'default' : 'outline'}
                                    className={cn(
                                        "w-full text-sm font-bold h-12 rounded-xl transition-all shadow-sm",
                                        item.tag === 'Best Value' ? "shadow-primary/25" : "group-hover:bg-primary group-hover:text-white"
                                    )}
                                >
                                    {item.ctaText || 'Chọn gói này'}
                                </Button>
                            </Link>
                        </div>

                        {/* Features List */}
                        {item.features && (
                            <div className="space-y-3 pt-6 border-t border-border">
                                {item.features.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground/80 leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
