import { Section } from '@/types/sections';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { SectionTag } from '@/components/SectionTag';
import { cn } from '@/lib/utils';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export const ContentSection = ({ section }: { section: Section }) => {
    // Simple markdown-like rendering
    const renderContent = (content: string) => {
        return content.split('\n\n').map((paragraph, i) => {
            // Check for headers
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={i} className="font-bold text-xl md:text-2xl mt-8 mb-4 tracking-tight text-foreground">{paragraph.replace(/\*\*/g, '')}</h3>;
            }

            // Check for list items
            if (paragraph.includes('✅') || paragraph.includes('❌') || paragraph.includes('•') || paragraph.trim().startsWith('-')) {
                const lines = paragraph.split('\n').filter(line => line.trim());
                return (
                    <div key={i} className="my-8 space-y-5">
                        {lines.map((line, j) => {
                            let content = line.trim();
                            let icon = <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />;

                            // Check for "Title - Description" pattern to bold the title
                            let title = "";
                            let desc = content;

                            if (content.startsWith('•') || content.startsWith('-')) {
                                content = content.substring(1).trim();
                                icon = <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />;

                                // Try to split by " - " or ": " to separate title
                                const splitIndex = content.indexOf(' - ');
                                if (splitIndex !== -1) {
                                    title = content.substring(0, splitIndex);
                                    desc = content.substring(splitIndex + 3);
                                } else if (content.indexOf(': ') !== -1) {
                                    const idx = content.indexOf(': ');
                                    title = content.substring(0, idx);
                                    desc = content.substring(idx + 2);
                                } else {
                                    desc = content;
                                }
                            } else if (content.startsWith('✅')) {
                                content = content.replace('✅', '').trim();
                                icon = <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />;
                            } else if (content.startsWith('❌')) {
                                content = content.replace('❌', '').trim();
                                icon = <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs text-red-500 font-bold">✕</span></div>;
                            }

                            return (
                                <div key={j} className="flex items-start gap-4 group">
                                    <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                                        {icon}
                                    </div>
                                    <p className="leading-relaxed text-lg text-muted-foreground">
                                        {title && <span className="font-bold text-foreground block mb-1">{title}</span>}
                                        {desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            // Regular paragraph with bold text support
            const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
            return (
                <p key={i} className="mb-6 leading-relaxed text-lg text-muted-foreground">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, '')}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <section className={cn(
            "relative py-32 overflow-hidden bg-background",
            section.className
        )}>
            {section.showDotPattern !== false && <DotPatternBackground />}

            <div className="container relative z-10 mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-20">
                        {section.tag && (
                            <SectionTag className="mb-8">
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                {section.tag}
                            </SectionTag>
                        )}

                        {section.title && (
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white py-2">
                                {section.title}
                            </h2>
                        )}

                        {section.subtitle && (
                            <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-2xl">
                                {section.subtitle}
                            </p>
                        )}
                    </div>

                    <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none">
                        {renderContent(section.content || '')}
                    </div>
                </div>
            </div>
        </section>
    );
};

