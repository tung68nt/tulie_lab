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
                    tagProps={{ dotColor: 'green', animate: true }}
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
                                        <div className="min-h-[160px]">
                                            <h3 className="font-bold text-xl text-foreground mb-1">{String(item.title || '')}</h3>
                                            {Boolean(item.subtitle) && (
                                                <p className="text-[11px] text-muted-foreground mb-2 font-medium">{String(item.subtitle)}</p>
                                            )}

                                            {Boolean(item.description || item.quote) && (
                                                <div className="text-zinc-600 dark:text-zinc-300 text-[14px] leading-relaxed font-medium">
                                                    {String(item.quote ? `"${item.quote}"` : item.description)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Before/After stats if available */}
                                    {(Boolean(item.before) && Boolean(item.after)) && (
                                        <div className="pt-6 border-t border-border space-y-8 bg-zinc-50/50 dark:bg-white/5 mx-[-1.5rem] px-6 mt-auto">
                                            <div className="flex flex-col">
                                                <p className="text-[13px] text-red-500 font-bold mb-4 h-6 flex items-center gap-1.5 grayscale-[0.2]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    Trước khi học
                                                </p>
                                                <ul className="text-[12px] text-zinc-500 dark:text-zinc-400 space-y-3">
                                                    {(Array.isArray(item.before) ? item.before : []).map((p: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="shrink-0 mt-1 text-red-500/70">
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                            </span>
                                                            <span className="leading-tight">{p}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col pb-6">
                                                <p className="text-[13px] text-green-600 font-bold mb-4 h-6 flex items-center gap-1.5 grayscale-[0.2]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Kết quả đạt được
                                                </p>
                                                <ul className="text-[12px] text-zinc-700 dark:text-zinc-200 font-medium space-y-3">
                                                    {(Array.isArray(item.after) ? item.after : []).map((p: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="shrink-0 mt-1 text-green-600">
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                            </span>
                                                            <span className="leading-tight">{p}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section >
    );
};
