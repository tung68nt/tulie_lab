import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/DynamicIcon';
import { DEFAULT_LANDING_PAGE_SECTIONS, DEFAULT_HOME_SECTIONS } from '@/lib/defaultContent';

interface CodingMethodsSectionProps {
    section: Section;
}

export const CodingMethodsSection = ({ section }: CodingMethodsSectionProps) => {
    // FORCE UPDATE: Prefer DEFAULT content for this specific section type as it's complex
    // If section from props has valid complex items, use it. Otherwise fallback to DEFAULT.
    const hasComplexContent = section.items && section.items.length > 0 && section.items[0].stepsDetail;

    const targetSection = hasComplexContent
        ? section
        : DEFAULT_HOME_SECTIONS.find(s => s.type === 'coding-methods') || DEFAULT_LANDING_PAGE_SECTIONS.find(s => s.type === 'coding-methods');

    const defaultMethodsSection = DEFAULT_HOME_SECTIONS.find(s => s.type === 'coding-methods');

    // Fallback rowConfig: Use section's config, or default config, or hardcoded basic config as last resort
    const rowConfig = targetSection?.rowConfig || defaultMethodsSection?.rowConfig || [
        { key: "feasibility", label: "Khả thi", icon: "CheckCircle" },
        { key: "goal", label: "Mục tiêu", icon: "Target" },
        { key: "ai_usage", label: "Cách dùng AI", icon: "Bot" },
        { key: "data", label: "Dữ liệu", icon: "Database" },
        { key: "limits", label: "Giới hạn", icon: "AlertTriangle" },
        { key: "output", label: "Sản phẩm đầu ra", icon: "Package" }
    ];

    const methods = targetSection?.items || [];

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
                <ul className="list-disc pl-4 space-y-1.5 text-left">
                    {detail.split(/[,.]/).map((item: string, i: number) => {
                        const trimmed = item.trim();
                        if (!trimmed) return null;
                        return (
                            <li key={i} className="leading-snug">
                                {trimmed}
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return detail;
    };

    return (
        <section className="py-24 bg-background text-foreground overflow-hidden">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white py-2">{section.title}</h2>
                    <p className="text-xl text-muted-foreground">{section.subtitle}</p>
                </div>

                {/* DESKTOP VIEW: Comparison Table (Hidden on Mobile, Visible on LG+) */}
                <div className="hidden lg:block overflow-x-auto pb-4">
                    <div className="min-w-[1000px] border border-border rounded-2xl overflow-hidden bg-card/50 shadow-sm">
                        {/* Table Header */}
                        <div className="grid grid-cols-[120px_repeat(5,1fr)] divide-x divide-border border-b border-border bg-muted/30">
                            <div className="p-6 flex items-center justify-center font-bold text-muted-foreground">
                                Tiêu chí
                            </div>
                            {methods.map((method, idx) => (
                                <div key={method.id} className="p-6 flex flex-col items-center gap-4 text-center relative group h-full justify-start">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-2",
                                        "bg-gradient-to-br",
                                        method.color || "from-gray-700 to-gray-900"
                                    )}>
                                        <DynamicIcon name={method.icon || 'Code'} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{method.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{method.subtitle}</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold mt-auto">
                                        {method.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-border">
                            {rowConfig.map((row) => {
                                return (
                                    <div key={row.key} className="grid grid-cols-[120px_repeat(5,1fr)] divide-x divide-border hover:bg-muted/10 transition-colors">
                                        {/* Row Header */}
                                        <div className="p-6 flex flex-col items-center justify-start gap-2 bg-muted/10">
                                            <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground shrink-0">
                                                <DynamicIcon name={row.icon || 'CheckCircle'} className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-sm text-center">{row.label}</span>
                                        </div>

                                        {/* Cells */}
                                        {methods.map((method, methodIdx) => {
                                            const step = method.stepsDetail?.[row.key];
                                            if (step?.status === 'skip') return <div key={`${method.id}-${row.key}`} className="p-4 bg-muted/5" />;

                                            return (
                                                <div key={`${method.id}-${row.key}`} className={cn(
                                                    "p-4 text-sm text-foreground/90 flex justify-center h-full",
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

                {/* MOBILE/TABLET VIEW: Stacked Cards (Visible on Mobile/Tablet, Hidden on Desktop) */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                    {methods.map((method, idx) => (
                        <div
                            key={method.id}
                            className="flex flex-col bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                                        "bg-gradient-to-br",
                                        method.color || "from-gray-700 to-gray-900"
                                    )}>
                                        <DynamicIcon name={method.icon || 'Code'} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-xl">{method.name}</h3>
                                            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                                                {method.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                                    </div>
                                </div>
                                <span className="text-4xl font-bold text-muted/10">0{idx + 1}</span>
                            </div>

                            <div className="space-y-4">
                                {rowConfig.map((row) => {
                                    const step = method.stepsDetail?.[row.key];
                                    if (step?.status === 'skip') return null;

                                    return (
                                        <div key={row.key} className="flex gap-3 text-sm">
                                            <div className="shrink-0 mt-0.5 text-muted-foreground">
                                                <DynamicIcon name={row.icon || 'CheckCircle'} className="w-4 h-4" />
                                            </div>
                                            <div className="w-full">
                                                <span className="font-bold text-foreground/80 block mb-1">{row.label}</span>
                                                <div className="text-foreground/90 leading-relaxed">
                                                    {step ? renderStepContent(row.key, step.detail, idx) : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
