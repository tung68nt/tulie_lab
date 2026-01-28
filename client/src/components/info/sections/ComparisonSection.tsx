import { Section } from '@/types/sections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Check } from 'lucide-react';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

import { SectionBackground } from '../SectionBackground';

export function ComparisonSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-12 relative overflow-hidden">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />
            <div className="container relative z-10">
                <StandardSectionHeader
                    section={section}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                    {section.items?.map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <Card className={`h-full border flex flex-col rounded-[32px] transition-all duration-300 ${index === 1 ? 'border-primary shadow-xl scale-105 z-10' : 'border-border hover:border-primary/50'}`}>
                                <CardHeader className={`${index === 1 ? 'bg-primary/5' : ''} p-6 pb-2 rounded-t-[32px]`}>
                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                                            {index === 1 && (
                                                <span className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
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
                                    {item.description && <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>}
                                </CardHeader>
                                <CardContent className="p-6 pt-2 flex-1">
                                    <div className="h-px w-full bg-border/50 mb-6" />
                                    <ul className="space-y-4">
                                        {Array.isArray(item.features) && item.features.map((feat: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                {index === 1 ? (
                                                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                ) : (
                                                    <span className="text-muted-foreground/50 text-xl leading-none mt-[-2px]">•</span>
                                                )}
                                                <span className={`text-sm ${index === 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
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
            </div>
        </section>
    );
}
