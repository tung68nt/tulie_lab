import { Section } from '@/types/sections';

export const VIBE_CODING_SECTIONS: Section[] = [
    {
        id: 'hero',
        type: 'hero',
        title: 'BIẾN Ý TƯỞNG THÀNH ỨNG DỤNG THỰC TẾ TRONG 30 PHÚT',
        subtitle: 'Làm chủ tư duy "Vibe Coding": Tự tay xây dựng 10 Mini Apps giải quyết công việc Marketing, Sales, Admin và Đời sống ngay lập tức.',
        ctaText: 'ĐĂNG KÝ HỌC NGAY - CHỈ 1.790.000Đ',
        image: '/hero_vibe_coding.png', // Assuming images are moved to public
        highlight: 'Ưu đãi Early Bird cho 50 học viên đăng ký sớm',
        items: [
            { icon: 'Check', title: 'Không cần học code phức tạp', description: 'Chỉ cần biết tiếng Việt và tư duy logic.' },
            { icon: 'Code', title: 'Sở hữu vĩnh viễn Source Code', description: 'Của 10 ứng dụng thực chiến.' },
            { icon: 'TrendingDown', title: 'Tiết kiệm hàng chục triệu', description: 'Tiền thuê Dev và mua phần mềm mỗi năm.' }
        ]
    },
    {
        id: 'pain-points',
        type: 'features',
        title: 'Bạn có đang lãng phí thời gian và tiền bạc mỗi ngày?',
        subtitle: 'Là một người làm kinh doanh, văn phòng hay quản lý, chắc hẳn bạn từng gặp những cảnh này:',
        items: [
            {
                icon: 'Clock',
                title: 'Thao tác thủ công lặp lại',
                description: 'Ngày nào cũng phải copy-paste dữ liệu, sửa từng dòng báo cáo... Cảm giác như một "cỗ máy chạy cơm".'
            },
            {
                icon: 'ZapOff',
                title: 'Bế tắc ý tưởng công nghệ',
                description: 'Nảy ra ý tưởng tuyệt vời nhưng nghĩ đến việc thuê IT tốn vài chục triệu lại thôi.'
            },
            {
                icon: 'Bot',
                title: 'Dùng AI chưa tới',
                description: 'Biết ChatGPT rất giỏi nhưng chưa biết biến nó thành "nhân viên lập trình" cho mình.'
            }
        ]
    },
    {
        id: 'solution',
        type: 'comparison',
        title: 'Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên',
        subtitle: 'Vibe Coding không bắt bạn phải học thuộc lòng cú pháp Python hay JavaScript khô khan.',
        image: '/vibe_coding_solution.png',
        items: [
            { title: 'Kiến Trúc Sư', description: 'Bạn đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.' },
            { title: 'Thợ Xây AI', description: 'AI sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.' }
        ]
    },
    {
        id: 'curriculum',
        type: 'curriculum',
        title: 'Lộ Trình Thực Chiến 10 Ngày - Cầm Tay Chỉ Việc',
        subtitle: 'Hệ thống bài giảng được thiết kế khoa học, đi từ tư duy đến thực chiến 100%.',
        items: [
            {
                title: "MODULE 1: KHỞI ĐỘNG & TƯ DUY",
                description: "Móng nhà vững chắc cho hành trình AI Coding.",
                lessons: [
                    "Bài 1: Thiết lập môi trường Vibe Coding (Cursor, Bolt, Replit)",
                    "Bài 2: Product Mindset: Phân rã vấn đề cho AI hiểu",
                    "Bài 3: Prompt Engineering: Công thức thần chú 3 bước"
                ]
            },
            {
                title: "MODULE 2: XÂY DỰNG 10 SUPER APPS",
                description: "Thực hành 100% xây dựng các ứng dụng thực tế.",
                lessons: [
                    "App 1: Content Generator & App 2: QR Branding",
                    "App 3: Image Watermark & App 4: Excel Merger",
                    "App 5: Invoice Maker & App 6: Salary Calculator",
                    "App 7: Eisenhower Todo & App 8: AI Flashcard",
                    "App 9: Voice to Note & App 10: Personal Dashboard"
                ]
            },
            {
                title: "MODULE 3: TRIỂN KHAI & KIẾM TIỀN",
                description: "Đưa ứng dụng lên Internet và tối ưu hóa giá trị.",
                lessons: [
                    "Bài 11: Deploy: Đưa ứng dụng lên Cloud miễn phí",
                    "Bài 12: Business Model: Cách đóng gói và bán app"
                ]
            }
        ]
    },
    {
        id: 'value',
        type: 'stats',
        title: '1.790.000Đ là Đắt hay Rẻ?',
        subtitle: 'Đầu tư một lần, sở hữu kỹ năng và công cụ trọn đời.',
        items: [
            { title: 'Freelancer', description: '1.5tr / 1 App đơn giản', icon: 'X' },
            { title: 'Phần mềm SaaS', description: '2.4tr / năm / 1 tool', icon: 'X' },
            { title: 'Thời gian thủ công', description: 'VÔ GIÁ', icon: 'X' }
        ]
    },
    {
        id: 'bonus',
        type: 'bonus',
        title: 'QUÀ TẶNG ĐỘC QUYỀN TRỊ GIÁ 5.000.000Đ',
        subtitle: 'Đăng ký trong hôm nay để nhận trọn bộ quà tặng giới hạn.',
        image: '/bonus_gift_3d.png',
        items: [
            { title: 'Vibe Coding Playbook', description: 'Cẩm nang tra cứu nhanh' },
            { title: 'Thư viện Thần Chú', description: 'Copy & Paste để AI viết code chuẩn' },
            { title: 'Full Source Code 10 Apps', description: 'Toàn quyền chỉnh sửa và kinh doanh' },
            { title: 'Private Group', description: 'Cộng đồng hỗ trợ trọn đời' }
        ]
    },
    {
        id: 'instructor',
        type: 'instructor-bio',
        title: 'Giảng viên: Tôi là Liên',
        subtitle: 'Tôi không phải IT chuyên nghiệp. Tôi là Marketer giống bạn.',
        content: 'Tôi đã từng chật vật với quy trình thủ công cho đến khi tìm thấy Vibe Coding. Tôi ở đây để chia sẻ con đường ngắn nhất để bạn làm được việc ngay.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
        id: 'faq',
        type: 'faq',
        title: 'CÂU HỎI THƯỜNG GẶP',
        items: [
            { title: 'Tôi mù công nghệ có học được không?', description: 'Hoàn toàn được. Các công cụ đều hiểu tiếng Việt.' },
            { title: 'Máy tính yếu có chạy được không?', description: 'Được. Chúng ta dùng công cụ Cloud trên trình duyệt.' },
            { title: 'Nếu gặp lỗi thì sao?', description: 'Bạn có cộng đồng hỗ trợ giải đáp 24/7.' }
        ]
    },
    {
        id: 'cta-final',
        type: 'cta',
        variant: 'dark',
        title: 'Đừng để AI thay thế bạn. Hãy học cách điều khiển nó.',
        subtitle: 'Nhận trọn bộ 10 Source Code + Quà tặng độc quyền.',
        ctaText: 'ĐĂNG KÝ KHÓA HỌC NGAY - 1.790.000Đ'
    }
];
