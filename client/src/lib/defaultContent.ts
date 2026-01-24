import { Section } from '@/types/sections';
import { MEMBERSHIP_PRICING } from '@/constants/pricing';

export const DEFAULT_LANDING_PAGE_SECTIONS: Section[] = [
    {
        id: 'countdown-1',
        type: 'sales-countdown',
        title: 'Ưu đãi có hạn',
        subtitle: 'Đừng bỏ lỡ cơ hội sở hữu bộ công cụ Vibe Coding với giá tốt nhất',
    },
    {
        id: 'hero-1',
        type: 'hero',
        title: 'Biến ý tưởng thành Web App thực tế - Không cần biết code',
        subtitle: 'Giải pháp Gói xây dựng App đa lĩnh vực, đa mục đích với các công cụ AI. Từ idea trên giấy đến sản phẩm hoàn chỉnh trong vài tuần.',
        ctaText: 'Khám phá Khoá học',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'vibe-pain',
        type: 'content-block',
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
        ]
    },
    {
        id: 'vibe-solution',
        type: 'content',
        title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
        subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
        content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        imagePosition: "right"
    },
    {
        id: 'testimonials-1',
        type: 'testimonials',
        title: 'Thành viên đã làm được gì?',
        subtitle: 'Kết quả thực tế từ những người như bạn'
    },
    {
        id: 'payment-1',
        type: 'payment',
        title: 'Thanh toán',
        subtitle: 'Bảo mật - Nhanh chóng - Tự động kích hoạt',
        image: ''
    },
    {
        id: 'cta-1',
        type: 'cta',
        title: 'Bắt đầu xây dựng app của bạn ngay hôm nay',
        subtitle: 'Đăng ký tham dự Khoá học miễn phí. Trải nghiệm 7 ngày. Không cần thẻ tín dụng.',
        ctaText: 'Đăng ký miễn phí',
        ctaLink: '/register'
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
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
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
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop'
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
        ]
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
        ]
    },
    {
        id: 'about-cta',
        type: 'cta',
        title: 'Sẵn sàng bắt đầu?',
        subtitle: 'Tham gia cùng 1000+ Member đã thay đổi sự nghiệp với Vibe Coding.',
        ctaText: 'Đăng ký tham dự Khoá học miễn phí',
        ctaLink: '/register'
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
        order: 1
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
        order: 2
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
        order: 3
    },
    {
        id: "vibe-values",
        type: "benefits",
        title: "Giá trị cốt lõi",
        subtitle: "Không chỉ là code, đó là tư duy sản phẩm",
        items: [
            { title: "Tư duy Prompting", description: "Làm chủ cách giao tiếp với AI để tạo ra output chất lượng nhất.", icon: "MessageSquare" },
            { title: "Cấu trúc hệ thống", description: "Hiểu được cách các thành phần app kết nối với nhau một cách chuyên nghiệp.", icon: "Layers" },
            { title: "Khả năng mở rộng", description: "Sẵn sàng scale ứng dụng từ một công cụ đơn giản lên hệ thống phức tạp.", icon: "Maximize" }
        ],
        isVisible: true,
        order: 4
    },
    {
        id: "vibe-cta",
        type: "cta",
        title: "Bắt đầu hành trình Vibe Coding của bạn",
        subtitle: "Chúng tôi sẵn sàng đồng hành cùng bạn xây dựng những giải pháp đột phá.",
        ctaText: "Liên hệ tư vấn dịch vụ",
        ctaLink: "/contact"
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
        order: 1
    },
    {
        id: "vibe-pain",
        type: "content-block",
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
        title: "Bài toán kinh tế: Không học thì mất gì?",
        subtitle: "Cái giá của sự chần chừ đắt hơn bạn nghĩ",
        items: [
            { title: "Thuê Freelancer/Dev", description: "~5.000.000đ/năm (cho 2 app đơn giản)", icon: "DollarSign" },
            { title: "Mua phần mềm SaaS", description: "~3.600.000đ/năm (300k/tháng)", icon: "CreditCard" },
            { title: "Thời gian lãng phí", description: "~30.000.000đ/năm (1h/ngày)", icon: "Clock" }
        ],
        isVisible: true,
        order: 3
    },
    {
        id: "vibe-solution",
        type: "content",
        title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
        subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
        content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.\n\nTôi dạy bạn tư duy dùng AI để tạo ra công cụ phục vụ chính công việc của bạn.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        imagePosition: "right",
        isVisible: true,
        order: 4
    },
    {
        id: "vibe-value",
        type: "benefits",
        title: "Giá trị vượt trội bạn nhận được",
        subtitle: "Khoản đầu tư có lãi suất ngay lập tức",
        items: [
            { title: "Kỹ năng vô giá", description: "Xây dựng BẤT KỲ ứng dụng nào bạn muốn trong tương lai.", icon: "Zap" },
            { title: "Sở hữu 10 Apps", description: "Trọn bộ Source Code trị giá > 10.000.000đ.", icon: "Code" },
            { title: "Tiết kiệm thời gian", description: "Giải phóng hàng trăm giờ làm việc thủ công mỗi năm.", icon: "Timer" }
        ],
        isVisible: true,
        order: 6
    },
    {
        id: "vibe-bonuses",
        type: "bonus",
        title: "Quà tặng độc quyền (Trị giá 5.000.000đ)",
        subtitle: "Dành cho học viên đăng ký hôm nay",
        items: [
            { title: "Ebook 'Vibe Coding Playbook'", description: "Cẩm nang tra cứu nhanh thuật ngữ & UI mẫu.", value: "Trị giá 500k" },
            { title: "Thư viện 'Thần Chú' Prompt", description: "Copy & Paste để code chạy ngay, ít lỗi.", value: "Trị giá 2M" },
            { title: "Full Source Code 10 Mini Apps", description: "Toàn quyền chỉnh sửa, đổi tên và kinh doanh.", value: "Trị giá 10M" },
            { title: "Private Group Support", description: "Hỗ trợ trọn đời, cập nhật công nghệ mới.", value: "Vô giá" }
        ],
        isVisible: true,
        order: 7
    },
    {
        id: "vibe-faq",
        type: "faq",
        title: "Câu hỏi thường gặp",
        subtitle: "Giải đáp thắc mắc của bạn",
        items: [
            { question: "Tôi mù công nghệ có học được không?", answer: "Được. Các công cụ đều hiểu tiếng Việt, chỉ cần bạn có tư duy logic." },
            { question: "Máy tính cấu hình yếu học được không?", answer: "Được. Chúng ta sử dụng nền tảng Cloud (Web), máy văn phòng chạy tốt." },
            { question: "Hình thức học như thế nào?", answer: "Video quay sẵn 4K, xem lại trọn đời bất cứ lúc nào." },
            { question: "Nếu gặp lỗi thì sao?", answer: "Bạn có cộng đồng và đội ngũ hỗ trợ trong nhóm kín." }
        ],
        isVisible: true,
        order: 9
    },
    {
        id: "vibe-cta-sales",
        type: "cta",
        title: "Bắt đầu hành trình Vibe Coding của bạn ngay hôm nay",
        subtitle: "Làm chủ AI, giải phóng sức lao động và tự tay xây dựng những ứng dụng tuyệt vời.",
        ctaText: "Khám phá Khoá học",
        ctaLink: "/courses/vibe-coding-nguoi-moi"
    }
];

