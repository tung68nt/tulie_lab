import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';

interface StudentShowcaseSectionProps {
    section: Section;
}

export const StudentShowcaseSection: React.FC<StudentShowcaseSectionProps> = ({ section }) => {
    const items = section.items || [];

    return (
        <section className="py-12 md:py-20 bg-background overflow-hidden relative">
            {section.showDotPattern !== false && <DotPatternBackground />}
            <div className="container relative z-10">
                <StandardSectionHeader
                    section={section}
                    // Use subtitle as tag for this section if generic tag is missing, or fallback logic
                    // Actually, looking at the code:
                    // Original: <span ...>{section.subtitle || "KẾT QUẢ..."}</span> (This was acting as a tag/supertitle)
                    // H2: {section.title}
                    // So we should map section.subtitle to tagOverride if we want it to be the "Blinking Tag"
                    // But usually subtitle is description.
                    // Let's check the current UI again.
                    // The old code had: UPPERCASE SUBTITLE above Title.
                    // The new style wants: Tag with Blinking Dot above Title.
                    // So I will pass the old subtitle as the TAG.
                    tagOverride={section.subtitle || "KẾT QUẢ THỰC TẾ"}
                    subtitleOverride="Những câu chuyện thành công từ học viên đã áp dụng kiến thức vào thực tế." /* Add a real subtitle if missing */
                />

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
                                <div className="flex flex-col mb-4">
                                    <h3 className="font-bold text-xl text-neutral-900 mb-1">{item.title}</h3>
                                    {item.subtitle && (
                                        <p className="text-[11px] text-neutral-500 mb-2 font-medium">{item.subtitle}</p>
                                    )}

                                    {(item.description || item.quote) && (
                                        <div className="text-neutral-600 text-[13px] leading-relaxed">
                                            {item.quote ? `"${item.quote}"` : item.description}
                                        </div>
                                    )}
                                </div>

                                {/* Before/After stats if available */}
                                {(item.before && item.after) && (
                                    <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 mt-auto">
                                        <div>
                                            <p className="text-xs text-red-500 font-bold mb-1">Trước khi học</p>
                                            <ul className="text-[11px] text-neutral-500 space-y-1">
                                                {Array.isArray(item.before) && item.before.map((p: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="shrink-0 mt-0.5 text-red-500">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                        </span>
                                                        <span>{p}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-green-600 font-bold mb-1">Kết quả đạt được</p>
                                            <ul className="text-[11px] text-neutral-600 font-medium space-y-1">
                                                {Array.isArray(item.after) && item.after.map((p: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="shrink-0 mt-0.5 text-green-600">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                        </span>
                                                        <span>{p}</span>
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
            </div>
        </section >
    );
};
