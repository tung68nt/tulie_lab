'use client';

import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CheckCircle2, XCircle } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

const testimonials = [
    {
        name: "Tuấn Anh",
        role: "Khoá học: Đầu tư chứng khoán",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        before: [
            "Chỉ tư vấn 1-1 tốn nhiều thời gian.",
            "Không scale được số lượng khách hàng.",
            "Thu nhập bị giới hạn bởi thời gian."
        ],
        after: [
            "Đóng gói khóa học Basic bán tự động.",
            "Tập trung tư vấn gói Premium giá cao.",
            "Xây dựng kênh Youtube 100k sub."
        ]
    },
    {
        name: "Helen Hải",
        role: "Khoá học: Ma trận dịch vụ spa",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "Chương trình đã thay đổi hoàn toàn tư duy kinh doanh của tôi.",
        before: [
            "Tốn nhiều thời gian để dạy trực tiếp.",
            "Dạy đi dạy lại một mảng kiến thức sinh ra nhàm chán.",
            "Không ứng dụng marketing online nên số lượng học viên không đều."
        ],
        after: [
            "Đạt doanh số trăm triệu ngay sau 1 tháng.",
            "Xây dựng được cộng đồng và bán được gói tư vấn giá cao.",
            "Giảm thời gian đào tạo và có thêm thời gian mở rộng kinh doanh."
        ]
    },
    {
        name: "Hoàng Lê Na",
        role: "Khoá học: Vận hành F&B",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        before: [
            "Chưa có kinh nghiệm làm đào tạo.",
            "Không có thương hiệu cá nhân.",
            "Không quá giỏi về công nghệ, chỉ có kinh nghiệm chuyên môn F&B."
        ],
        after: [
            "Tạo ra khoá học sau 1 tuần.",
            "Đạt ~50 học viên mới trong vòng 15 ngày.",
            "Xây dựng được Thương hiệu cá nhân qua khoá Elearning.",
            "Gia tăng thêm nguồn thu ngoài việc kinh doanh chính."
        ]
    }
];

import { SectionBackground } from '../SectionBackground';

export const TestimonialsSection = ({ section }: { section: Section }) => {
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "py-20 md:py-32 relative transition-colors duration-300",
            "py-20 md:py-32 relative transition-colors duration-300",
            isDark
                ? "bg-[#050505] text-white"
                : section.backgroundTheme === 'light'
                    ? "bg-white text-zinc-950"
                    : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={isDark}
                glowVariant={7}
            />

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <StandardSectionHeader section={section} align={section.align || "left"} />

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(section.items || testimonials).map((testimonial: any, index) => (
                        <FadeIn
                            key={index}
                            delay={index * 0.1}
                            className="flex flex-col h-full"
                        >
                            <div className="h-full bg-card border border-border/50 rounded-3xl p-1 shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-background rounded-[1.25rem] p-5 md:p-6 h-full flex flex-col">
                                    {/* Header: Profile */}
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="relative w-14 h-14 shrink-0">
                                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm"></div>
                                            <Image
                                                src={testimonial.avatar || `https://i.pravatar.cc/150?u=${index}`}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover rounded-full border-2 border-white dark:border-neutral-800 shadow-md relative z-10"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{testimonial.name}</h3>
                                            <p className="text-sm font-medium text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    {/* Quote Area */}
                                    <div className="mb-4 h-14 flex items-center">
                                        {testimonial.content ? (
                                            <p className="text-base text-foreground/80 font-medium line-clamp-2">
                                                "{testimonial.content}"
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-4 flex-grow flex flex-col">
                                        {/* Before Column */}
                                        <div className="flex-none min-h-[10rem]">
                                            <h4 className="text-xs font-bold text-red-500 mb-2">Trước khi học</h4>
                                            <div className="">
                                                {testimonial.before && testimonial.before.map((point: string, i: number) => (
                                                    <div key={i} className="flex gap-2 text-sm text-zinc-500 dark:text-zinc-300 mb-2">
                                                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2 opacity-80">{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-border/50 border-t border-dashed border-border shrink-0"></div>

                                        {/* After Column */}
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-green-500 mb-2">Kết quả đạt được</h4>
                                            {testimonial.after && testimonial.after.map((point: string, i: number) => (
                                                <div key={i} className="flex gap-2 text-sm font-medium text-foreground mb-2">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{point}</span>
                                                </div>
                                            ))}
                                        </div>
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
