import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import { MonitorPlay, Check, Users, MessageCircle, Video } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';

export const FeatureGridSection = ({ section }: { section: Section }) => {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-100">
                <div className="absolute inset-0 bg-dot-white"></div>
                {/* Radial gradient for fading edges */}
                <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    {section.icon && (
                        <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-800 shadow-lg">
                            <DynamicIcon name={section.icon} className="w-8 h-8 text-white" />
                        </div>
                    )}

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{section.title}</h2>
                    <p className="text-xl text-neutral-400">{section.subtitle}</p>
                </div>

                {/* Dynamic Cards */}
                <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-16">
                    {section.items?.map((item, idx) => (
                        <div key={idx} className="flex-1 min-w-[280px] max-w-[350px] bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-8 rounded-2xl text-center hover:border-neutral-700 transition-colors">
                            {item.icon && (
                                <div className="mb-4 flex justify-center">
                                    <DynamicIcon name={item.icon} className="w-10 h-10 text-primary" />
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-neutral-400 text-sm mb-1">{item.subtitle}</p>
                            <p className="text-neutral-500 text-xs">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* Optional Bottom Content */}
                {section.content && (
                    <div className="max-w-5xl mx-auto bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 md:p-10 text-center text-neutral-300">
                        {section.content}
                    </div>
                )}
            </div>
        </section>
    );
};
