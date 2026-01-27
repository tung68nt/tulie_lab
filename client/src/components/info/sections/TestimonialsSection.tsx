import { SectionTag } from '@/components/SectionTag';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CheckCircle2, XCircle } from 'lucide-react';

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

import { DotPatternBackground } from '@/components/ui/DotPatternBackground';

export const TestimonialsSection = ({ section }: { section: Section }) => {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            {/* Dotted Background check */}
            {section.showDotPattern !== false && <DotPatternBackground />}

            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center">
                        <SectionTag>
                            {section.tag || "Thành viên đã làm được gì?"}
                        </SectionTag>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.3] bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-neutral-400 dark:to-white pb-2">
                        {section.title || "Kết quả thực tế từ những người như bạn"}
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl mx-auto leading-relaxed">
                        {section.subtitle || "Không lý thuyết suông. Đây là những thay đổi cụ thể trước và sau khi tham gia."}
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="flex flex-wrap justify-center gap-8 -mx-4">
                    {(section.items || testimonials).map((testimonial: any, index) => (
                        <div
                            key={index}
                            className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] flex flex-col"
                        >
                            <div className="h-full bg-card border border-border/50 rounded-3xl p-1 shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
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
                                            <h3 className="text-xl font-bold">{testimonial.name}</h3>
                                            <p className="text-sm font-medium text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    {/* Quote Area - Always render to align "Before" section */}
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
                                            <h4 className="text-[10px] font-bold text-red-500 tracking-wider mb-2">Trước khi học</h4>
                                            <div className="">
                                                {testimonial.before && testimonial.before.map((point: string, i: number) => (
                                                    <div key={i} className="flex gap-3 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2 opacity-80">{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-border/50 border-t border-dashed border-border shrink-0"></div>

                                        {/* After Column */}
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-green-500 tracking-wider mb-2">Kết quả đạt được</h4>
                                            {testimonial.after && testimonial.after.map((point: string, i: number) => (
                                                <div key={i} className="flex gap-3 text-sm font-medium text-foreground mb-2">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
