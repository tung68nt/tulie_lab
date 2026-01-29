import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { MonitorPlay, Check, Users, MessageCircle, Video } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';

export const FeatureGridSection = ({ section }: { section: Section }) => {
    const isDark = section.backgroundTheme !== 'light'; // Default to dark for this design

    return (
        <section className={cn(
            "py-24 flex items-center justify-center relative overflow-hidden transition-colors duration-300",
            isDark ? "bg-black text-white" : "bg-background text-foreground"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme || 'dark'}
                overlayOpacity={section.overlayOpacity}
            />

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <StandardSectionHeader section={section} />

                {/* Dynamic Cards */}
                <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-16">
                    {section.items?.map((item, idx) => (
                        <div key={idx} className="flex-1 min-w-[280px] max-w-[350px] bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-8 rounded-2xl text-center hover:border-neutral-700 transition-colors">
                            {item.icon && (
                                <div className="mb-6 flex justify-center overflow-visible">
                                    <DynamicIcon name={item.icon} size={48} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{String(item.title || '')}</h3>
                            <p className="text-neutral-400 text-sm mb-1">{String(item.subtitle || '')}</p>
                            <p className="text-neutral-500 text-xs">{String(item.description || '')}</p>
                        </div>
                    ))}
                </div>

                {/* Optional Bottom Content */}
                {Boolean(section.content) && (
                    <div className="max-w-5xl mx-auto bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 md:p-10 text-center text-neutral-300">
                        {String(section.content)}
                    </div>
                )}
            </div>
        </section>
    );
};