export const DEFAULT_HOME_SECTIONS: Section[] = [
    {
        id: "general-hero",
        type: "hero",
        title: "KHAI PHÁ SỨC MẠNH AI TRONG CÔNG VIỆC THỰC CHIẾN",
        subtitle: "Tại The Tulie Lab, chúng tôi giúp bạn làm chủ công nghệ và AI để tự động hóa quy trình, xây dựng ứng dụng chuyên sâu và tối ưu hiệu suất công việc vượt trội.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Khám phá Khoá học",
        ctaLink: "/courses",
        isVisible: true,
        order: 1
    },
    {
        id: "tulie-stats",
        type: "stats",
        title: "Tulie Lab qua những con số",
        subtitle: "Đồng hành cùng sự phát triển của bạn",
        items: [
            { title: "Thành viên", value: "10,000+", icon: "Users", description: "Cộng đồng học tập năng động" },
            { title: "Kho tài nguyên", value: "500+", icon: "Package", description: "Templates & Scripts thực chiến" },
            { title: "Khoá học", value: "20+", icon: "GraduationCap", description: "Lộ trình từ cơ bản đến nâng cao" },
            { title: "Hệ sinh thái", value: "100%", icon: "Zap", description: "Hỗ trợ trọn đời & Cập nhật mới" }
        ],
        isVisible: true,
        order: 2
    },
    {
        id: "tulie-benefits",
        type: "benefits",
        title: "Tạo sao chọn chúng tôi?",
        subtitle: "Phương pháp học tập hiện đại và hiệu quả",
        items: [
            { title: "Học qua dự án thật", description: "Không chỉ là lý thuyết, bạn học bằng cách trực tiếp xây dựng sản phẩm có thể sử dụng ngay.", icon: "Sparkles" },
            { title: "Sức mạnh từ AI", description: "Ứng dụng các công cụ AI hàng đầu (ChatGPT, Claude, Cursor) để tăng tốc độ làm việc gấp 10 lần.", icon: "Bot" },
            { title: "Cộng đồng hỗ trợ", description: "Tham gia nhóm kín để trao đổi, giải đáp thắc mắc và kết nối cùng những người cùng đam mê.", icon: "MessageCircle" }
        ],
        isVisible: true,
        order: 3
    },
    {
        id: "general-cta",
        type: "cta",
        title: "Sẵn sàng nâng tầm kỹ năng của bạn?",
        subtitle: "Khám phá ngay các khoá học và bộ công cụ giúp bạn bứt phá trong kỷ nguyên AI.",
        ctaText: "Xem tất cả Khoá học",
        ctaLink: "/courses",
        isVisible: true,
        order: 4
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
        image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'instructor-bio-main',
        type: 'instructor-bio',
        title: 'Về Người Sáng Lập',
        subtitle: 'Tung Nguyen - Founder The Tulie Lab',
        content: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và tư vấn giải pháp công nghệ, tôi tin rằng bất cứ ai cũng có thể làm chủ công cụ và tạo ra giá trị đột phá.'
    },
    {
        id: 'instructor-grid-1',
        type: 'instructor-grid',
        title: 'Các Giảng Viên Tiêu Biểu',
        subtitle: 'Chuyên gia hàng đầu trong các lĩnh vực'
    },
    {
        id: 'cta-instructors',
        type: 'cta',
        title: 'Trở thành Giảng viên?',
        subtitle: 'Bạn muốn chia sẻ kiến thức? Hãy gia nhập đội ngũ của chúng tôi.',
        ctaText: 'Ứng tuyển ngay',
        ctaLink: '/contact'
    }
];

