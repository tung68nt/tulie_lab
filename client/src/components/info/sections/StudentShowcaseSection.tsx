import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

interface StudentShowcaseSectionProps {
    section: Section;
}

export const StudentShowcaseSection: React.FC<StudentShowcaseSectionProps> = ({ section }) => {
    const items = section.items || [];

    return (
        <section className="py-12 md:py-20 bg-background overflow-hidden relative">
            {section.showDotPattern !== false && <DotPatternBackground />}
            <div className="container relative z-10">
                <div className="text-center mb-10">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm block mb-4">
                        {section.subtitle || "KẾT QUẢ THỰC TẾ TỪ NHỮNG HỌC VIÊN ĐÃ ÁP DỤNG KIẾN THỨC VÀO CÔNG VIỆC KINH DOANH VÀ SỰ NGHIỆP."}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white py-2">{section.title || "Câu chuyện thành công từ học viên"}</h2>
                </div>

                <div className={`grid gap-8 items-stretch justify-center ${items.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
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

                            <div className="p-6 flex flex-col flex-1">
                                <div className="md:h-[240px] h-auto flex flex-col">
                                    <h3 className="font-bold text-xl text-neutral-900 mb-1">{item.title}</h3>
                                    {item.subtitle && (
                                        <p className="text-[11px] text-neutral-500 mb-2 font-medium">{item.subtitle}</p>
                                    )}

                                    {(item.description || item.quote) && (
                                        <div className="text-neutral-600 text-[13px] leading-relaxed mb-4">
                                            {item.quote ? `"${item.quote}"` : item.description}
                                        </div>
                                    )}
                                </div>

                                {/* Before/After stats if available */}
                                {(item.before && item.after) && (
                                    <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 flex-1">
                                        <div>
                                            <p className="text-[10px] text-red-500 font-bold mb-1">Trước khi học</p>
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
