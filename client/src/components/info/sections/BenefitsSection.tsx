import { DynamicIcon } from '@/components/DynamicIcon';
import Link from 'next/link';
import { BENEFITS_DATA } from '@/lib/benefits';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';

import { Section } from '@/types/sections';

interface BenefitsSectionProps {
    section: Section;
}

import { SectionBackground } from '../SectionBackground';

export function BenefitsSection({ section }: BenefitsSectionProps) {
    const title = section?.title || 'Quyền Lợi Học Viên';
    const subtitle = section?.subtitle || 'Những đặc quyền chỉ có tại cộng đồng học tập của chúng tôi';
    const items = section?.items || [];

    const displayItems = items.length > 0 ? items : BENEFITS_DATA;

    return (
        <section className="py-16 md:py-20 bg-background relative overflow-hidden">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />

            <div className="container relative z-10">
                <StandardSectionHeader section={section} align="center" />

                <div className="flex flex-wrap justify-center gap-6">
                    {displayItems.map((item: any, idx) => (
                        <div
                            key={idx}
                            className="group relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] min-w-[280px] flex flex-col"
                        >
                            <Link href={item.href || item.link || `/blog/${item.slug || 'all'}`} className="h-full bg-card hover:bg-card/50 border border-border/50 hover:border-primary/30 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm flex flex-col relative overflow-hidden block text-left">
                                {/* Decorative Glow - Removed or toned down */}

                                <div className="mb-6 relative">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                                        {item.icon ? (
                                            <DynamicIcon name={item.icon} size={28} strokeWidth={2} className="shrink-0" />
                                        ) : (
                                            <div className="w-7 h-7 bg-current rounded-md opacity-20" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                                    {item.title || item.label}
                                </h3>

                                <p className="text-muted-foreground leading-relaxed text-sm flex-1">
                                    {item.description || item.content || 'Nội dung chi tiết đang được cập nhật.'}
                                </p>

                                <div className="mt-6 pt-6 border-t border-border/50 flex items-center text-primary text-sm font-bold group-hover:translate-x-1 transition-transform duration-300">
                                    Chi tiết <span className="ml-1">→</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
