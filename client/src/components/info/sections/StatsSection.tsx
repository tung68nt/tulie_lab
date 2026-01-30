import { Section } from '@/types/sections';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

import { SectionBackground } from '../SectionBackground';

export function StatsSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-16 bg-background relative">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                glowVariant={6}
            />
            <div className="container relative z-10">
                <FadeIn direction="up">
                    <StandardSectionHeader
                        section={section}
                    />
                </FadeIn>

                <div className={`grid gap-6 ${section.items && section.items.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                    section.items && section.items.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
                        section.items && section.items.length === 3 ? 'grid-cols-1 md:grid-cols-3 justify-center' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    }`}>
                    {section.items?.map((item, index) => (
                        <FadeIn
                            key={index}
                            delay={index * 0.1}
                            className="h-full"
                        >
                            <div
                                className="bg-card border border-border/50 hover:border-primary/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden h-full"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                    <DynamicIcon name={item.icon || 'Star'} className="h-32 w-32" />
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-8 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <DynamicIcon name={item.icon || 'Star'} className="h-8 w-8" strokeWidth={2} />
                                    </div>

                                    <h3 className={cn(
                                        "text-2xl font-bold mb-4",
                                        section.backgroundTheme === 'dark' ? "text-white" : "text-zinc-950 dark:text-white"
                                    )}>
                                        {String(item.title || '')}
                                    </h3>
                                    <p className={cn(
                                        "text-lg leading-relaxed",
                                        section.backgroundTheme === 'dark' ? "text-zinc-400" : "text-zinc-400 dark:text-zinc-400"
                                    )}>
                                        {String(item.description || item.label || '')}
                                    </p>
                                    {Boolean(item.value) && (
                                        <p className="text-4xl font-bold text-primary mt-6">{String(item.value)}</p>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
