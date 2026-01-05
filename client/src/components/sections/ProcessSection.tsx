import { Section } from '@/types/sections';

// Helper to chunk array
const chunk = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

export function ProcessSection({ section }: { section: Section }) {
    const rows = chunk(section.items || [], 4);

    return (
        <section className="w-full py-12 bg-secondary/30 text-foreground overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16">

                    {section.subtitle && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-4">
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
                </div>

                <div className="flex flex-col gap-16 relative">
                    {rows.map((rowItems, rIndex) => {
                        const isEven = rIndex % 2 === 0; // LTR
                        const isLastRow = rIndex === rows.length - 1;

                        return (
                            <div key={rIndex} className={`flex flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''} relative gap-8 md:gap-0`}>
                                {/* Horizontal Connector Line (Desktop) */}
                                {/* Connects the centers of items in this row */}
                                <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-border -z-10"></div>

                                {/* Vertical Turn Connector to NEXT row */}
                                {!isLastRow && (
                                    <div
                                        className={`hidden md:block absolute top-8 w-24 h-[calc(100%+4rem)] border-border border-y-2 -z-10
                                            ${isEven
                                                ? 'right-[12.5%] border-r-2 rounded-r-[48px] border-l-0 translate-x-1/2'
                                                : 'left-[12.5%] border-l-2 rounded-l-[48px] border-r-0 -translate-x-1/2'
                                            }
                                        `}
                                    ></div>
                                )}

                                {rowItems.map((item, i) => {
                                    // Calculate global index: 
                                    // If Even (LTR): rIndex*4 + i
                                    // If Odd (RTL): rIndex*4 + i (Wait, flex-row-reverse strictly purely visual, so source order is still correct?)
                                    // Yes, flex-row-reverse renders sources [0,1,2,3] as 3 2 1 0.
                                    // Our chunk [5,6,7,8]. Rendered as 8 7 6 5.
                                    // So "5" is indeed on the Right.
                                    // So standard mapping order is fine.
                                    const globalIndex = rIndex * 4 + i;

                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center text-center group min-w-0 px-2">
                                            <div className="w-16 h-16 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-sm group-hover:border-primary group-hover:shadow-md transition-all z-10 relative">
                                                {globalIndex + 1}
                                            </div>
                                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
                                                {item.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
