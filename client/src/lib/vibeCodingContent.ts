import { Section } from '@/types/sections';
import { COURSE_PRICING } from '@/constants/pricing';

export const VIBE_CODING_SECTIONS: Section[] = [
    {
        id: 'hero',
        type: 'hero',
        title: 'Bạn đang làm chủ công nghệ hay đang là "nô lệ" của những quy trình thủ công?',
        subtitle: 'Dừng lãng phí 2 giờ mỗi ngày cho những việc lặp lại vô nghĩa. Học cách để AI tự viết code, tự xây dựng công cụ cho bạn chỉ sau 10 ngày.',
        ctaText: `Đăng ký học ngay - chỉ ${COURSE_PRICING.VIBE_CODING.priceDisplay}`,
        ctaLink: '/checkout?courseId=vibe-coding-mastery',
        image: '/hero_vibe_coding.png',
        backgroundTheme: 'light',
        glowVariant: 0,
        highlight: 'Ưu đãi early bird dành riêng cho 50 học viên đăng ký sớm nhất hôm nay',
        items: [
            { icon: 'Check', title: 'Không cần học code phức tạp', description: 'Chỉ cần biết tiếng Việt và tư duy logic. AI làm phần khó nhất.' },
            { icon: 'Code', title: 'Sở hữu vĩnh viễn source code', description: 'Của 10 ứng dụng thực chiến giải quyết việc marketing, sales, admin.' },
            { icon: 'TrendingDown', title: 'Tiết kiệm hàng chục triệu', description: 'Tiền thuê dev và mua phần mềm mỗi năm. Đầu tư 1 lần dùng mãi mãi.' }
        ]
    },
    {
        id: 'agitation',
        type: 'stats',
        title: 'Cái giá của sự chần chừ đắt hơn bạn nghĩ!',
        subtitle: 'Bạn chấp nhận mất gần 40 triệu/năm hay đầu tư 1.790k một lần duy nhất?',
        content: 'Nếu tiếp tục làm việc theo cách cũ, đây là "hoá đơn" lãng phí bạn phải trả mỗi năm:',
        backgroundTheme: 'light',
        glowVariant: 1,
        items: [
            { title: 'Thuê freelancer/dev', description: '~ 5.000.000đ cho chỉ 2 tool đơn giản nhất.', icon: 'X' },
            { title: 'Mua phần mềm SaaS', description: '~ 3.600.000đ cho các phí thuê bao hàng tháng.', icon: 'X' },
            { title: 'Thời gian lãng phí', description: '~ 30.000.000đ (Dựa trên 1h/ngày x 300 ngày x 100k/h).', icon: 'X' }
        ]
    },
    {
        id: 'pain-points',
        type: 'features',
        title: 'Bạn đang làm chủ công nghệ hay đang là "nô lệ" của quy trình thủ công?',
        subtitle: 'Hãy thành thật, có phải bạn đang hì hục hì hục copy-paste file excel đến 8h tối trong khi đối thủ đã tan làm từ 5h?',
        backgroundTheme: 'light',
        glowVariant: 2,
        items: [
            {
                icon: 'Clock',
                title: 'Nỗi đau 1: Cỗ máy chạy cơm',
                description: 'Ngày nào cũng copy-paste dữ liệu, sửa từng dòng báo cáo. Bạn lãng phí 2 giờ mỗi ngày cho những việc vô nghĩa.'
            },
            {
                icon: 'ZapOff',
                title: 'Nỗi đau 2: Phụ thuộc IT',
                description: 'Mỗi lần cần sửa tính năng nhỏ lại phải "năn nỉ" đội IT hoặc chờ Freelancer cả tuần trời. Bạn mất quyền kiểm soát công việc.'
            },
            {
                icon: 'Bot',
                title: 'Nỗi đau 3: Bị AI đào thải',
                description: 'Biết chatGPT giỏi nhưng chưa biết biến nó thành "nhân viên lập trình". Người biết dùng AI tạo công cụ sẽ thay thế bạn.'
            }
        ]
    },
    {
        id: 'solution',
        type: 'comparison',
        title: 'Vibe coding - lối tắt cho người không chuyên',
        subtitle: 'Không cần học cú pháp khô khan. Năm 2026, lập trình là ra lệnh bằng tiếng Việt và copy-paste.',
        image: '/vibe_coding_solution.png',
        backgroundTheme: 'light',
        glowVariant: 3,
        items: [
            {
                title: 'Kiến trúc sư - là bạn',
                description: 'Bạn chỉ cần hiểu vấn đề của mình và đưa ra ý tưởng, luồng đi (Flow).',
                features: ['Chỉ cần biết tiếng Việt', 'Tư duy product mindset', 'Không cần máy tính khủng']
            },
            {
                title: 'Thợ xây AI - là nhân viên',
                description: 'AI sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm theo "Vibe" của bạn.',
                features: ['Viết code chuẩn 100%', 'Tự động triển khai lên web', 'Sửa lỗi trong 30 giây']
            }
        ]
    },
    {
        id: 'curriculum',
        type: 'curriculum',
        tag: 'Lộ trình',
        title: 'Lộ trình thực chiến 10 ngày - "cầm tay chỉ việc"',
        subtitle: 'Xây dựng 10 ứng dụng giải quyết nỗi đau sát sườn, từ marketing đến quản trị.',
        backgroundTheme: 'light',
        glowVariant: 4,
        items: [
            {
                title: "Module 1: Khởi động & tư duy",
                description: "Biến bạn từ người dùng công cụ thành người tạo ra công cụ (Tool Maker).",
                lessons: [
                    "Thiết lập môi trường vibe coding miễn phí (Cursor, Bolt, Replit)",
                    "Product mindset: Cách phân rã vấn đề cho AI hiểu",
                    "Prompt engineering: Công thức thần chú 3 bước có code ngay"
                ]
            },
            {
                title: "Module 2: 10 apps giải quyết việc thật",
                description: "Sở hữu trọn bộ 10 ứng dụng thực chiến (tiết kiệm >10 triệu thuê dev).",
                lessons: [
                    "Marketing: AI caption generator (viết content tự động) & QR branding",
                    "Marketing: Image watermark (đóng dấu hàng loạt sản phẩm trong 3s)",
                    "Văn phòng: Excel merger (gộp 10 file báo cáo thành 1 click) & invoice maker",
                    "Quản trị: Salary calculator (tính lương, bảo hiểm tự động) & eisenhower todo",
                    "Tiện ích: Personality dashboard & AI flashcard & voice to note (tiếng việt cực chuẩn)"
                ]
            },
            {
                title: "Module 3: Triển khai & monetization",
                description: "Đưa ứng dụng lên internet và đóng gói để bán lại hoặc nhận job freelancer.",
                lessons: [
                    "Deploy: Đưa ứng dụng lên cloud miễn phí trọn đời",
                    "Business model: Cách đóng gói, đặt giá và bán app kiếm tiền ngay"
                ]
            }
        ]
    },
    {
        id: 'the-stack',
        type: 'bonus',
        title: '💎 Gói chuyển giao công nghệ trị giá >17.500.000đ',
        subtitle: 'Đây không chỉ là học phí, đây là khoản đầu tư có "lãi suất" ngay lập tức khi bạn bán được ứng dụng đầu tiên.',
        image: '/bonus_gift_3d.png',
        backgroundTheme: 'light',
        glowVariant: 5,
        items: [
            {
                title: 'Khoá học master vibe coding',
                description: 'Quy trình từ ý tưởng đến sản phẩm thật hoàn chỉnh.',
                price: 5000000
            },
            {
                title: 'Full source code 10 mini apps',
                description: 'Mang về dùng ngay, hoặc bán lại với giá 1-2tr/app dễ dàng.',
                price: 10000000
            },
            {
                title: 'Bộ prompt "thần chú" triệu đô',
                description: 'Chỉ cần điền vào chỗ trống, AI tự "nhả" code chuẩn xác.',
                price: 2000000
            },
            {
                title: 'Private mentoring group',
                description: 'Cộng đồng hỗ trợ trọn đời, cập nhật công nghệ AI hàng tuần.',
                price: 500000
            }
        ]
    },
    {
        id: 'instructor',
        type: 'instructor-bio',
        title: 'Tôi không phải dân IT chuyên nghiệp. Tôi là Marketer giống bạn.',
        subtitle: 'Giảng viên: Liên - Người đã tự xây dựng hàng chục công cụ bằng Vibe Coding.',
        content: 'Tôi hiểu cảm giác bất lực khi phải phụ thuộc vào IT. Tôi ở đây để chia sẻ con đường ngắn nhất để bạn tự làm chủ công nghệ, giải phóng sức lao động và tối ưu hoá lợi nhuận kinh doanh.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
        id: 'faq',
        type: 'faq',
        title: 'Những nghi ngại phút chót?',
        backgroundTheme: 'light',
        glowVariant: 6,
        items: [
            { title: 'Học xong không làm được thì sao?', description: 'Cam kết: Nếu sau 3 ngày không tạo được app đầu tiên, hoàn tiền 100%. Không rủi ro.' },
            { title: 'Tôi có thể dùng ChatGPT miễn phí mà?', description: 'chatGPT chỉ đưa code rời rạc. Khoá này dạy bạn công thức "nấu" chúng thành món ăn thật.' },
            { title: 'Tôi bận quá không có thời gian học?', description: 'Vì bạn bận việc tay chân nên mới cần học. Đầu tư 10h học để tiết kiệm 1000h làm việc.' }
        ]
    },
    {
        id: 'cta-final',
        type: 'cta',
        variant: 'dark',
        title: 'Đừng chịu rủi ro bỏ lỡ kỹ năng của tương lai. Đăng ký ngay!',
        subtitle: `Chỉ còn một ít suất ưu đãi early bird trị giá ${COURSE_PRICING.VIBE_CODING.priceDisplay}. Giá sẽ tăng về 3.500.000đ rất sớm.`,
        ctaText: `Tôi muốn sở hữu gói chuyển giao này`,
        ctaLink: '/checkout?courseId=vibe-coding-mastery',
        backgroundTheme: 'dark',
        glowVariant: 7
    }
];
