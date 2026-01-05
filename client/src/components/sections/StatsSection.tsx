import { Section } from '@/types/sections';

export function StatsSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-12 bg-secondary/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    {section.subtitle && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {section.subtitle}
                        </div>
                    )}
                    <h2 className="text-3xl font-bold md:text-4xl">
                        {section.title}
                    </h2>
                    {section.content && (
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed whitespace-pre-line">
                            {section.content}
                        </p>
                    )}
                </div>

                <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {section.items?.map((item, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl bg-background p-6 md:p-8 shadow-sm transition-all hover:shadow-md border hover:border-primary/50">
                            <div className="flex items-center gap-4 mb-4">
                                {item.icon && (
                                    <div className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                        {/* Simple icon placeholder or we can use a huge icon set */}
                                        <span className="text-xl md:text-2xl">⚡</span>
                                    </div>
                                )}
                                <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                            </div>
                            {item.features && item.features.length > 0 ? (
                                <ul className="space-y-2">
                                    {item.features.map((feat: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">{item.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
