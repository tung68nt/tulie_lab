import { Section } from '@/types/sections';
import { MEMBERSHIP_PRICING } from '@/constants/pricing';

export const DEFAULT_LANDING_PAGE_SECTIONS: Section[] = [
    {
        id: 'countdown-1',
        type: 'sales-countdown',
        title: 'Ưu đãi có hạn',
        subtitle: 'Đừng bỏ lỡ cơ hội sở hữu bộ công cụ Vibe Coding với giá tốt nhất',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'hero-1',
        type: 'hero',
        tag: 'PLATFORM',
        backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070',
        title: 'Biến ý tưởng thành Web App thực tế - Không cần biết code',
        subtitle: 'Giải pháp Gói xây dựng App đa lĩnh vực, đa mục đích với các công cụ AI. Từ idea trên giấy đến sản phẩm hoàn chỉnh trong vài tuần.',
        ctaText: 'Khám phá Khoá học',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'vibe-pain',
        type: 'content-block',
        tag: 'PROBLEMS',
        title: "Bạn có đang lãng phí thời gian và tiền bạc mỗi ngày?",
        subtitle: "Những rào cản khiến bạn dậm chân tại chỗ",
        items: [
            {
                title: "Thao tác thủ công lặp lại",
                description: "Ngày nào cũng phải copy-paste dữ liệu giữa 10 file Excel, sửa từng dòng báo cáo... Cảm giác như một \"cỗ máy chạy cơm\".",
                image: "https://images.unsplash.com/photo-1454165833772-d996d49510d1?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Bế tắc ý tưởng công nghệ",
                description: "Bạn nảy ra ý tưởng app hữu ích nhưng nghĩ đến việc thuê IT tốn vài chục triệu lại thôi.",
                image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Dùng AI chưa tới",
                description: "Chỉ dừng lại ở việc chat hỏi đáp, chưa biết biến AI thành \"nhân viên lập trình\" tạo ra công cụ riêng.",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop"
            }
        ],
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'vibe-solution',
        type: 'content',
        tag: 'SOLUTION',
        title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
        subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
        content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        imagePosition: "right",
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'testimonials-1',
        type: 'testimonials',
        tag: 'RESULTS',
        title: 'Thành viên đã làm được gì?',
        subtitle: 'Kết quả thực tế từ những người như bạn',
        backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2070',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'payment-1',
        type: 'payment',
        title: 'Thanh toán',
        subtitle: 'Bảo mật - Nhanh chóng - Tự động kích hoạt',
        image: '',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'cta-1',
        type: 'cta',
        title: 'Bắt đầu xây dựng app của bạn ngay hôm nay',
        subtitle: 'Đăng ký tham dự Khoá học miễn phí. Trải nghiệm 7 ngày. Không cần thẻ tín dụng.',
        ctaText: 'Đăng ký miễn phí',
        ctaLink: '/register',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_ABOUT_PAGE_SECTIONS: Section[] = [
    {
        id: 'about-hero',
        type: 'hero',
        title: 'Về The Tulie Lab',
        subtitle: 'Nơi biến người bình thường thành người xây dựng sản phẩm. Chúng tôi tin rằng ai cũng có thể tạo ra giá trị với công nghệ - chỉ cần đúng phương pháp và Consultant phù hợp.',
        ctaText: 'Xem Khoá học',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'about-mission',
        type: 'content',
        title: 'Sứ mệnh của chúng tôi',
        subtitle: 'Democratize Software Development',
        content: `Trước đây, xây dựng phần mềm là đặc quyền của những người học Computer Science 4 năm, hoặc những người có tiền thuê developer.

Vibe Coding thay đổi điều đó.

Với AI như ChatGPT, Cursor, v0... bất kỳ ai có ý tưởng đều có thể biến nó thành sản phẩm thực. Nhưng AI chỉ là công cụ - bạn vẫn cần:

• Tư duy hệ thống - Hiểu cách các thành phần kết nối với nhau

• Kỹ năng prompt - Yêu cầu AI đúng cách để nhận output tốt nhất

• Workflow hiệu quả - Biết khi nào dùng tool nào, tránh mất thời gian

• Consultant hướng dẫn - Có người giúp debug khi gặp vấn đề thực tế

The Tulie Lab cung cấp tất cả điều đó trong các Khoá học thực hành, và hỗ trợ xuyên suốt.`,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'about-method',
        type: 'process',
        title: 'Phương pháp Vibe Coding',
        subtitle: 'Thực hành bằng cách làm sản phẩm thật',
        items: [
            {
                title: 'Session 1-2: Foundation',
                description: 'Hiểu web app hoạt động thế nào, setup môi trường, làm quen AI tools.'
            },
            {
                title: 'Session 3-4: Build Core',
                description: 'Xây dựng tính năng chính của app bạn, database, API với sự hỗ trợ của AI.'
            },
            {
                title: 'Session 5-6: Polish & Deploy',
                description: 'Hoàn thiện UI, tối ưu performance, deploy lên hosting thật.'
            },
            {
                title: 'Session 7+: Scale',
                description: 'Tối ưu SEO, thêm tính năng, scale users, monetization strategy.'
            }
        ],
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'about-instructor',
        type: 'stats',
        title: 'Đội ngũ Consultant',
        subtitle: 'Thực chiến, không lý thuyết suông',
        items: [
            {
                title: 'Tulie (Founder)',
                description: '10+ năm kinh nghiệm Full-stack. Ex-Tech Lead tại các startup triệu USD. Đã build 50+ products.',
                icon: 'Code2'
            },
            {
                title: 'Community Mentors',
                description: 'Đội ngũ TA và mentors là Member xuất sắc đã ship sản phẩm thành công.',
                icon: 'Handshake'
            },
            {
                title: 'Guest speakers',
                description: 'Founders và CTOs từ các startup Việt Nam chia sẻ kinh nghiệm thực tế.',
                icon: 'Mic'
            }
        ],
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'about-cta',
        type: 'cta',
        title: 'Sẵn sàng bắt đầu?',
        subtitle: 'Tham gia cùng 1000+ Member đã thay đổi sự nghiệp với Vibe Coding.',
        ctaText: 'Đăng ký tham dự Khoá học miễn phí',
        ctaLink: '/register',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];



export const DEFAULT_VIBE_CODING_SECTIONS: Section[] = [
    {
        id: "vibe-hero",
        type: "hero",
        title: "VIBE CODING - KỶ NGUYÊN XÂY DỰNG SẢN PHẨM MỚI",
        subtitle: "The Tulie Lab tiên phong ứng dụng phương pháp Vibe Coding để giúp cá nhân và doanh nghiệp hiện thực hoá ý tưởng phần mềm chỉ bằng ngôn ngữ tự nhiên và tư duy hệ thống.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Tìm hiểu phương pháp",
        ctaLink: "#vibe-methodology",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-stats",
        type: "stats",
        title: "Tại sao nên dùng Vibe Coding?",
        subtitle: "Tốc độ và Hiệu quả vượt trội",
        items: [
            { title: "Tốc độ xây dựng", value: "x10", icon: "Zap", description: "Nhanh hơn 10 lần so với lập trình truyền thống" },
            { title: "Chi phí vận hành", value: "-80%", icon: "DollarSign", description: "Tiết kiệm tối đa nguồn lực nhân sự IT" },
            { title: "Khả năng tuỳ biến", value: "100%", icon: "Settings", description: "Thay đổi tính năng ngay lập tức theo yêu cầu" }
        ],
        isVisible: true,
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-methodology",
        type: "process",
        title: "Quy trình triển khai tại The Lab",
        subtitle: "Từ ý tưởng đến sản phẩm thực thụ",
        items: [
            { title: "Tư vấn & Phác thảo", description: "Đội ngũ chuyên gia giúp bạn định hình Flow và cấu trúc logic cho ứng dụng." },
            { title: "Tạo nguyên mẫu (MVP)", description: "Sử dụng các công cụ Vibe Coding (Cursor, Claude) để dựng nhanh bản demo trong vài giờ." },
            { title: "Kiểm thử & Nâng cấp", description: "Tối ưu hoá prompt và logic để đảm bảo ứng dụng vận hành mượt mà, chính xác." },
            { title: "Bàn giao & Hướng dẫn", description: "Chúng tôi chuyển giao source code và hướng dẫn bạn cách tự bảo trì bằng AI." }
        ],
        isVisible: true,
        order: 3,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-values",
        type: "benefits",
        tag: "CORE VALUES",
        title: "Giá trị cốt lõi",
        subtitle: "Không chỉ là code, đó là tư duy sản phẩm",
        items: [
            { title: "Tư duy Prompting", description: "Làm chủ cách giao tiếp với AI để tạo ra output chất lượng nhất.", icon: "MessageSquare" },
            { title: "Cấu trúc hệ thống", description: "Hiểu được cách các thành phần app kết nối với nhau một cách chuyên nghiệp.", icon: "Layers" },
            { title: "Khả năng mở rộng", description: "Sẵn sàng scale ứng dụng từ một công cụ đơn giản lên hệ thống phức tạp.", icon: "Maximize" }
        ],
        isVisible: true,
        order: 4,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-cta",
        type: "cta",
        title: "Bắt đầu hành trình Vibe Coding của bạn",
        subtitle: "Chúng tôi sẵn sàng đồng hành cùng bạn xây dựng những giải pháp đột phá.",
        ctaText: "Liên hệ tư vấn dịch vụ",
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_VIBE_CODING_COURSE_SECTIONS: Section[] = [
    {
        id: "vibe-hero",
        type: "hero",
        title: "BIẾN Ý TƯỞNG THÀNH ỨNG DỤNG THỰC TẾ TRONG 30 PHÚT",
        subtitle: "Làm chủ tư duy \"Vibe Coding\": Tự tay xây dựng 10 Mini Apps giải quyết công việc Marketing, Sales, Admin và Đời sống ngay lập tức.",
        content: "✅ Không cần học code phức tạp – Chỉ cần biết tiếng Việt và tư duy logic. \n ✅ Sở hữu vĩnh viễn Source Code của 10 ứng dụng thực chiến. \n ✅ Tiết kiệm hàng chục triệu đồng tiền thuê Dev và mua phần mềm mỗi năm.",
        image: "/images/heroes/vibe-coding.png",
        ctaText: "ĐĂNG KÝ HỌC NGAY - 1.790.000Đ",
        ctaLink: "/courses/vibe-coding-nguoi-moi",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-pain",
        type: "content-block",
        tag: "PAIN POINTS",
        title: "Bạn có đang lãng phí thời gian và tiền bạc mỗi ngày?",
        subtitle: "Những rào cản khiến bạn dậm chân tại chỗ",
        items: [
            {
                title: "Thao tác thủ công lặp lại",
                description: "Ngày nào cũng phải copy-paste dữ liệu giữa 10 file Excel, sửa từng dòng báo cáo... Cảm giác như một \"cỗ máy chạy cơm\".",
                image: "https://images.unsplash.com/photo-1454165833772-d996d49510d1?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Bế tắc ý tưởng công nghệ",
                description: "Bạn nảy ra ý tưởng app hữu ích nhưng nghĩ đến việc thuê IT tốn vài chục triệu lại thôi.",
                image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Dùng AI chưa tới",
                description: "Chỉ dừng lại ở việc chat hỏi đáp, chưa biết biến AI thành \"nhân viên lập trình\" tạo ra công cụ riêng.",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop"
            }
        ],
        isVisible: true,
        order: 2
    },
    {
        id: "vibe-agitation",
        type: "benefits",
        tag: "AGITATION",
        title: "Bài toán kinh tế: Không học thì mất gì?",
        subtitle: "Cái giá của sự chần chừ đắt hơn bạn nghĩ",
        items: [
            { title: "Thuê Freelancer/Dev", description: "~5.000.000đ/năm (cho 2 app đơn giản)", icon: "DollarSign" },
            { title: "Mua phần mềm SaaS", description: "~3.600.000đ/năm (300k/tháng)", icon: "CreditCard" },
            { title: "Thời gian lãng phí", description: "~30.000.000đ/năm (1h/ngày)", icon: "Clock" }
        ],
        isVisible: true,
        order: 3,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-solution",
        type: "content",
        tag: "SOLUTION",
        title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
        subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
        content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.\n\nTôi dạy bạn tư duy dùng AI để tạo ra công cụ phục vụ chính công việc của bạn.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        imagePosition: "right",
        isVisible: true,
        order: 4,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-value",
        type: "benefits",
        tag: "VALUES",
        title: "Giá trị vượt trội bạn nhận được",
        subtitle: "Khoản đầu tư có lãi suất ngay lập tức",
        items: [
            { title: "Kỹ năng vô giá", description: "Xây dựng BẤT KỲ ứng dụng nào bạn muốn trong tương lai.", icon: "Zap" },
            { title: "Sở hữu 10 Apps", description: "Trọn bộ Source Code trị giá > 10.000.000đ.", icon: "Code" },
            { title: "Tiết kiệm thời gian", description: "Giải phóng hàng trăm giờ làm việc thủ công mỗi năm.", icon: "Timer" }
        ],
        isVisible: true,
        order: 6,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-bonuses",
        type: "bonus",
        tag: "BONUSES",
        title: "Quà tặng độc quyền (Trị giá 5.000.000đ)",
        subtitle: "Dành cho học viên đăng ký hôm nay",
        items: [
            { title: "Ebook 'Vibe Coding Playbook'", description: "Cẩm nang tra cứu nhanh thuật ngữ & UI mẫu.", value: "Trị giá 500k" },
            { title: "Thư viện 'Thần Chú' Prompt", description: "Copy & Paste để code chạy ngay, ít lỗi.", value: "Trị giá 2M" },
            { title: "Full Source Code 10 Mini Apps", description: "Toàn quyền chỉnh sửa, đổi tên và kinh doanh.", value: "Trị giá 10M" },
            { title: "Private Group Support", description: "Hỗ trợ trọn đời, cập nhật công nghệ mới.", value: "Vô giá" }
        ],
        isVisible: true,
        order: 7,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-faq",
        type: "faq",
        tag: "FAQ",
        title: "Câu hỏi thường gặp",
        subtitle: "Giải đáp thắc mắc của bạn",
        items: [
            { question: "Tôi mù công nghệ có học được không?", answer: "Được. Các công cụ đều hiểu tiếng Việt, chỉ cần bạn có tư duy logic." },
            { question: "Máy tính cấu hình yếu học được không?", answer: "Được. Chúng ta sử dụng nền tảng Cloud (Web), máy văn phòng chạy tốt." },
            { question: "Hình thức học như thế nào?", answer: "Video quay sẵn 4K, xem lại trọn đời bất cứ lúc nào." },
            { question: "Nếu gặp lỗi thì sao?", answer: "Bạn có cộng đồng và đội ngũ hỗ trợ trong nhóm kín." }
        ],
        isVisible: true,
        order: 9,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-cta-sales",
        type: "cta",
        title: "Bắt đầu hành trình Vibe Coding của bạn ngay hôm nay",
        subtitle: "Làm chủ AI, giải phóng sức lao động và tự tay xây dựng những ứng dụng tuyệt vời.",
        ctaText: "Khám phá Khoá học",
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_HOME_SECTIONS: Section[] = [
    {
        id: "general-hero",
        type: "hero",
        tag: "WELCOME",
        title: "KHAI PHÁ SỨC MẠNH AI TRONG CÔNG VIỆC THỰC CHIẾN",
        subtitle: "Tại The Tulie Lab, chúng tôi giúp bạn làm chủ công nghệ và AI để tự động hóa quy trình, xây dựng ứng dụng chuyên sâu và tối ưu hiệu suất công việc vượt trội.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Khám phá Khoá học",
        ctaLink: "/courses",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "tulie-stats",
        type: "stats",
        tag: "NUMBERS",
        title: "Tulie Lab qua những con số",
        subtitle: "Đồng hành cùng sự phát triển của bạn",
        items: [
            { title: "Thành viên", value: "10,000+", icon: "Users", description: "Cộng đồng học tập năng động" },
            { title: "Kho tài nguyên", value: "500+", icon: "Package", description: "Templates & Scripts thực chiến" },
            { title: "Khoá học", value: "20+", icon: "GraduationCap", description: "Lộ trình từ cơ bản đến nâng cao" },
            { title: "Hệ sinh thái", value: "100%", icon: "Zap", description: "Hỗ trợ trọn đời & Cập nhật mới" }
        ],
        isVisible: true,
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-methodology",
        type: "coding-methods",
        tag: "STAGES",
        title: "5 Cấp độ xây dựng App với Vibe Coding",
        subtitle: "Học cách làm chủ AI để tạo ra sản phẩm thực thụ",
        rowConfig: [
            { key: "feasibility", label: "Khả thi với Vibe Coding?", icon: "Check" },
            { key: "goal", label: "Mục tiêu", icon: "Target" },
            { key: "ai_usage", label: "Cách dùng AI (The Vibe)", icon: "Bot" },
            { key: "data", label: "Dữ liệu (Data)", icon: "Database" },
            { key: "limits", label: "Giới hạn", icon: "Ban" },
            { key: "output", label: "Sản phẩm đầu ra (Thực tế)", icon: "Package" }
        ],
        items: [
            {
                id: "level-1",
                name: "Cấp độ 1: Chat & Ship",
                subtitle: "(One-shot Prompting)",
                icon: "MessageSquare",
                color: "from-blue-400 to-blue-600",
                time: "30 phút - 2 giờ",
                stepsDetail: {
                    feasibility: { detail: "✅ Rất dễ", status: "ok" },
                    goal: { detail: "Làm cho vui/Demo. Xem ý tưởng hình hài ra sao.", status: "ok" },
                    ai_usage: { detail: '"Đưa hết cho AI". Ra 1 lệnh dài, AI trả về 1 cục code. Hỏng thì tạo lại cái mới.', status: "ok" },
                    data: { detail: "Dữ liệu cứng (Fake). Tất cả tab đi là mất hết.", status: "ok" },
                    limits: { detail: 'Chỉ dùng được 1 lần, khó sửa đổi sâu. App "chết" (tĩnh).', status: "warn" },
                    output: { detail: "Máy tính, Game đơn giản (Snake, Caro), Thiệp nhạc.", status: "ok" }
                }
            },
            {
                id: "level-2",
                name: "Cấp độ 2: Vẽ rồi Code",
                subtitle: "(Iterative Prompting)",
                icon: "Palette",
                color: "from-purple-400 to-purple-600",
                time: "2-6 giờ",
                stepsDetail: {
                    feasibility: { detail: "✅ Dễ", status: "ok" },
                    goal: { detail: "Làm cho đẹp. Giao diện đúng ý, đúng màu thương hiệu.", status: "ok" },
                    ai_usage: { detail: '"Vừa nhìn vừa sửa". Ra lệnh -> Xem kết quả -> Khoanh vùng chỗ sai bảo AI sửa lại (In-painting/Edit).', status: "ok" },
                    data: { detail: "Dữ liệu giả định dạng JSON. Nhìn như thật nhưng chưa lưu.", status: "ok" },
                    limits: { detail: 'Đẹp nhưng "rỗng ruột". Chỉ có bề ngoài (Frontend).', status: "warn" },
                    output: { detail: "Landing Page, Portfolio, Dashboard mẫu (UI Kit).", status: "ok" }
                }
            },
            {
                id: "level-3",
                name: "Cấp độ 3: Ghép Lego",
                subtitle: "(Data Integration)",
                icon: "Layers",
                color: "from-green-400 to-green-600",
                time: "1-3 ngày",
                stepsDetail: {
                    feasibility: { detail: "✅ Trung bình", status: "ok" },
                    goal: { detail: "Làm cho chạy. Lưu được thông tin, tính toán đúng.", status: "ok" },
                    ai_usage: { detail: '"Ghép não cho AI". Yêu cầu AI viết các hàm xử lý (API) để nối với Database (Supabase/Firebase).', status: "ok" },
                    data: { detail: "Database thật: Biết tạo bảng (Table), biết quan hệ (Relation) giữa User và Bài viết.", status: "ok" },
                    limits: { detail: "Có thể chạy sai logic nếu Prompt không chặt chẽ.", status: "warn" },
                    output: { detail: "App To-Do, App Chat nội bộ, Blog cá nhân, CMS nhỏ.", status: "ok" }
                }
            },
            {
                id: "level-4",
                name: "Cấp độ 4: Viết Kế Hoạch Chi Tiết",
                subtitle: "(Modular Coding)",
                icon: "FileText",
                color: "from-orange-400 to-orange-600",
                time: "1-2 tuần",
                stepsDetail: {
                    feasibility: { detail: "⚠️ Khó (Cần kỹ năng chia nhỏ)", status: "warn" },
                    goal: { detail: "Làm cho gọn. Code dễ sửa, dễ nâng cấp về sau.", status: "ok" },
                    ai_usage: { detail: '"Quản lý nhân sự AI". Bảo AI: "Tạo file A làm việc này, file B làm việc kia". Không code chung 1 file.', status: "ok" },
                    data: { detail: "Luồng dữ liệu (Flow): Kiểm soát dữ liệu nạp vào/lấy ra chặt chẽ, tránh lỗi logic.", status: "ok" },
                    limits: { detail: "Đòi hỏi người dùng phải hiểu cấu trúc thư mục code.", status: "warn" },
                    output: { detail: "Hệ thống SaaS nhỏ: Công cụ Marketing, CRM cho công ty nhỏ, Web đặt lịch.", status: "ok" }
                }
            },
            {
                id: "level-5",
                name: "Cấp độ 5: Làm Chuyên Nghiệp",
                subtitle: "(MVP Launch)",
                icon: "Rocket",
                color: "from-indigo-400 to-indigo-600",
                time: "3-8 tuần",
                stepsDetail: {
                    feasibility: { detail: "⚠️ Rất khó (Cần tư duy Product)", status: "warn" },
                    goal: { detail: "Làm để bán/Dùng thật. Ổn định, ít lỗi, có người dùng thật.", status: "ok" },
                    ai_usage: { detail: '"Tổng công trình sư". Dùng AI để: Viết code + Viết test + Scan lỗi bảo mật + Tối ưu SEO.', status: "ok" },
                    data: { detail: "Bảo vệ dữ liệu: Phân quyền (AI xem được cái gì), Sao lưu dữ liệu (Backup).", status: "ok" },
                    limits: { detail: "Cần kiến thức về triển khai (Deploy), tên miền, chi phí server.", status: "warn" },
                    output: { detail: "Startup công nghệ: Sàn TMĐT ngách, App học tập, Mạng xã hội nội bộ.", status: "ok" }
                }
            }
        ],
        isVisible: true,
        order: 3,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "general-cta",
        type: "cta",
        tag: "ACTION",
        title: "Sẵn sàng nâng tầm kỹ năng của bạn?",
        subtitle: "Khám phá ngay các khoá học và bộ công cụ giúp bạn bứt phá trong kỷ nguyên AI.",
        ctaText: "Xem tất cả Khoá học",
        ctaLink: "/courses",
        isVisible: true,
        order: 4,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "video-intro",
        type: "video",
        title: "Video Giới Thiệu",
        tag: "INTRO",
        subtitle: "Xem video để hiểu rõ hơn về phương pháp Vibe Coding",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video
        mediaAspectRatio: "16/9",
        animation: "fade-up",
        order: 5,
        isVisible: true,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: "gallery-showcase",
        type: "gallery",
        title: "Thư Viện Ảnh",
        tag: "GALLERY",
        subtitle: "Một số hình ảnh hoạt động tại The Tulie Lab",
        items: [
            { title: "Workshop Offline", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", description: "Buổi offline chia sẻ kinh nghiệm." },
            { title: "Team Building", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", description: "Hoạt động gắn kết thành viên." },
            { title: "Lớp học Zoom", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", description: "Học trực tuyến hàng tuần." }
        ],
        appearance: "glass",
        order: 6,
        isVisible: true,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];


export const DEFAULT_INSTRUCTORS_PAGE_SECTIONS: Section[] = [
    {
        id: 'hero-instructors',
        type: 'hero',
        title: 'Đội Ngũ Chuyên Gia',
        subtitle: 'Những người đồng hành cùng bạn trên con đường chinh phục công nghệ.',
        ctaText: 'Xem khóa học',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'instructor-bio-main',
        type: 'instructor-bio',
        title: 'Về Người Sáng Lập',
        subtitle: 'Tung Nguyen - Founder The Tulie Lab',
        content: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và tư vấn giải pháp công nghệ, tôi tin rằng bất cứ ai cũng có thể làm chủ công cụ và tạo ra giá trị đột phá.',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'instructor-grid-1',
        type: 'instructor-grid',
        title: 'Các Giảng Viên Tiêu Biểu',
        subtitle: 'Chuyên gia hàng đầu trong các lĩnh vực',
        items: [],
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'cta-instructors',
        type: 'cta',
        title: 'Trở thành Giảng viên?',
        subtitle: 'Bạn muốn chia sẻ kiến thức? Hãy gia nhập đội ngũ của chúng tôi.',
        ctaText: 'Ứng tuyển ngay',
        ctaLink: '/contact',
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_PRICING_SECTIONS: Section[] = [
    {
        id: 'pricing-header',
        type: 'content',
        title: 'Bảng giá & Gói thành viên',
        subtitle: 'Chọn gói phù hợp với lộ trình phát triển của bạn',
        content: 'Đầu tư cho kiến thức là khoản đầu tư sinh lời nhất. Tham gia ngay cộng đồng Vibe Coding để tiếp cận kho tài nguyên và kiến thức khổng lồ.',
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'pricing-plans',
        type: 'pricing',
        tag: 'PRICING',
        title: 'Các gói phổ biến',
        subtitle: 'Được nhiều thành viên lựa chọn',
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6,
        items: [
            {
                id: 'plan-retail',
                title: 'Cửa Hàng (Retail)',
                price: 'Từ 99k',
                description: 'Mua lẻ từng Template/Script phục vụ nhu cầu cụ thể.',
                tag: 'TIẾT KIỆM',
                features: [
                    'Sở hữu vĩnh viễn file đã mua',
                    'Có video hướng dẫn sử dụng',
                    'Hỗ trợ fix lỗi phát sinh',
                    'Phù hợp nhu cầu ngắn hạn',
                    'Mua 1 lần dùng mãi mãi'
                ],
                link: '/shop',
                icon: 'ShoppingBag',
                ctaText: 'Ghé Cửa Hàng'
            },
            {
                id: 'plan-pro',
                title: 'Hội Viên (Pro)',
                price: '499k/tháng',
                originalPrice: '999k',
                description: 'Truy cập toàn bộ Khóa học & Kho Template.',
                tag: 'KHUYÊN DÙNG',
                features: [
                    'Học Full khóa AI & Vibe Coding',
                    'Tải miễn phí mọi Template',
                    'Tham gia nhóm hỗ trợ kín',
                    'Update kiến thức hàng tuần',
                    'Tiết kiệm 90% so với mua lẻ'
                ],
                link: '/register',
                icon: 'Zap',
                ctaText: 'Đăng Ký Hội Viên'
            },
            {
                id: 'plan-biz',
                title: 'Giải Pháp (Biz)',
                price: 'Liên hệ',
                description: 'Xây dựng hệ thống riêng cho Doanh nghiệp/Team.',
                tag: 'CAO CẤP',
                features: [
                    'Thiết kế Dashboard theo yêu cầu',
                    'Build App nội bộ riêng',
                    'Đào tạo nhân sự In-house',
                    'Support 1:1 ưu tiên',
                    'Bảo hành hệ thống 12 tháng'
                ],
                link: '/contact',
                icon: 'ShieldCheck',
                ctaText: 'Liên Hệ Báo Giá'
            }
        ]
    },
    {
        id: 'pricing-faq',
        type: 'faq',
        tag: 'FAQ',
        title: 'Câu hỏi thường gặp',
        subtitle: 'Giải đáp thắc mắc về các gói thành viên',
        order: 3,
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
        ],
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_CALENDAR_SECTIONS: Section[] = [
    {
        id: 'calendar-hero',
        type: 'hero',
        title: 'Lịch hoạt động',
        subtitle: 'Đừng bỏ lỡ các sự kiện nổi bật',
        content: 'Cập nhật lịch khai giảng, webinar và workshop mới nhất từ The Tulie Lab.',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop',
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'calendar-main',
        type: 'calendar',
        title: 'Sự kiện sắp tới',
        subtitle: 'Lịch trình các hoạt động trong tháng',
        isVisible: true,
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    },
    {
        id: 'calendar-cta',
        type: 'cta',
        title: 'Không tìm thấy lịch phù hợp?',
        subtitle: 'Liên hệ với chúng tôi để được tư vấn lộ trình riêng.',
        ctaText: 'Liên hệ tư vấn',
        ctaLink: '/contact',
        isVisible: true,
        order: 3,
        backgroundImage: '',
        backgroundTheme: 'auto',
        overlayOpacity: 0.6
    }
];
