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

                                <div className="p-5 md:p-6 lg:p-8 flex flex-col flex-1 h-full select-none">
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-0">
                                            {/* Title area - Min height for alignment */}
                                            <div className="min-h-[84px] md:min-h-[104px] flex items-start mb-2">
                                                <h3 className="font-bold text-lg md:text-xl text-foreground leading-snug">{String(item.title || '')}</h3>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-border/60 mt-4" />

                                            {/* Student Details area - Min height for alignment */}
                                            <div className="min-h-[72px] flex items-center py-5">
                                                {Boolean(item.subtitle) && (
                                                    <p className="text-[12px] text-muted-foreground font-medium text-left leading-relaxed">{String(item.subtitle)}</p>
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-dashed border-border/60 mt-2" />

                                            {/* Story area - Flexible height */}
                                            <div className="flex-1 py-4">
                                                {/* Before content */}
                                                {(item as any).before && Array.isArray((item as any).before) && (item as any).before.length > 0 && (
                                                    <div className="mb-6">
                                                        <h5 className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-1.5 grayscale opacity-70">
                                                            <div className="w-1 h-3 bg-red-500 rounded-full" />
                                                            Trước khi học
                                                        </h5>
                                                        <ul className="space-y-2">
                                                            {((item as any).before as string[]).map((text: string, i: number) => (
                                                                <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-snug">
                                                                    <XCircle className="w-4 h-4 text-red-500/50 shrink-0 mt-0.5" />
                                                                    <span>{text}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Quote/Description in middle if exists */}
                                                {Boolean(item.description || item.quote) && (
                                                    <div className="text-zinc-600 dark:text-zinc-300 text-[14px] leading-relaxed font-medium mb-6 italic border-l-2 border-primary/20 pl-4 py-1">
                                                        {String(item.quote ? `"${item.quote}"` : item.description)}
                                                    </div>
                                                )}

                                                {/* After content */}
                                                {(item as any).after && Array.isArray((item as any).after) && (item as any).after.length > 0 && (
                                                    <div>
                                                        <h5 className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-1.5 grayscale opacity-70">
                                                            <div className="w-1 h-3 bg-green-600 rounded-full" />
                                                            Sau khi học
                                                        </h5>
                                                        <ul className="space-y-2">
                                                            {((item as any).after as string[]).map((text: string, i: number) => (
                                                                <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-snug">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-600/60 shrink-0 mt-0.5" />
                                                                    <span className="text-foreground dark:text-zinc-200 font-medium">{text}</span>
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
