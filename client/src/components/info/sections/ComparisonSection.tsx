import { Section } from '@/types/sections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Check } from 'lucide-react';

export function ComparisonSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-12 bg-background bg-dot-grid-light">
            <div className="container">
                <div className="text-center mb-12">
                    {section.subtitle && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground mb-4 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-800 dark:bg-zinc-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800 dark:bg-white"></span>
                            </span>
                            {section.subtitle}
                        </div>
                    )}
                    <h2 className="text-3xl font-bold md:text-4xl mb-4">
                        {section.title}
                    </h2>
                    {section.content && (
                        <p className="mx-auto text-muted-foreground md:text-lg">
                            {section.content}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {section.items?.map((item, index) => (
                        <div key={index} className={`w-full lg:w-[calc(50%-12px)] flex flex-col`}>
                            <Card className={`h-full border flex flex-col ${index === 1 ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'}`}>
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
