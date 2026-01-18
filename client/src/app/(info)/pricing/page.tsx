
import { Section } from '@/types/sections';
import { PricingSection } from '@/components/info/sections/PricingSection';
import { FAQSection } from '@/components/info/sections/FAQSection';
import { ComparisonSection } from '@/components/info/sections/ComparisonSection';

const PRICING_SECTIONS: Section[] = [
    {
        id: 'pricing-header',
        type: 'content',
        title: 'Bảng giá & Gói thành viên',
        subtitle: 'Chọn gói phù hợp với lộ trình phát triển của bạn',
        content: 'Đầu tư cho kiến thức là khoản đầu tư sinh lời nhất. Tham gia ngay cộng đồng Vibe Coding để tiếp cận kho tài nguyên và kiến thức khổng lồ.'
    },
    {
        id: 'pricing-plans',
        type: 'upsell',
        title: 'Các gói phổ biến',
        subtitle: 'Được nhiều thành viên lựa chọn',
        items: [
            {
                id: 'plan-retail',
                title: 'Gói Mua Lẻ',
                price: '0đ/năm',
                originalPrice: '',
                description: 'Mua lẻ từng sản phẩm số',
                tag: 'Linh hoạt',
                features: [
                    'Thanh toán theo từng sản phẩm',
                    'Sở hữu trọn đời sản phẩm đã mua',
                    'Nhận đầy đủ bản cập nhật',
                    'Phù hợp nhu cầu sử dụng ít',
                    'Truy cập đầy đủ kho tài nguyên'
                ],
                link: '/shop',
                color: 'from-slate-400 to-slate-500',
                icon: 'ShoppingBag',
                ctaText: 'Khám phá Cửa hàng'
            },
            {
                id: 'plan-yearly',
                title: 'Gói Cơ Bản 1 năm',
                price: '1.990k',
                originalPrice: '3.600k',
                description: 'Dành riêng cho Shop (Sản phẩm số)',
                tag: 'Phổ biến',
                features: [
                    'Truy cập không giới hạn Sản phẩm số',
                    'Tải Business Templates Premium',
                    'Tải Google Apps Script & Plug-ins',
                    'Cập nhật tài nguyên mới hàng tuần',
                    'Tiết kiệm 80% so với mua lẻ',
                    'Tham gia nhóm kín Zalo/Discord',
                    'Hỗ trợ qua thư viện câu hỏi ưu tiên'
                ],
                link: '/checkout/yearly-shop',
                color: 'from-orange-400 to-amber-500',
                icon: 'Crown',
                ctaText: 'Nâng cấp gói'
            },
            {
                id: 'plan-vip',
                title: 'Gói Premium 1 năm',
                price: '7.990k',
                originalPrice: '15.000k',
                description: 'Giải pháp toàn diện & Support 1:1',
                tag: 'VIP Support',
                features: [
                    'Tất cả quyền lợi gói Cơ bản',
                    'Support custom template theo yêu cầu',
                    'Tư vấn giải pháp tối ưu quy trình',
                    'Hỗ trợ kỹ thuật ưu tiên 24/7',
                    'Setup hệ thống ban đầu (Basic)',
                    'Coaching 1:1 trực tiếp với Mentor',
                    'Quyền truy cập sớm các khóa học mới'
                ],
                link: '/checkout/vip-year',
                color: 'from-purple-500 to-indigo-600',
                icon: 'Star',
                ctaText: 'Nâng cấp gói'
            }
        ]
    },
    {
        id: 'pricing-faq',
        type: 'faq',
        title: 'Câu hỏi thường gặp',
        subtitle: 'Giải đáp thắc mắc về các gói thành viên',
        items: [
            {
                question: 'Gói thành viên bao gồm những gì?',
                answer: 'Gói thành viên cho phép bạn truy cập vào kho tài liệu, video hướng dẫn và cộng đồng hỗ trợ. Gói cao cấp hơn sẽ có thêm quyền lợi tải tài nguyên Premium và support trực tiếp.'
            },
            {
                question: 'Tôi có thể huỷ đăng ký bất cứ lúc nào không?',
                answer: 'Có, bạn có thể huỷ gia hạn tự động bất cứ lúc nào trong trang quản lý tài khoản.'
            },
            {
                question: 'Có chính sách hoàn tiền không?',
                answer: 'Chúng tôi cam kết hoàn tiền trong vòng 7 ngày nếu bạn không hài lòng với chất lượng nội dung.'
            }
        ]
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container px-4 md:px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Bảng giá & Gói thành viên
                    </div>
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                        Các gói thành viên
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Chọn gói phù hợp với lộ trình phát triển của bạn. Đầu tư cho bản thân là khoản đầu tư thông minh nhất.
                    </p>
                </div>
            </div>

            <div className="container px-4 md:px-6 pb-20">
                <PricingSection section={PRICING_SECTIONS[1]} />
            </div>

            <div className="bg-muted/30 py-20">
                <FAQSection section={PRICING_SECTIONS[2]} />
            </div>
        </div>
    );
}
