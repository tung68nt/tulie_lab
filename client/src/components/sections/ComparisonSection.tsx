import { Section } from '@/types/sections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export function ComparisonSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-12 bg-background">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    {section.subtitle && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {section.subtitle}
                        </div>
                    )}
                    <h2 className="text-3xl font-bold md:text-4xl mb-4">
                        {section.title}
                    </h2>
                    {section.content && (
                        <p className="max-w-[800px] mx-auto text-muted-foreground md:text-lg">
                            {section.content}
                        </p>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
                    {section.items?.map((item, index) => (
                        <Card key={index} className={`border-2 ${index === 1 ? 'border-primary shadow-xl scale-105' : 'border-border'}`}>
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
                            <CardContent className="pt-6">
                                <ul className="space-y-3">
                                    {item.features?.map((feat: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            {index === 1 ? (
                                                <span className="text-primary font-bold">✓</span>
                                            ) : (
                                                <span className="text-muted-foreground">•</span>
                                            )}
                                            <span className={index === 1 ? 'font-medium' : 'text-muted-foreground'}>
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
