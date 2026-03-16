'use client';

import { Section } from '@/types/sections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Check } from 'lucide-react';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/animations/FadeIn';

import { SectionBackground } from '../SectionBackground';

export function ComparisonSection({ section }: { section: Section }) {
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "w-full py-14 md:py-24 relative",
            isDark ? "bg-[#050505] text-white" : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
                glowVariant={11}
            />
            <div className="container relative z-10">
                <StandardSectionHeader
                    section={section}
                />

                <FadeIn direction="up" delay={0.4} duration={0.6}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                        {section.items?.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <Card className={cn(
                                    "h-full border flex flex-col rounded-3xl transition-all duration-300",
                                    section.backgroundTheme === 'dark'
                                        ? "bg-zinc-900/50 border-white/10 text-white"
                                        : "bg-background border-border",
                                    index === 1 ? 'border-primary shadow-xl scale-105 z-10' : 'hover:border-primary/50'
                                )}>
                                    <CardHeader className={cn(
                                        "p-6 pb-2",
                                        index === 1 && (section.backgroundTheme === 'dark' ? 'bg-primary/10' : 'bg-primary/5')
                                    )}>
                                        <div className="flex flex-col gap-2 mb-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <CardTitle className={cn(
                                                    "text-xl font-bold",
                                                    section.backgroundTheme === 'dark' ? "text-zinc-50" : "text-foreground"
                                                )}>
                                                    {item.title}
                                                </CardTitle>
                                                {index === 1 && (
                                                    <span className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold whitespace-nowrap">
                                                        Được đề xuất
                                                    </span>
                                                )}
                                            </div>
                                            {item.price && (
                                                <div className="text-3xl font-bold text-primary mt-1">
                                                    {item.price}
                                                </div>
                                            )}
                                        </div>
                                        {item.description && (
                                            <p className={cn(
                                                "text-sm leading-relaxed",
                                                section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-muted-foreground"
                                            )}>
                                                {item.description}
                                            </p>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2 flex-1">
                                        <div className={cn(
                                            "h-px w-full mb-6",
                                            section.backgroundTheme === 'dark' ? "bg-white/10" : "bg-border/50"
                                        )} />
                                        <ul className="space-y-4">
                                            {Array.isArray(item.features) && item.features.map((feat: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    {index === 1 ? (
                                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                    ) : (
                                                        <span className={cn(
                                                            "text-xl leading-none mt-[-2px]",
                                                            section.backgroundTheme === 'dark' ? "text-zinc-500" : "text-zinc-300"
                                                        )}>•</span>
                                                    )}
                                                    <span className={cn(
                                                        "text-sm",
                                                        index === 1
                                                            ? (section.backgroundTheme === 'dark' ? "font-medium text-zinc-100" : "font-medium text-foreground")
                                                            : (section.backgroundTheme === 'dark' ? "text-zinc-300" : "text-muted-foreground")
                                                    )}>
                                                        {feat}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
