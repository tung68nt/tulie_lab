'use client';

import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FadeIn } from '@/components/animations/FadeIn';

const defaultTestimonials = [
    {
        name: "Nguyễn Văn A",
        role: "Học viên",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "Khoá học rất bổ ích, giúp tôi thay đổi hoàn toàn tư duy.",
    },
    {
        name: "Trần Thị B",
        role: "Freelancer",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "Nội dung thực tế, dễ hiểu và áp dụng được ngay.",
    },
    {
        name: "Lê Văn C",
        role: "Chủ doanh nghiệp",
        avatar: "https://randomuser.me/api/portraits/men/68.jpg",
        content: "Rất đáng tiền, hỗ trợ nhiệt tình từ giảng viên.",
    }
];

import { SectionBackground } from '../SectionBackground';

export const SimpleTestimonialsSection = ({ section }: { section: Section }) => {
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "py-12 md:py-20 relative transition-colors duration-300",
            isDark
                ? "bg-[#050505] text-white"
                : section.backgroundTheme === 'light'
                    ? "bg-white dark:bg-[#050505] text-zinc-950 dark:text-white"
                    : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={isDark}
                glowVariant={8}
            />

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <StandardSectionHeader section={section} align={section.align || "center"} />

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {(section.items || defaultTestimonials).map((testimonial: any, index) => (
                        <FadeIn
                            key={index}
                            delay={index * 0.1}
                            className="flex flex-col h-full"
                        >
                            <div className={cn(
                                "h-full border border-border/50 rounded-3xl p-1 shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300",
                                section.backgroundTheme === 'dark'
                                    ? "bg-zinc-900 border-zinc-800"
                                    : section.backgroundTheme === 'light'
                                        ? "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
                                        : "bg-card"
                            )}>
                                <div className={cn(
                                    "rounded-[1.25rem] p-6 md:p-8 h-full flex flex-col",
                                    section.backgroundTheme === 'dark' ? "bg-black" : (section.backgroundTheme === 'light' ? "bg-zinc-50 dark:bg-black" : "bg-background")
                                )}>
                                    {/* Header: Profile */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="relative w-14 h-14 shrink-0">
                                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm"></div>
                                            <Image
                                                src={testimonial.avatar || `https://i.pravatar.cc/150?u=${index}`}
                                                alt={testimonial.name || ''}
                                                fill
                                                className="object-cover rounded-full border-2 border-white dark:border-neutral-800 shadow-md relative z-10"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h3 className="text-xl font-bold text-foreground dark:text-white leading-tight mb-1">{testimonial.name}</h3>
                                            <p className="text-sm font-medium text-muted-foreground dark:text-zinc-400 leading-snug">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    {/* Quote Area - Full height, centered if short, top aligned if long */}
                                    <div className="flex-1">
                                        {testimonial.content ? (
                                            <div className="relative">
                                                <span className="absolute -top-2 -left-2 text-4xl text-primary/20 serif font-serif">“</span>
                                                <p className="text-base md:text-lg text-foreground/80 dark:text-zinc-300 font-medium leading-relaxed italic relative z-10 pl-2">
                                                    {testimonial.content}
                                                </p>
                                                <span className="absolute -bottom-4 right-0 text-4xl text-primary/20 serif font-serif">”</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};
