import { Section } from '@/types/sections';

const testimonials = [
    {
        name: "Nguyễn Văn Minh",
        role: "Frontend Developer tại FPT Software",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        content: "Workshop giúp mình tự tin xây dựng các ứng dụng React phức tạp. Consultant giải thích rất dễ hiểu và có nhiều bài tập thực hành.",
        rating: 5
    },
    {
        name: "Trần Thị Hương",
        role: "Full-stack Developer tại Shopee",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        content: "Sau workshop, mình đã có thể build được MVP cho startup của riêng mình. Kiến thức từ cơ bản đến nâng cao được sắp xếp rất logic.",
        rating: 5
    },
    {
        name: "Lê Hoàng Nam",
        role: "Mobile Developer tại VNG",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        content: "Mình học được cách tư duy giải quyết vấn đề, không chỉ là code. Đây là điều quan trọng nhất mà workshop mang lại.",
        rating: 5
    },
    {
        name: "Phạm Thị Lan",
        role: "Product Manager tại Tiki",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        content: "Là PM không biết code, nhưng sau workshop mình đã hiểu được quy trình phát triển sản phẩm và giao tiếp tốt hơn với team dev.",
        rating: 5
    },
    {
        name: "Đỗ Văn Thành",
        role: "Startup Founder",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        content: "Tiết kiệm được rất nhiều chi phí thuê dev giai đoạn đầu. Mình tự build được prototype để pitch với nhà đầu tư.",
        rating: 5
    },
    {
        name: "Ngô Thị Mai",
        role: "UX Designer tại Grab",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        content: "Workshop giúp mình hiểu rõ hơn về technical constraints khi thiết kế. Giờ mình có thể tự tay prototype ý tưởng của mình.",
        rating: 5
    }
];

export const TestimonialsSection = ({ section }: { section: Section }) => {
    return (
        <section className="py-12 md:py-16 bg-muted/30">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-sm font-medium text-foreground/80 mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
                        </span>
                        Thành viên đã làm được gì?
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {section.title || "Kết quả thực tế từ những người như bạn"}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {section.subtitle || "Hàng nghìn thành viên đã thay đổi sự nghiệp nhờ các workshop tại The Tulie Lab"}
                    </p>
                </div>

                {/* Testimonials grid - 6 cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                        >
                            {/* Rating stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Content - flex grow to push author to bottom */}
                            <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                                "{testimonial.content}"
                            </p>

                            {/* Author - aligned at bottom */}
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
