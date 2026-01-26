import React from 'react';
import { SectionTag } from '@/components/SectionTag';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
interface ExpertSectionProps {
    section: Section;
}

export const ExpertSection: React.FC<ExpertSectionProps> = ({ section }) => {
    // Default data if missing (for preview/fallback)
    const expert = {
        name: section.title || "TuLie",
        role: section.subtitle || "Expert Fullstack Developer & Solopreneur",
        bio: section.content || "Với 10+ năm kinh nghiệm trong lĩnh vực lập trình và xây dựng sản phẩm số. Tôi đã giúp hàng ngàn học viên từ con số 0 trở thành lập trình viên chuyên nghiệp và tự xây dựng business riêng.",
        image: section.image || "/assets/images/tulie-avatar.jpg", // Relative path for multi-domain support
        achievements: section.items?.map(item => item.title) || [
            "Founder Tulie Agency & The Tulie Lab",
            "1000+ Học viên thành công",
            "Top 1% Freelancer Upwork (Simulated)",
            "Xây dựng hệ thống Automation cho 50+ doanh nghiệp"
        ]
    };

    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            {/* Standard Dot Pattern Background */}
            <DotPatternBackground />

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                    {/* Left: Image (Portrait) - Stylized */}
                    <div className="lg:col-span-5 order-2 lg:order-1 relative group">
                        <div className="relative mx-auto max-w-sm lg:max-w-full z-10">
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            {/* Main Image Container */}
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[3/4] bg-neutral-100 border-4 border-white dark:border-neutral-800 rotate-0 group-hover:rotate-2 transition-all duration-700 ease-out-expo">
                                {expert.image ? (
                                    <Image
                                        src={expert.image}
                                        alt={expert.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-neutral-200 dark:bg-neutral-800">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Floating Stats/Badge */}
                            <div className="absolute bottom-8 -right-4 lg:-right-8 bg-white dark:bg-neutral-900 p-4 pl-5 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-4 animate-bounce-subtle">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 overflow-hidden relative">
                                            <Image src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} alt="" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pr-2">
                                    <div className="font-bold text-sm">1000+</div>
                                    <div className="text-xs text-muted-foreground">Mentee thành công</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
                        <div>
                            <SectionTag>
                                {section.tag || "VỀ GIẢNG VIÊN"}
                            </SectionTag>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-normal text-foreground">
                                {expert.name}
                            </h2>
                            <p className="text-xl md:text-2xl text-primary font-bold">
                                {expert.role}
                            </p>
                        </div>

                        <div className="prose prose-lg text-muted-foreground leading-relaxed">
                            {expert.bio.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>

                        {/* Achievements Cards */}
                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {expert.achievements.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="font-semibold text-sm md:text-base text-foreground">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 flex items-center gap-4 opacity-80">
                            {/* Social Icons or Signature could go here */}
                            <div className="h-px flex-1 bg-border"></div>
                            <span className="text-sm font-medium text-muted-foreground">Connect with me</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
