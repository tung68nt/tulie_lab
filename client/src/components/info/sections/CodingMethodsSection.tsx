import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { DEFAULT_LANDING_PAGE_SECTIONS, DEFAULT_HOME_SECTIONS } from '@/lib/defaultContent';

interface CodingMethodsSectionProps {
    section: Section;
}

export const CodingMethodsSection = ({ section }: CodingMethodsSectionProps) => {
    // FORCE UPDATE: Prefer DEFAULT content for this specific section type as it's complex
    // If section from props has valid complex items, use it. Otherwise fallback to DEFAULT.
    // Fix: Robust data loading logic
    // 1. If section has items with 'stepsDetail', use it (Complex content)
    // 2. Else if default home section exists and has items, use that
    // 3. Fallback to empty array to prevent crash

    // Check if current section has valid complex items
    const hasValidItems = section.items && section.items.length > 0 && section.items[0].stepsDetail;

    // Get default items from constant
    const defaultHomeSection = DEFAULT_HOME_SECTIONS.find(s => s.type === 'coding-methods');
    const defaultItems = defaultHomeSection?.items || [];

    // Decide which items to use
    // If we have valid items in props, use them.
    // If not, and we have default items, use them.
    const methods = hasValidItems ? section.items : (defaultItems.length > 0 ? defaultItems : []);

    // Config fallback
    const config = section.rowConfig || defaultHomeSection?.rowConfig || [
        { key: "feasibility", label: "Khả thi", icon: "Check" },
        { key: "goal", label: "Mục tiêu", icon: "Target" },
        { key: "ai_usage", label: "Cách dùng AI", icon: "Bot" },
        { key: "data", label: "Dữ liệu", icon: "Database" },
        { key: "limits", label: "Giới hạn", icon: "Ban" },
        { key: "output", label: "Sản phẩm đầu ra", icon: "Package" }
    ];

    const activeRowConfig = config;

    // Safety check: if no methods or empty items, we can either render fallback or nothing.
    // However, above logic guarantees 'methods' is at least an empty array.
    // Re-check valid array to satisfy TS if needed, though 'methods' is typed as any[] | SectionItem[] usually.
    // Let's ensure it's iterable.
    const safeMethods = Array.isArray(methods) ? methods : [];

    if (safeMethods.length === 0) {
        console.warn("CodingMethodsSection: No methods found to render.");
        // Optional: Render a placeholder or return null
    }

    const renderDifficulty = (level: number, text: string) => {
        // level 0 -> 1 bar, level 4 -> 5 bars
        const bars = 5;
        const activeBars = level + 1;

        let colorClass = "bg-green-500";
        if (level === 2) colorClass = "bg-yellow-500";
        if (level >= 3) colorClass = "bg-red-500";

        return (
            <div className="flex flex-col gap-2 w-full items-center">
                <div className="flex gap-1 h-1.5 w-24">
                    {[...Array(bars)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-full bg-secondary/50",
                                i < activeBars ? colorClass : ""
                            )}
                        />
                    ))}
                </div>
                <div className="text-center font-medium h-10 flex items-start justify-center">
                    {text.replace(/✅|⚠️/g, '').trim()}
                </div>
            </div>
        );
    };

    const renderStepContent = (key: string, detail: string, levelIndex: number) => {
        if (key === 'feasibility') {
            return renderDifficulty(levelIndex, detail);
        }

        if (key === 'output' && detail) {
            return (
                <ul className="list-disc pl-4 space-y-1.5 text-left text-sm text-foreground">
                    {detail.split(/[,.]/).map((item: string, i: number) => {
                        const trimmed = item.trim();
                        if (!trimmed) return null;
                        return (
                            <li key={i} className="leading-snug marker:text-foreground/50">
                                {trimmed}
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return <span className="text-sm text-foreground">{detail}</span>;
    };

    return (
        <section className="py-24 bg-background text-foreground overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {section.showDotPattern !== false && <DotPatternBackground />}
            </div>
            <div className="container relative z-10">
                <StandardSectionHeader section={section} align="center" />

                {/* RESPONSIVE TABLE VIEW: Scrollable on mobile, Grid on desktop */}
                <div className="overflow-x-auto pb-4 -mx-4 px-4">
                    <div className="min-w-[800px] md:min-w-[1000px] border border-border rounded-[32px] overflow-hidden bg-card/50 shadow-sm relative">
                        {/* Table Header */}
                        <div className="grid grid-cols-[100px_repeat(5,1fr)] md:grid-cols-[120px_repeat(5,1fr)] divide-x divide-border border-b border-border bg-muted/30">
                            <div className="p-4 md:p-6 flex items-center justify-center font-medium text-foreground/80 sticky left-0 bg-background/95 backdrop-blur-sm z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)]">
                                Tiêu chí
                            </div>
                            {safeMethods.map((method: any, idx: number) => (
                                <div key={method.id || idx} className="p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 text-center relative group h-full justify-start min-w-[140px]">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

                                    <div className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-1 md:mb-2",
                                        "bg-zinc-900 dark:bg-zinc-800"
                                    )}>
                                        <DynamicIcon name={method.icon || 'Code'} className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base md:text-lg leading-tight">{method.name}</h3>
                                        <p className="text-[10px] md:text-xs text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">{method.subtitle}</p>
                                    </div>
                                    <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] md:text-xs font-bold mt-auto whitespace-nowrap">
                                        {method.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-border">
                            {activeRowConfig?.map((row: any) => {
                                return (
                                    <div key={row.key} className="grid grid-cols-[100px_repeat(5,1fr)] md:grid-cols-[120px_repeat(5,1fr)] divide-x divide-border hover:bg-muted/5 transition-colors group/row">
                                        {/* Row Header - Sticky */}
                                        <div className="p-4 md:p-6 flex flex-col items-center justify-start gap-2 bg-background/95 backdrop-blur-sm sticky left-0 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)] group-hover/row:bg-muted/20 transition-colors">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground shrink-0">
                                                <DynamicIcon name={row.icon || 'CheckCircle'} className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                            <span className="font-bold text-xs md:text-sm text-center line-clamp-2">{row.label}</span>
                                        </div>

                                        {/* Cells */}
                                        {safeMethods.map((method: any, methodIdx: number) => {
                                            const step = method.stepsDetail?.[row.key];
                                            if (step?.status === 'skip') return <div key={`${method.id || methodIdx}-${row.key}`} className="p-3 md:p-4 bg-muted/5 min-w-[140px]" />;

                                            return (
                                                <div key={`${method.id}-${row.key}`} className={cn(
                                                    "p-3 md:p-4 text-xs md:text-sm text-foreground/90 flex justify-center h-full min-w-[140px]",
                                                    row.key === 'feasibility' ? "items-center" : "items-start"
                                                )}>
                                                    <div className="text-left w-full">
                                                        {step ? renderStepContent(row.key, step.detail, methodIdx) : '-'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile hint */}
                <div className="lg:hidden text-center mt-4 text-xs text-muted-foreground animate-pulse">
                    ← Vuốt để xem chi tiết so sánh →
                </div>
            </div>
        </section>
    );
};

