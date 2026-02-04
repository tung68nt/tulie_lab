'use client';

import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StudentShowcaseSectionProps {
    section: Section;
}

export const StudentShowcaseSection: React.FC<StudentShowcaseSectionProps> = ({ section }) => {
    const items = section.items || [];

    return (
        <section className="py-6 md:py-10 relative overflow-hidden transition-colors duration-300">
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

                                <div className="p-4 md:p-5 lg:p-6 flex flex-col flex-1 h-full select-none">
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-0">
                                            {/* Title area - Min height for alignment */}
                                            <div className="min-h-[48px] md:min-h-[56px] flex items-start mb-1">
                                                <h3 className="font-bold text-lg md:text-xl text-foreground leading-tight">{String(item.title || '')}</h3>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-border/60 mt-1" />

                                            {/* Student Details area - Min height for alignment */}
                                            <div className="min-h-[40px] flex items-center py-2">
                                                {Boolean(item.subtitle) && (
                                                    <p className="text-[12px] text-muted-foreground font-medium text-left leading-relaxed">{String(item.subtitle)}</p>
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-border/60 mt-0.5" />

                                            {/* Story area - Flexible height */}
                                            <div className="flex-1 py-4">
                                                {/* Quote/Description FIRST */}
                                                <div className="min-h-[120px]">
                                                    {Boolean(item.description || item.quote) && (
                                                        <div className="text-zinc-600 dark:text-zinc-300 text-[14px] leading-relaxed font-normal mb-8 italic border-l-2 border-primary/20 pl-4 py-1">
                                                            {String(item.quote ? `"${item.quote}"` : item.description)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Headers and Lists - Stacked or Grid? User said "thứ tự: câu chuyện - trước khi học - sau khi học" */}
                                                {/* We will stack them as per the specific order requested */}

                                                {/* Before content */}
                                                {item.before && (Array.isArray(item.before) ? item.before.length > 0 : true) && (
                                                    <div className="mb-6">
                                                        <h5 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-1.5">
                                                            <div className="w-1 h-3 bg-red-500 rounded-full" />
                                                            Trước khi học
                                                        </h5>
                                                        <ul className="space-y-2">
                                                            {(Array.isArray(item.before) ? item.before : [item.before]).map((text: any, i: number) => (
                                                                <li key={i} className="flex items-start gap-1.5 text-[13px] text-muted-foreground leading-tight">
                                                                    <XCircle className="w-3.5 h-3.5 text-red-500/70 shrink-0 mt-0.5" />
                                                                    <span>{String(text)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* After content */}
                                                {item.after && (Array.isArray(item.after) ? item.after.length > 0 : true) && (
                                                    <div className="pt-4 border-t border-border/40">
                                                        <h5 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-1.5">
                                                            <div className="w-1 h-3 bg-green-600 rounded-full" />
                                                            Sau khi học
                                                        </h5>
                                                        <ul className="space-y-2">
                                                            {(Array.isArray(item.after) ? item.after : [item.after]).map((text: any, i: number) => (
                                                                <li key={i} className="flex items-start gap-1.5 text-[13px] text-foreground dark:text-zinc-200 leading-tight">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600/80 shrink-0 mt-0.5" />
                                                                    <span className="font-medium">{String(text)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
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
