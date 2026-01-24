import { Section } from '@/types/sections';
import { DynamicIcon } from '@/components/DynamicIcon';

export function StatsSection({ section }: { section: Section }) {
    return (
        <section className="w-full py-16 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-black dark:bg-dot-white"></div>
            <div className="container relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    {section.subtitle && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground mb-8 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-800 dark:bg-zinc-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800 dark:bg-white"></span>
                            </span>
                            {section.subtitle}
                        </div>
                    )}
                    <h2 className="text-4xl font-bold md:text-6xl mb-8 text-foreground tracking-tight">
                        {section.title}
                    </h2>
                    {section.content && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {section.content}
                        </p>
                    )}
                </div>

                <div className={`grid gap-6 ${section.items && section.items.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                    section.items && section.items.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
                        section.items && section.items.length === 3 ? 'grid-cols-1 md:grid-cols-3 justify-center' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    }`}>
                    {section.items?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border/50 hover:border-primary/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <DynamicIcon name={item.icon || 'Star'} className="h-32 w-32" />
                            </div>

                            <div className="relative z-10">
                                <div className="mb-8 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <DynamicIcon name={item.icon || 'Star'} className="h-8 w-8" strokeWidth={2} />
                                </div>

                                <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {item.description || item.label}
                                </p>
                                {item.value && (
                                    <p className="text-4xl font-bold text-primary mt-6 tracking-tight">{item.value}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
