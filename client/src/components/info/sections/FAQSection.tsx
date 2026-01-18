'use client';

import { useState } from 'react';
import { Section } from '@/types/sections';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    return (
        <section className="py-20 md:py-28 bg-white dark:bg-neutral-950">
            <div className="container px-4 mx-auto max-w-4xl">
                <div className="text-center mb-16 space-y-4">
                    {section.title && (
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {section.title}
                        </h2>
                    )}
                    {section.subtitle && (
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            {section.subtitle}
                        </p>
                    )}
                </div>

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
                                    openIndex === index ? "text-primary dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                                )}>
                                    {item.question}
                                </span>
                                <span className={cn(
                                    "p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm transition-transform duration-300 shrink-0",
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
                                <div className="p-6 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
