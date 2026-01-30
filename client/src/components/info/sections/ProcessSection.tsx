import { Section } from '@/types/sections';

// Tailwind safelist for dynamic orders
const LG_ORDER_CLASSES = [
    'lg:order-1', 'lg:order-2', 'lg:order-3', 'lg:order-4',
    'lg:order-5', 'lg:order-6', 'lg:order-7', 'lg:order-8',
    'lg:order-9', 'lg:order-10', 'lg:order-11', 'lg:order-12',
    'lg:order-last'
];

interface ProcessSectionProps {
    section: Section;
    variant?: 'snake' | 'grid' | string;
}

import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';

export const ProcessSection = ({ section, variant = 'grid' }: ProcessSectionProps) => {
    if (!section.items) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                glowVariant={10}
            />
            <div className="container relative z-10">
                <StandardSectionHeader section={section} align="center" />

                {/* Decorative Background Elements */}
                <div className="absolute top-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />


                {variant === 'snake' ? (
                    // SNAKE LAYOUT (4 Columns, Zig-Zag)
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative isolate">
                        {section.items.map((item, idx) => {
                            const isLastItem = idx === section.items!.length - 1;
                            const row = Math.floor(idx / 4) + 1;
                            const isEvenRow = row % 2 === 0;
                            const lgOrderIndex = isEvenRow
                                ? (Math.floor(idx / 4) * 4) + (4 - (idx % 4))
                                : idx + 1;
                            const orderClass = LG_ORDER_CLASSES[lgOrderIndex - 1] || 'lg:order-last';
                            const visualCol = isEvenRow ? 4 - (idx % 4) : (idx % 4) + 1;
                            const snakeLineRight = !isEvenRow && visualCol < 4 && !isLastItem;
                            const snakeLineLeft = isEvenRow && visualCol > 1 && !isLastItem;
                            const snakeLineDown = (
                                (!isEvenRow && visualCol === 4) ||
                                (isEvenRow && visualCol === 1)
                            ) && !isLastItem;

                            return (
                                <FadeIn key={idx} delay={idx * 0.1}>
                                    <div className={`relative group ${orderClass}`}>
                                        {/* Connectors */}
                                        <div className="hidden lg:block absolute top-[2.5rem] left-0 w-full -z-10 h-1">
                                            {snakeLineRight && <div className="absolute right-[-50%] top-0 w-full border-t-2 border-dashed border-muted-foreground/30" />}
                                            {snakeLineLeft && <div className="absolute left-[-50%] top-0 w-full border-t-2 border-dashed border-muted-foreground/30" />}
                                            {snakeLineDown && <div className="absolute left-1/2 top-0 h-[calc(100%+8rem)] w-0.5 border-l-2 border-dashed border-muted-foreground/30" />}
                                        </div>
                                        {!isLastItem && <div className="lg:hidden absolute top-20 left-1/2 w-0.5 h-16 bg-border/50 -z-10" />}
                                        {/* Circle */}
                                        <div className="w-20 h-20 rounded-full bg-background border-4 border-muted group-hover:border-primary transition-all duration-300 flex items-center justify-center mb-8 relative z-10 shadow-sm group-hover:shadow-lg scale-100 group-hover:scale-110 shrink-0">
                                            <span className="text-3xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        {/* Content */}
                                        <div className="w-full flex-1 p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                            <div className="text-muted-foreground text-sm whitespace-pre-line">{item.description}</div>
                                        </div>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                ) : (
                    // STANDARD GRID LAYOUT (Modern 4 Columns)
                    <div className={`grid gap-6 ${section.items.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                        section.items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                            section.items.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                        } justify-center`}>
                        {section.items.map((item, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1} className="h-full">
                                <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start h-full relative overflow-hidden">
                                    {/* Decorative Number */}
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="text-8xl font-bold text-primary">{idx + 1}</span>
                                    </div>

                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors z-10">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 z-10">{item.title}</h3>
                                    <div className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed z-10">{item.description}</div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </section >
    );
};
