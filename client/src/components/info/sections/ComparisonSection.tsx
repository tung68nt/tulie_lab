import { Section } from '@/types/sections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Check } from 'lucide-react';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export function ComparisonSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-12 bg-background relative overflow-hidden">
            {section.showDotPattern !== false && <DotPatternBackground />}
            <div className="container relative z-10">
                <StandardSectionHeader
                    section={section}
                    tagOverride={section.subtitle}
                    subtitleOverride={section.content}
                />

                <div className="flex flex-wrap justify-center gap-10">
                    {section.items?.map((item, index) => (
                        <div key={index} className={`w-full lg:w-[calc(50%-20px)] flex flex-col`}>
                            <Card className={`h-full border flex flex-col rounded-[56px] ${index === 1 ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'}`}>
                                <CardHeader className={`${index === 1 ? 'bg-primary/5' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="text-xl md:text-2xl">{item.title}</CardTitle>
                                        {index === 1 && (
                                            <span className="inline-block rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">
                                                ĐƯỢC ĐỀ XUẤT
                                            </span>
                                        )}
                                    </div>
                                    {item.price && (
                                        <div className="text-3xl font-bold text-primary">
                                            {item.price}
                                        </div>
                                    )}
                                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                                </CardHeader>
                                <CardContent className="pt-6 flex-1">
                                    <ul className="space-y-3">
                                        {Array.isArray(item.features) && item.features.map((feat: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2">
                                                {index === 1 ? (
                                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                                ) : (
                                                    <span className="text-muted-foreground scale-150 leading-tight">•</span>
                                                )}
                                                <span className={index === 1 ? 'font-medium' : 'text-muted-foreground'}>
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
