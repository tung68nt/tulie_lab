'use client';

import { useState } from 'react';
import { Section } from '@/types/sections';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';

interface FAQItem {
    question: string;
    answer: string;
}

export function FAQSection({ section }: { section: Section }) {
    // Parse items if they are stored as JSON string or raw HTML conversion needed
    let items: FAQItem[] = [];

    if (section.items && Array.isArray(section.items)) {
        // Map SectionItem to FAQItem
        items = section.items.map((item: any) => ({
            question: item.title || item.question || '',
            answer: item.content || item.description || item.answer || ''
        }));
    }

    // Default open the first one
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!items || items.length === 0) return null;
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "py-20 md:py-28 relative overflow-hidden",
            isDark ? "bg-[#050505]" : "bg-background dark:bg-neutral-950"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                glowVariant={4}
            />
            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto px-4 md:px-0">
                    <StandardSectionHeader section={section} align="center" />

                    <FadeIn direction="up" delay={0.4} duration={0.6}>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl overflow-hidden border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors"
                                >
                                    <button
                                        onClick={() => toggle(index)}
                                        className="flex items-center justify-between w-full p-6 text-left"
                                    >
                                        <span className={cn(
                                            "text-lg font-semibold pr-8 transition-colors",
                                            openIndex === index ? (isDark ? "text-white" : "text-primary") : (isDark ? "text-neutral-300" : "text-neutral-700")
                                        )}>
                                            {item.question}
                                        </span>
                                        <span className={cn(
                                            "p-2 rounded-full shadow-sm transition-transform duration-300 shrink-0",
                                            isDark ? "bg-neutral-800" : "bg-white",
                                            openIndex === index ? "rotate-180" : ""
                                        )}>
                                            <ChevronDown className="w-5 h-5 text-neutral-500" />
                                        </span>
                                    </button>

                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <div className={cn("p-6 pt-0 leading-relaxed", isDark ? "text-neutral-400" : "text-neutral-600")}>
                                            <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
