import { Section } from '@/types/sections';
import { BookOpen, CheckCircle2, PlayCircle, FileText } from 'lucide-react';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';

import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';

export const CurriculumSection = ({ section }: { section: Section }) => {
    // Default modules if not provided in section data
    const modules = section.items || [
        {
            title: "Phần 1: Tư Duy & Nền Tảng F&B",
            description: "Hiểu đúng về kinh doanh F&B, định vị thương hiệu và lựa chọn mô hình phù hợp.",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
            lessons: [
                "Bài 1: Tổng quan thị trường F&B & Cơ hội 2024",
                "Bài 2: Tư duy đúng về sản phẩm & Dịch vụ",
                "Bài 3: Lựa chọn mô hình kinh doanh chiến thắng",
                "Tài liệu: File kế hoạch kinh doanh mẫu"
            ]
        },
        {
            title: "Phần 2: Xây Dựng Menu & Giá Bán",
            description: "Kỹ thuật thiết kế menu tối ưu lợi nhuận (Menu Engineering) và chiến lược định giá.",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop",
            lessons: [
                "Bài 4: Nguyên lý thiết kế Menu & Tối ưu COGS",
                "Bài 5: Chiến lược định giá & Phễu sản phẩm",
                "Bài 6: Quy trình R&D món mới hiệu quả",
                "Tài liệu: Template tính Cost món ăn tự động"
            ]
        },
        {
            title: "Phần 3: Vận Hành & Quy Trình",
            description: "Chuẩn hóa quy trình vận hành để giải phóng chủ quán khỏi sự vụ hàng ngày.",
            image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=400&fit=crop",
            lessons: [
                "Bài 7: Xây dựng quy trình SOPs chuẩn",
                "Bài 8: Quản lý nhân sự & Đào tạo đội ngũ",
                "Bài 9: Kiểm soát thất thoát & Quản lý kho",
                "Tài liệu: Bộ biểu mẫu vận hành chuẩn"
            ]
        }
    ];

    return (
        <section className="py-20 md:py-32 relative overflow-hidden transition-colors duration-300">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                hideGradients={section.backgroundTheme === 'dark'}
            />

            {/* Faded Dot Pattern 4 Corners (Requested) */}
            {(section.backgroundTheme === 'dark' || !section.backgroundTheme) && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    {/* Top Left */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                    {/* Bottom Right */}
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
                </div>
            )}

            <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
                <div className="flex flex-col gap-12 lg:gap-16">
                    {/* Header & Description */}
                    <div className="w-full max-w-3xl mx-auto">
                        <StandardSectionHeader
                            section={section}
                            align="center"
                            className="mb-8"
                            tagOverride={
                                <span className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-primary" />
                                    Lộ trình chi tiết
                                </span>
                            }
                            subtitleOverride={section.subtitle || "Hệ thống bài giảng được thiết kế khoa học, đi từ tư duy đến thực chiến."}
                        />
                    </div>

                    {/* Modules List - Stacked */}
                    <div className="w-full max-w-4xl mx-auto space-y-10 text-left">
                        {modules.map((module: any, index: number) => (
                            <div key={index} className="group flex flex-col md:flex-row bg-background/50 backdrop-blur-sm rounded-3xl border border-border/50 overflow-hidden isolate transform-gpu shadow-sm hover:shadow-xl transition-all duration-300">


                                {/* Left/Top: Image & Number */}
                                <div className="md:w-2/5 relative min-h-[200px] md:min-h-full bg-secondary overflow-hidden">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={module.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&sig=${index}`}
                                            alt={module.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                    </div>
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-background/90 dark:bg-black/90 backdrop-blur rounded-xl flex items-center justify-center font-bold text-lg shadow-lg z-10 border border-white/10 text-foreground">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Right/Bottom: Content */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground leading-tight">
                                        {module.title}
                                    </h3>
                                    <p className="text-muted-foreground text-base mb-6 leading-relaxed border-b border-border/50 pb-4">
                                        {module.description}
                                    </p>

                                    <div className="space-y-2.5">
                                        {module.lessons?.map((lesson: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 group/lesson p-1.5 -ml-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                                                <div className="mt-0.5 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover/lesson:bg-primary/20 group-hover/lesson:text-primary transition-colors">
                                                    {lesson.toLowerCase().includes('tài liệu') ? (
                                                        <FileText size={14} />
                                                    ) : (
                                                        <PlayCircle size={14} />
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium ${lesson.toLowerCase().includes('tài liệu') ? 'text-primary' : 'text-foreground/80'}`}>
                                                    {lesson}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
