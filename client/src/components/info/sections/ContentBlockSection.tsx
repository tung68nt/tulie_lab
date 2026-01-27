import { Section } from '@/types/sections';
import Image from 'next/image';
import { DynamicIcon } from '@/components/DynamicIcon';
import { cn } from '@/lib/utils';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export function ContentBlockSection({ section }: { section: Section }) {
    if (!section.items) return null;

    return (
        <section className="py-20 bg-background overflow-hidden space-y-24 relative">
            {section.showDotPattern !== false && <DotPatternBackground />}
            <div className="container px-4 mx-auto space-y-24 relative z-10">
                {section.title && (
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.3] bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white pb-2">{section.title}</h2>
                        <p className="text-xl text-muted-foreground">{section.subtitle}</p>
                    </div>
                )}

                {section.items.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div key={index} className={cn("flex flex-col gap-12 items-center", isEven ? "lg:flex-row" : "lg:flex-row-reverse")}>
                            {/* Visual Side */}
                            <div className="w-full lg:w-1/2 relative">
                                <div className={cn(
                                    "relative aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl skew-y-1 transform transition-all duration-700 hover:skew-y-0",
                                    isEven ? "-rotate-1" : "rotate-1"
                                )}>
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title || 'Illustration'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <DynamicIcon name="Image" className="h-16 w-16 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                {/* Decorative elements */}
                                <div className={cn(
                                    "absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10",
                                    !isEven && "right-auto -left-12"
                                )} />

                                <div className={cn(
                                    "absolute top-1/2 -right-16 w-32 h-32 bg-dot-black/[0.1] -z-10 rounded-full",
                                    !isEven && "right-auto -left-16"
                                )} />
                            </div>

                            {/* Text Side */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="space-y-2">
                                    {item.subtitle && <span className="text-primary font-bold uppercase tracking-wider text-sm">{item.subtitle}</span>}
                                    <h3 className="text-2xl md:text-4xl font-bold leading-tight">{item.title}</h3>
                                </div>

                                <div className="text-lg text-muted-foreground leading-relaxed">
                                    {item.description}
                                </div>

                                {item.features && Array.isArray(item.features) && (
                                    <ul className="space-y-4 pt-4">
                                        {item.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <DynamicIcon name="Check" className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                                                </div>
                                                <span className="font-medium text-lg">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