export const DEFAULT_PRICING_SECTIONS: Section[] = [
    {
        id: 'pricing-header',
        type: 'content',
        title: 'Bảng giá & Gói thành viên',
        subtitle: 'Chọn gói phù hợp với lộ trình phát triển của bạn',
        content: 'Đầu tư cho kiến thức là khoản đầu tư sinh lời nhất. Tham gia ngay cộng đồng Vibe Coding để tiếp cận kho tài nguyên và kiến thức khổng lồ.',
        order: 1
    },
    {
        id: 'pricing-plans',
        type: 'pricing',
        title: 'Các gói phổ biến',
        subtitle: 'Được nhiều thành viên lựa chọn',
        order: 2,
        items: [
            {
                id: 'plan-retail',
                title: 'Mua lẻ (Single)',
                price: 'Mua theo tool',
                description: 'Mua lẻ từng sản phẩm số phù hợp với nhu cầu sử dụng thực tế.',
                tag: 'Linh hoạt',
                features: [
                    'Thanh toán theo từng sản phẩm',
                    'Sở hữu vĩnh viễn file',
                    'Nhận đầy đủ bản cập nhật',
                    'Tiết kiệm chi phí đầu tư',
                    'Hỗ trợ setup cơ bản'
                ],
                link: '/shop',
                icon: 'ShoppingBag',
                ctaText: 'Xem cửa hàng'
            },
            {
                id: 'plan-yearly',
                title: 'Gói Cơ Bản 1 năm',
                price: '1.990k',
                originalPrice: '3.600k',
                description: 'Truy cập và tải xuống KHÔNG GIỚI HẠN toàn bộ kho Template.',
                tag: 'Phổ biến',
                features: [
                    'Tải xuống Unlimited Template',
                    'Truy cập Template Premium mới nhất',
                    'Tải Google Apps Script & Plug-ins',
                    'Cập nhật tài nguyên mới hàng tuần',
                    'Tiết kiệm 80% so với mua lẻ',
                    'Tham gia nhóm kín Zalo/Discord',
                    'Hỗ trợ qua thư viện câu hỏi ưu tiên'
                ],
                link: '/checkout/pro-template',
                icon: 'Zap',
                ctaText: 'Nâng cấp gói'
            },
            {
                id: 'plan-vip',
                title: 'Gói Premium 1 năm',
                price: '7.990k',
                originalPrice: '15.000k',
                description: 'Giải pháp toàn diện & Support 1:1 trực tiếp.',
                tag: 'Best Value',
                features: [
                    'Tất cả quyền lợi gói Cơ bản',
                    'Support custom template theo yêu cầu',
                    'Tư vấn giải pháp tối ưu quy trình',
                    'Setup hệ thống Automation riêng',
                    'Hỗ trợ kỹ thuật ưu tiên 24/7',
                    'Coaching 1:1 trực tiếp với Mentor',
                    'Quyền truy cập sớm các tài nguyên mới'
                ],
                link: '/contact',
                icon: 'Crown',
                ctaText: 'Liên hệ tư vấn'
            }
        ]
    },
    {
        id: 'pricing-faq',
        type: 'faq',
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
        ]
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
        order: 1
    },
    {
        id: 'calendar-main',
        type: 'calendar',
        title: 'Sự kiện sắp tới',
        subtitle: 'Lịch trình các hoạt động trong tháng',
        isVisible: true,
        order: 2
    },
    {
        id: 'calendar-cta',
        type: 'cta',
        title: 'Không tìm thấy lịch phù hợp?',
        subtitle: 'Liên hệ với chúng tôi để được tư vấn lộ trình riêng.',
        ctaText: 'Liên hệ tư vấn',
        ctaLink: '/contact',
        isVisible: true,
        order: 3
    }
];
