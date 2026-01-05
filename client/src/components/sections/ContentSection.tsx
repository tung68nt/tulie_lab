
import { Section } from '@/types/sections';

export const ContentSection = ({ section }: { section: Section }) => {
    // Simple markdown-like rendering
    const renderContent = (content: string) => {
        return content.split('\n\n').map((paragraph, i) => {
            // Check for headers
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={i} className="font-bold text-xl mt-6 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
            }

            // Check for list items
            if (paragraph.includes('✅') || paragraph.includes('❌') || paragraph.includes('•') || paragraph.trim().startsWith('-')) {
                const lines = paragraph.split('\n').filter(line => line.trim());
                return (
                    <div key={i} className="my-6 space-y-4">
                        {lines.map((line, j) => {
                            let content = line.trim();
                            let icon = null;

                            if (content.startsWith('•') || content.startsWith('-')) {
                                content = content.substring(1).trim();
                                icon = <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />;
                            } else if (content.startsWith('✅')) {
                                content = content.replace('✅', '').trim();
                                icon = <span className="mt-1 shrink-0">✅</span>;
                            } else if (content.startsWith('❌')) {
                                content = content.replace('❌', '').trim();
                                icon = <span className="mt-1 shrink-0">❌</span>;
                            }

                            return (
                                <div key={j} className="flex items-start gap-3">
                                    {icon || <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                                    <p className="leading-relaxed">{content}</p>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            // Regular paragraph with bold text support
            const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
            return (
                <p key={i} className="mb-4 leading-relaxed">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <section className="container py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text content */}
                <div className="space-y-6">
                    {section.subtitle && (
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                {section.subtitle}
                            </span>
                        </div>
                    )}
                    {section.title && (
                        <h2 className="text-3xl md:text-4xl font-bold">{section.title}</h2>
                    )}
                    {section.content && (
                        <div className="text-muted-foreground text-base md:text-lg">
                            {renderContent(section.content)}
                        </div>
                    )}
                </div>

                {/* Image */}
                {section.image && (
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl blur-xl opacity-50"></div>
                        <img
                            src={section.image}
                            alt={section.title || 'Content image'}
                            className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};
