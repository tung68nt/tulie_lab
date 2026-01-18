import { Section } from '@/types/sections';
import { CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

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
                                    <p className="leading-relaxed text-base text-muted-foreground">
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
        <section className="container py-24 md:py-32 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Text content */}
                <div className="order-2 lg:order-1 space-y-8">
                    {section.subtitle && (
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                                <Terminal className="w-4 h-4 text-foreground" />
                                <span className="text-foreground/80">{section.subtitle}</span>
                            </span>
                        </div>
                    )}

                    <div className="space-y-6">
                        {section.title && (
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground relative">
                                {section.title}
                                <span className="absolute -z-10 top-0 left-0 w-20 h-20 bg-primary/20 blur-3xl rounded-full opacity-50"></span>
                            </h2>
                        )}
                        {section.content && (
                            <div>
                                {renderContent(section.content)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Image */}
                {section.image && (
                    <div className="relative order-1 lg:order-2 group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/20 to-blue-500/20 rounded-[2.5rem] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700 ease-out">
                            <img
                                src={section.image}
                                alt={section.title || 'Content image'}
                                className="w-full object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
