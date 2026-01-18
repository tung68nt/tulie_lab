import { Section } from '@/types/sections';
import { BookOpen, CheckCircle2, PlayCircle, FileText } from 'lucide-react';
import Image from 'next/image';

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
        <section className="py-20 md:py-32 bg-secondary/20">
            <div className="container px-4 md:px-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 py-1.5 text-sm font-semibold text-foreground mb-6 shadow-sm">
                        <BookOpen size={16} className="text-primary" />
                        Lộ trình chi tiết
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                        {section.title || "Nội Dung Chi Tiết Khóa Học"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        {section.subtitle || "Hệ thống bài giảng được thiết kế khoa học, đi từ tư duy đến thực chiến, kèm theo bộ tài liệu và công cụ hỗ trợ."}
                    </p>
                </div>

                {/* Modules - 1 Column Layout */}
                <div className="space-y-12">
                    {modules.map((module: any, index: number) => (
                        <div key={index} className="group flex flex-col md:flex-row bg-background rounded-3xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

                            {/* Left/Top: Image & Number */}
                            <div className="md:w-2/5 relative min-h-[240px] md:min-h-full bg-secondary overflow-hidden">
                                <div className="absolute inset-0">
                                    <img
                                        src={module.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&sig=${index}`}
                                        alt={module.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                                <div className="absolute top-6 left-6 w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg z-10">
                                    {index + 1}
                                </div>
                            </div>

                            {/* Right/Bottom: Content */}
                            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                                    {module.title}
                                </h3>
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed border-b border-border/50 pb-6">
                                    {module.description}
                                </p>

                                <div className="space-y-3">
                                    {module.lessons?.map((lesson: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 group/lesson p-1.5 -ml-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                                            <div className="mt-0.5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover/lesson:bg-primary/20 group-hover/lesson:text-primary transition-colors">
                                                {lesson.toLowerCase().includes('tài liệu') ? (
                                                    <FileText size={16} />
                                                ) : (
                                                    <PlayCircle size={16} />
                                                )}
                                            </div>
                                            <span className={`font-medium text-base ${lesson.toLowerCase().includes('tài liệu') ? 'text-primary' : 'text-foreground/80'}`}>
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
        </section>
    );
};
