'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';

interface StudentShowcaseSectionProps {
    section: Section;
}

export const StudentShowcaseSection: React.FC<StudentShowcaseSectionProps> = ({ section }) => {
    const items = section.items || [];

    return (
        <section className="py-12 md:py-20 relative overflow-hidden transition-colors duration-300">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={13}
            />
            <div className="container relative z-10 mx-auto px-4">
                <StandardSectionHeader
                    section={section}
                    tagOverride={section.subtitle || "KẾT QUẢ THỰC TẾ"}
                    subtitleOverride="Những câu chuyện thành công từ học viên đã áp dụng kiến thức vào thực tế."
                    tagProps={{ dotColor: 'black', animate: true }}
                />

                <FadeIn direction="up" delay={0.4}>
                    <div className={`grid gap-8 items-stretch justify-center px-4 md:px-0 ${items.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
                        items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                            'grid-cols-1 md:grid-cols-3'
                        }`}>
                        {items.map((item, idx) => (
                            <div key={idx} className="group flex flex-col h-full bg-background rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title || ''}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1 h-full select-none">
                                    <div className="flex flex-col mb-4 flex-1">
                                        <div className="flex flex-col gap-3">
                                            {/* Title area - Min height for alignment */}
                                            <div className="min-h-[96px] flex items-start">
                                                <h3 className="font-bold text-xl text-foreground leading-tight">{String(item.title || '')}</h3>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-border/60" />

                                            {/* Student Details area - Min height for alignment */}
                                            <div className="min-h-[56px] flex items-center">
                                                {Boolean(item.subtitle) && (
                                                    <p className="text-[12px] text-muted-foreground font-medium text-left">{String(item.subtitle)}</p>
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-border/60" />

                                            {/* Story area - Flexible height with min-height */}
                                            <div className="flex-1 min-h-[200px]">
                                                {Boolean(item.description || item.quote) && (
                                                    <div className="text-zinc-600 dark:text-zinc-300 text-[14px] leading-relaxed font-medium">
                                                        {String(item.quote ? `"${item.quote}"` : item.description)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section >
    );
};
