import { Section } from '@/types/sections';
import { MEMBERSHIP_PRICING } from '@/constants/pricing';

export const DEFAULT_COURSES_PAGE_SECTIONS: Section[] = [
    {
        id: 'courses-heading',
        type: 'heading',
        name: 'Tiêu đề trang khóa học',
        title: 'Thư viện Khóa học',
        subtitle: 'Khám phá các khóa học chuyên sâu từ cơ bản đến nâng cao về Automation, Google Apps Script và tối ưu hóa quy trình doanh nghiệp.',
        tag: 'HỌC TẬP',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 0
    },
    {
        id: 'system-courses-main',
        type: 'system-courses',
        name: 'Danh sách khóa học',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export const DEFAULT_SHOP_PAGE_SECTIONS: Section[] = [
    {
        id: 'shop-heading',
        type: 'heading',
        name: 'Tiêu đề cửa hàng',
        title: 'Cửa hàng Phụ trợ',
        subtitle: 'Sở hữu các template, add-on và giải pháp dựng sẵn để tăng tốc quy trình làm việc của bạn ngay lập tức.',
        tag: 'CỬA HÀNG',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 2
    },
    {
        id: 'system-shop-main',
        type: 'system-shop',
        name: 'Cửa hàng sản phẩm',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export const DEFAULT_BLOG_PAGE_SECTIONS: Section[] = [
    {
        id: 'blog-heading',
        type: 'heading',
        name: 'Tiêu đề Blog',
        title: 'Góc chia sẻ',
        subtitle: 'Cập nhật kiến thức mới nhất về công nghệ, quản trị và các mẹo tối ưu quy trình làm việc hiệu quả.',
        tag: 'BLOG',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 4
    },
    {
        id: 'system-blog-main',
        type: 'system-blog',
        name: 'Danh sách bài viết',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export const DEFAULT_COMBOS_PAGE_SECTIONS: Section[] = [
    {
        id: 'combos-heading',
        type: 'heading',
        name: 'Tiêu đề Combo',
        title: 'Lộ trình Tiết kiệm',
        subtitle: 'Tiết kiệm lên đến 50% khi đăng ký theo lộ trình học tập trọn gói. Được thiết kế để đưa bạn từ con số 0 đến chuyên gia.',
        tag: 'COMBOS',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 1
    },
    {
        id: 'system-combos-main',
        type: 'system-combos',
        name: 'Danh sách Combo',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export const DEFAULT_LANDING_PAGE_SECTIONS: Section[] = [
    {
        id: 'countdown-1',
        type: 'sales-countdown',
        title: 'Ưu đãi có hạn',
        subtitle: 'Đừng bỏ lỡ cơ hội sở hữu bộ công cụ Vibe Coding với giá tốt nhất',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 0
    },
    {
        id: 'hero-1',
        type: 'hero',
        tag: 'Platform',
        backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070',
        title: 'Biến ý tưởng thành web app thực tế - không cần biết code',
        subtitle: 'Giải pháp gói xây dựng app đa lĩnh vực, đa mục đích với các công cụ AI. Từ idea trên giấy đến sản phẩm hoàn chỉnh trong vài tuần.',
        ctaText: 'Khám phá khoá học',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 1
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: 'pricing-hero',
        type: 'hero',
        title: 'Gói thành viên ưu đãi',
        subtitle: 'Lựa chọn gói học phù hợp để bắt đầu hành trình của bạn.',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 2
    },
    {
        id: 'payment-1',
        type: 'payment',
        title: 'Thanh toán',
        subtitle: 'Bảo mật - nhanh chóng - tự động kích hoạt',
        image: '',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 2
    },
    {
        id: 'cta-1',
        type: 'cta',
        title: 'Bắt đầu xây dựng app của bạn ngay hôm nay',
        subtitle: 'Đăng ký tham dự Khoá học miễn phí. Trải nghiệm 7 ngày. Không cần thẻ tín dụng.',
        ctaText: 'Đăng ký miễn phí',
        ctaLink: '/register',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_ABOUT_PAGE_SECTIONS: Section[] = [
    {
        id: 'about-hero',
        type: 'hero',
        title: 'Về the tulie lab',
        subtitle: 'Nơi biến người bình thường thành người xây dựng sản phẩm. Chúng tôi tin rằng ai cũng có thể tạo ra giá trị với công nghệ - chỉ cần đúng phương pháp và consultant phù hợp.',
        ctaText: 'Xem khoá học',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 3
    },
    {
        id: 'about-mission',
        type: 'content',
        title: 'Sứ mệnh của chúng tôi',
        subtitle: 'Democratize software development',
        content: `Trước đây, xây dựng phần mềm là đặc quyền của những người học Computer Science 4 năm, hoặc những người có tiền thuê developer.

Vibe coding thay đổi điều đó.

Với AI như ChatGPT, Cursor, v0... bất kỳ ai có ý tưởng đều có thể biến nó thành sản phẩm thực. Nhưng AI chỉ là công cụ - bạn vẫn cần:

• Tư duy hệ thống - Hiểu cách các thành phần kết nối với nhau

• Kỹ năng prompt - Yêu cầu AI đúng cách để nhận output tốt nhất

• Workflow hiệu quả - Biết khi nào dùng tool nào, tránh mất thời gian

• Consultant hướng dẫn - Có người giúp debug khi gặp vấn đề thực tế

The tulie lab cung cấp tất cả điều đó trong các khoá học thực hành, và hỗ trợ xuyên suốt.`,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 4
    },
    {
        id: 'about-method',
        type: 'process',
        title: 'Phương pháp vibe coding',
        subtitle: 'Thực hành bằng cách làm sản phẩm thật',
        items: [
            {
                title: 'Session 1-2: Foundation',
                description: 'Hiểu web app hoạt động thế nào, setup môi trường, làm quen AI tools.'
            },
            {
                title: 'Session 3-4: Build core',
                description: 'Xây dựng tính năng chính của app bạn, database, API với sự hỗ trợ của AI.'
            },
            {
                title: 'Session 5-6: Polish & deploy',
                description: 'Hoàn thiện UI, tối ưu performance, deploy lên hosting thật.'
            },
            {
                title: 'Session 7+: Scale',
                description: 'Tối ưu SEO, thêm tính năng, scale users, monetization strategy.'
            }
        ],
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 5
    },
    {
        id: 'about-instructor',
        type: 'stats',
        title: 'Đội ngũ consultant',
        subtitle: 'Thực chiến, không lý thuyết suông',
        items: [
            {
                title: 'Tulie (founder)',
                description: '10+ năm kinh nghiệm Full-stack. Ex-tech lead tại các startup triệu USD. Đã build 50+ products.',
                icon: 'Code2'
            },
            {
                title: 'Community mentors',
                description: 'Đội ngũ TA và mentors là member xuất sắc đã ship sản phẩm thành công.',
                icon: 'Handshake'
            },
            {
                title: 'Guest speakers',
                description: 'Founders và CTOs từ các startup Việt Nam chia sẻ kinh nghiệm thực tế.',
                icon: 'Mic'
            }
        ],
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 6
    },
    {
        id: 'about-cta',
        type: 'cta',
        title: 'Sẵn sàng bắt đầu?',
        subtitle: 'Tham gia cùng 1000+ member đã thay đổi sự nghiệp với vibe coding.',
        ctaText: 'Đăng ký tham dự khoá học miễn phí',
        ctaLink: '/register',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 7
    }
];



export const DEFAULT_VIBE_CODING_SECTIONS: Section[] = [
    {
        id: "vibe-hero",
        type: "hero",
        title: "Vibe coding - kỷ nguyên xây dựng sản phẩm mới",
        subtitle: "The tulie lab tiên phong ứng dụng phương pháp vibe coding để giúp cá nhân và doanh nghiệp hiện thực hoá ý tưởng phần mềm chỉ bằng ngôn ngữ tự nhiên và tư duy hệ thống.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Tìm hiểu phương pháp",
        ctaLink: "#vibe-methodology",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 8
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
        backgroundTheme: 'light',
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-values",
        type: "benefits",
        tag: "Core values",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-cta",
        type: "cta",
        title: "Bắt đầu hành trình vibe coding của bạn",
        subtitle: "Chúng tôi sẵn sàng đồng hành cùng bạn xây dựng những giải pháp đột phá.",
        ctaText: "Liên hệ tư vấn dịch vụ",
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 11
    }
];

export const DEFAULT_VIBE_CODING_COURSE_SECTIONS: Section[] = [
    {
        id: "vibe-hero",
        type: "hero",
        title: "Biến ý tưởng thành ứng dụng thực tế trong 30 phút",
        subtitle: "Làm chủ tư duy \"vibe coding\": Tự tay xây dựng 10 mini apps giải quyết công việc marketing, sales, admin và đời sống ngay lập tức.",
        content: "✅ Không cần học code phức tạp – chỉ cần biết tiếng Việt và tư duy logic. \n ✅ Sở hữu vĩnh viễn source code của 10 ứng dụng thực chiến. \n ✅ Tiết kiệm hàng chục triệu đồng tiền thuê dev và mua phần mềm mỗi năm.",
        image: "/images/heroes/vibe-coding.png",
        ctaText: "Đăng ký học ngay - 1.790.000đ",
        ctaLink: "/courses/vibe-coding-nguoi-moi",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 12
    },
    {
        id: "vibe-pain",
        type: "content-block",
        tag: "Pain points",
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
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-agitation",
        type: "benefits",
        tag: "Agitation",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-solution",
        type: "content",
        tag: "Solution",
        title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
        subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
        content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.\n\nTôi dạy bạn tư duy dùng AI để tạo ra công cụ phục vụ chính công việc của bạn.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        imagePosition: "right",
        isVisible: true,
        order: 4,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-value",
        type: "benefits",
        tag: "Values",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-bonuses",
        type: "bonus",
        tag: "Bonuses",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-faq",
        type: "faq",
        tag: "Faq",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-cta-sales",
        type: "cta",
        title: "Bắt đầu hành trình Vibe Coding của bạn ngay hôm nay",
        subtitle: "Làm chủ AI, giải phóng sức lao động và tự tay xây dựng những ứng dụng tuyệt vời.",
        ctaText: "Khám phá Khoá học",
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    }
];

export const DEFAULT_HOME_SECTIONS: Section[] = [
    {
        id: "general-hero",
        type: "hero",
        tag: "Xu hướng 2026",
        title: "Vibe Coding: Lập trình bằng AI - Kỹ năng bắt buộc năm 2026",
        subtitle: "Không cần học code truyền thống. Chỉ cần tư duy logic + AI = Bạn có thể xây dựng ứng dụng thực tế. Tulie TSS đồng hành 1:1 cùng bạn từ con số 0 đến sản phẩm hoàn chỉnh.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Khám phá khoá học",
        ctaLink: "/courses",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 14
    },
    {
        id: "tulie-stats",
        type: "stats",
        tag: "Cam kết",
        title: "Tulie TSS - Đồng hành từ 0 đến sản phẩm",
        subtitle: "Chúng tôi không chỉ dạy, chúng tôi cùng bạn làm",
        items: [
            { title: "Học viên", value: "500+", icon: "Users", description: "Đã tin tưởng và học tập" },
            { title: "Tài nguyên", value: "50+", icon: "Package", description: "Templates & Scripts thực chiến" },
            { title: "Khoá học", value: "5+", icon: "GraduationCap", description: "Lộ trình từ cơ bản đến nâng cao" },
            { title: "Hỗ trợ 1:1", value: "100%", icon: "Headphones", description: "Cam kết đồng hành trọn khoá" }
        ],
        isVisible: true,
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "vibe-methodology",
        type: "coding-methods",
        tag: "Stages",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "general-cta",
        type: "cta",
        tag: "Action",
        title: "Sẵn sàng nâng tầm kỹ năng của bạn?",
        subtitle: "Khám phá ngay các khoá học và bộ công cụ giúp bạn bứt phá trong kỷ nguyên AI.",
        ctaText: "Xem tất cả Khoá học",
        ctaLink: "/courses",
        isVisible: true,
        order: 4,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "video-intro",
        type: "video",
        title: "Video Giới Thiệu",
        tag: "Intro",
        subtitle: "Xem video để hiểu rõ hơn về phương pháp Vibe Coding",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video
        mediaAspectRatio: "16/9",
        animation: "fade-up",
        order: 5,
        isVisible: true,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: "gallery-showcase",
        type: "gallery",
        title: "Thư Viện Ảnh",
        tag: "Gallery",
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
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    }
];


export const DEFAULT_INSTRUCTORS_PAGE_SECTIONS: Section[] = [
    {
        id: "instructors-hero",
        type: "hero",
        tag: "Người đồng hành",
        title: "Gặp gỡ người sẽ đồng hành cùng bạn",
        subtitle: "Tại Tulie TSS, bạn được học và hỗ trợ 1:1 bởi chính founder - người có kinh nghiệm thực chiến trong ngành công nghệ.",
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 1
    },
    {
        id: 'instructor-bio-main',
        type: 'instructor-bio',
        tag: 'Founder & Lead Instructor',
        title: 'Nguyễn Thanh Tùng',
        subtitle: 'Tiên phong Vibe Coding tại Việt Nam',
        content: 'Founder của Tulie TSS - công ty chuyên tư vấn và triển khai giải pháp công nghệ cho doanh nghiệp vừa và nhỏ.\n\n**10+ năm kinh nghiệm** trong ngành công nghệ, từng làm việc tại các công ty công nghệ hàng đầu trước khi khởi nghiệp.\n\n**500+ học viên** đã được hướng dẫn từ người mới hoàn toàn đến tự xây dựng được ứng dụng thực tế.\n\n**Tiên phong** đưa phương pháp Vibe Coding vào Việt Nam từ 2024 - giúp những người không có background IT vẫn có thể xây dựng app chuyên nghiệp.\n\n*"Tôi không dạy bạn code - Tôi dạy bạn cách ra lệnh cho AI code thay bạn. Đó mới là kỹ năng của tương lai."*',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: 'instructor-stats',
        type: 'stats',
        tag: 'Thành tựu',
        title: 'Con số nói lên tất cả',
        subtitle: 'Kết quả thực tế từ hành trình 10 năm',
        items: [
            { title: 'Năm kinh nghiệm', value: '10+', icon: 'Clock', description: 'Trong ngành công nghệ' },
            { title: 'Học viên', value: '500+', icon: 'Users', description: 'Đã hướng dẫn thành công' },
            { title: 'Dự án', value: '100+', icon: 'Briefcase', description: 'Đã triển khai cho doanh nghiệp' },
            { title: 'Cam kết', value: '1:1', icon: 'Headphones', description: 'Hỗ trợ cá nhân cho mỗi học viên' }
        ],
        backgroundImage: '',
        backgroundTheme: 'dark',
        overlayOpacity: 0.8
    },
    {
        id: 'instructor-methodology',
        type: 'process',
        tag: 'Phương pháp',
        title: 'Cách tôi hướng dẫn bạn',
        subtitle: 'Không lý thuyết suông - Học bằng cách làm thực tế',
        items: [
            { title: 'Tìm hiểu mục tiêu', description: 'Gọi video 30 phút để hiểu background, mục tiêu của bạn và thiết kế lộ trình phù hợp.', icon: 'Target' },
            { title: 'Học qua video HD', description: 'Xem video bài giảng chất lượng cao, thực hành theo từng bước. Xem lại không giới hạn.', icon: 'PlayCircle' },
            { title: 'Hỗ trợ 24/7', description: 'Mọi thắc mắc được giải đáp qua Zalo/Telegram trong vòng 24h. Không bao giờ học một mình.', icon: 'MessageCircle' },
            { title: 'Review code hàng tuần', description: 'Code của bạn được review để đảm bảo đi đúng hướng. Học được cách làm chuẩn ngay từ đầu.', icon: 'Code' }
        ],
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    {
        id: 'cta-instructors',
        type: 'cta',
        title: 'Sẵn sàng bắt đầu hành trình?',
        subtitle: 'Tham gia ngay khoá học Vibe Coding và được hướng dẫn 1:1 bởi Nguyễn Thanh Tùng.',
        ctaText: 'Đăng ký khoá học',
        ctaLink: '/courses',
        backgroundImage: '',
        backgroundTheme: 'dark',
        overlayOpacity: 0.8
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

// ============================================================================
// VIBE CODING BEGINNER COURSE LANDING PAGE - 2,790,000 VND
// Emphasis: 1:1 mentorship, 2026 trends, FOMO, beginner-to-pro journey
// ============================================================================
export const DEFAULT_VIBE_CODING_BEGINNER_COURSE: Section[] = [
    // 1. HERO - Strong FOMO headline
    {
        id: "vibe-beginner-hero",
        type: "hero",
        tag: "Xu hướng 2026 🔥",
        title: "Lập trình bằng AI: Kỹ năng PHẢI HỌC trong năm 2026",
        subtitle: "Khoá học Vibe Coding toàn diện dành cho người mới bắt đầu. Từ 0 kinh nghiệm đến tự xây dựng ứng dụng kiếm tiền hoặc triển khai cho business của bạn. Cam kết đồng hành 1:1 trọn khoá.",
        content: "✅ Không cần background IT - Chỉ cần biết tiếng Việt và tư duy logic\\n✅ Lộ trình từ người mới đến có nghề (có thể kiếm tiền ngay)\\n✅ Hỗ trợ 1:1 với giảng viên xuyên suốt quá trình học\\n✅ Cập nhật công nghệ mới nhất 2026: Cursor, Claude, v0, Bolt...",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Đăng ký ngay - 2.790.000đ",
        ctaLink: "#pricing",
        isVisible: true,
        order: 1,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6,
        glowVariant: 1
    },
    // 2. COURSE STATS
    {
        id: "vibe-beginner-stats",
        type: "stats",
        tag: "Khoá học",
        title: "Con số nói lên tất cả",
        subtitle: "Đầu tư 1 lần, kỹ năng cả đời",
        items: [
            { title: "Giờ học", value: "40+", icon: "Clock", description: "Video HD + thực hành" },
            { title: "Dự án thực tế", value: "10+", icon: "Briefcase", description: "Từ đơn giản đến phức tạp" },
            { title: "Công cụ AI", value: "8+", icon: "Bot", description: "Cursor, Claude, v0, Bolt..." },
            { title: "Hỗ trợ", value: "1:1", icon: "Headphones", description: "Trực tiếp với giảng viên" }
        ],
        isVisible: true,
        order: 2,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 3. PAIN POINTS - FOMO
    {
        id: "vibe-beginner-pain",
        type: "content-block",
        tag: "⚠️ Cảnh báo",
        title: "2026: Bạn đang ở đâu trong cuộc cách mạng AI?",
        subtitle: "Những người không thích nghi sẽ bị bỏ lại phía sau",
        items: [
            {
                title: "Người khác đang kiếm tiền từ AI",
                description: "Freelancers đang nhận $50-200/giờ để xây app bằng Vibe Coding. Họ không giỏi code - họ chỉ biết cách 'ra lệnh' cho AI làm việc.",
                image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Doanh nghiệp đang cắt giảm chi phí IT",
                description: "Thay vì thuê team dev 50 triệu/tháng, họ thuê 1 người biết Vibe Coding với giá 15 triệu. Bạn có thể là người đó.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "Ý tưởng của bạn đang chờ được hiện thực",
                description: "Bạn có 10 ý tưởng app nhưng không có tiền thuê dev? Với Vibe Coding, bạn tự làm được - không phụ thuộc ai.",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
            }
        ],
        isVisible: true,
        order: 3,
        backgroundImage: '',
        backgroundTheme: 'dark',
        overlayOpacity: 0.8
    },
    // 4. COMPARISON - Vibe Coding vs Traditional
    {
        id: "vibe-beginner-comparison",
        type: "comparison",
        tag: "So sánh",
        title: "Vibe Coding vs Lập trình truyền thống",
        subtitle: "Tại sao 2026 là thời điểm vàng để học Vibe Coding?",
        items: [
            {
                title: "Thời gian học",
                before: "2-4 năm đại học",
                after: "4-8 tuần tập trung"
            },
            {
                title: "Yêu cầu đầu vào",
                before: "Toán cao cấp, thuật toán",
                after: "Chỉ cần tư duy logic"
            },
            {
                title: "Tốc độ xây app",
                before: "3-6 tháng cho 1 MVP",
                after: "1-2 tuần cho 1 MVP"
            },
            {
                title: "Chi phí đầu tư",
                before: "> 100 triệu (học phí + thời gian)",
                after: "2.79 triệu + Internet"
            },
            {
                title: "Khả năng cập nhật",
                before: "Công nghệ cũ sau 2-3 năm",
                after: "AI tự động cập nhật syntax mới"
            },
            {
                title: "Độ linh hoạt",
                before: "Chuyên 1-2 ngôn ngữ",
                after: "Làm được mọi ngôn ngữ nhờ AI"
            }
        ],
        isVisible: true,
        order: 4,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 5. CURRICULUM
    {
        id: "vibe-beginner-curriculum",
        type: "curriculum",
        tag: "Lộ trình",
        title: "Từ người mới đến có nghề trong 8 tuần",
        subtitle: "Học theo lộ trình đã được kiểm chứng, không lan man",
        items: [
            {
                title: "Tuần 1-2: Nền tảng & Mindset",
                description: "Hiểu cách AI hoạt động, setup môi trường, làm quen Cursor + Claude. Hoàn thành 2 mini projects đầu tiên.",
                lessons: ["Vibe Coding là gì? Tại sao là xu hướng 2026?", "Setup Cursor, Claude, tài khoản AI", "Cấu trúc một web app cơ bản", "Prompt Engineering 101: Cách 'ra lệnh' cho AI", "Project 1: Landing Page cá nhân", "Project 2: Calculator app hoàn chỉnh"]
            },
            {
                title: "Tuần 3-4: Frontend Mastery",
                description: "Xây dựng giao diện đẹp, responsive. Học React/Next.js thông qua thực hành với AI.",
                lessons: ["HTML/CSS cơ bản (AI giải thích)", "React components và state", "Tailwind CSS cho styling nhanh", "Project 3: Portfolio website chuyên nghiệp", "Project 4: Todo App với localStorage", "Responsive design cho mobile"]
            },
            {
                title: "Tuần 5-6: Backend & Database",
                description: "Kết nối database, xử lý logic phức tạp, authentication. Đây là bước nhảy vọt quan trọng.",
                lessons: ["Supabase/Firebase setup", "CRUD operations với AI", "Authentication & User management", "Project 5: Blog với admin panel", "Project 6: E-commerce mini shop", "API integration với bên thứ 3"]
            },
            {
                title: "Tuần 7-8: Deploy & Monetize",
                description: "Đưa app lên production, tối ưu SEO, và bắt đầu kiếm tiền từ kỹ năng mới.",
                lessons: ["Deploy lên Vercel/Netlify", "Tên miền và SSL", "SEO cơ bản cho web app", "Project 7-10: Capstone projects", "Cách tìm khách hàng Freelance", "Xây portfolio để nhận việc"]
            }
        ],
        isVisible: true,
        order: 5,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 6. BENEFITS
    {
        id: "vibe-beginner-benefits",
        type: "benefits",
        tag: "Lợi ích",
        title: "Sau khoá học, bạn sẽ có thể...",
        subtitle: "Kỹ năng thực tế, áp dụng được ngay",
        items: [
            { title: "Xây app cho business", description: "Tạo CRM, quản lý kho, booking system... cho công ty của bạn mà không cần thuê dev.", icon: "Building" },
            { title: "Freelance kiếm tiền", description: "Nhận dự án $500-2000 từ Upwork, Fiverr. Nhiều học viên đã hoàn vốn khoá học sau 1-2 dự án.", icon: "DollarSign" },
            { title: "Startup ý tưởng riêng", description: "Có MVP trong 2 tuần thay vì 6 tháng. Tiết kiệm hàng trăm triệu chi phí ban đầu.", icon: "Rocket" },
            { title: "Tự động hoá công việc", description: "Viết tool tự động báo cáo, gửi email, crawl data... Tiết kiệm 10+ giờ mỗi tuần.", icon: "Zap" },
            { title: "Nâng giá trị bản thân", description: "Thêm 'AI Developer' vào CV. Lương tăng 30-50% khi biết Vibe Coding.", icon: "TrendingUp" },
            { title: "Học nhanh công nghệ mới", description: "Một khi biết cách dùng AI, bạn có thể học bất kỳ framework/ngôn ngữ nào trong 1-2 ngày.", icon: "BookOpen" }
        ],
        isVisible: true,
        order: 6,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 7. PROCESS - 1:1 Mentorship
    {
        id: "vibe-beginner-process",
        type: "process",
        tag: "Phương pháp",
        title: "Cam kết đồng hành 1:1 suốt khoá học",
        subtitle: "Không bỏ rơi - Học đến khi làm được mới thôi",
        items: [
            {
                title: "1. Onboarding cá nhân",
                description: "Gọi video 30 phút với giảng viên để hiểu background, mục tiêu và thiết kế lộ trình riêng phù hợp với bạn.",
                icon: "UserPlus"
            },
            {
                title: "2. Học video + Thực hành",
                description: "Xem video bài giảng HD, làm theo và apply vào project thực tế. Mọi thắc mắc được giải đáp trong 24h.",
                icon: "PlayCircle"
            },
            {
                title: "3. Review code hàng tuần",
                description: "Giảng viên review code của bạn, chỉ ra lỗi và cách cải thiện. Đảm bảo bạn học đúng cách từ đầu.",
                icon: "Code"
            },
            {
                title: "4. Capstone & Chứng chỉ",
                description: "Hoàn thành 10 projects, nhận chứng chỉ và guidance để bắt đầu kiếm tiền hoặc apply việc.",
                icon: "Award"
            }
        ],
        isVisible: true,
        order: 7,
        backgroundImage: '',
        backgroundTheme: 'dark',
        overlayOpacity: 0.8
    },
    // 8. INSTRUCTOR BIO
    {
        id: "vibe-beginner-instructor",
        type: "instructor-bio",
        tag: "Giảng viên",
        title: "Người hướng dẫn của bạn",
        subtitle: "Không phải lý thuyết - Đây là người đang làm thực tế",
        content: "Founder của Tulie TSS - công ty chuyên tư vấn và triển khai giải pháp công nghệ cho doanh nghiệp vừa và nhỏ. 10+ năm kinh nghiệm trong ngành công nghệ, từng làm việc tại các công ty công nghệ hàng đầu trước khi khởi nghiệp. Tiên phong đưa phương pháp Vibe Coding vào Việt Nam từ 2024, đã hướng dẫn 500+ học viên từ người mới hoàn toàn đến tự xây dựng được ứng dụng thực tế.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        items: [
            { title: "Nguyễn Thanh Tùng", subtitle: "Founder & Lead Instructor", description: "'Tôi không dạy bạn code - Tôi dạy bạn cách ra lệnh cho AI code thay bạn. Đó mới là kỹ năng của tương lai.'", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" }
        ],
        isVisible: true,
        order: 8,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 9. TESTIMONIALS (placeholder for future)
    {
        id: "vibe-beginner-testimonials",
        type: "testimonials",
        tag: "Học viên nói gì",
        title: "Họ đã làm được - Bạn cũng vậy",
        subtitle: "Những câu chuyện thành công từ người mới bắt đầu",
        items: [
            {
                name: "Minh Anh",
                role: "Nhân viên Marketing → Freelance Developer",
                content: "Trước khoá học, mình không biết gì về code. Sau 2 tháng, mình đã nhận được dự án đầu tiên $800 từ Upwork. Không thể tin được!",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
                rating: 5
            },
            {
                name: "Hoàng Nam",
                role: "Chủ shop online",
                content: "Mình tự xây được website bán hàng + hệ thống quản lý đơn hàng. Trước đây phải thuê dev 30 triệu, giờ tự làm và còn custom được theo ý.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
                rating: 5
            },
            {
                name: "Thu Hà",
                role: "Kế toán → AI Developer",
                content: "Điều mình thích nhất là hỗ trợ 1:1. Mỗi khi stuck, anh Tùng đều giải đáp rất chi tiết. Không bao giờ cảm thấy học một mình.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
                rating: 5
            }
        ],
        isVisible: true,
        order: 9,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 10. BONUS
    {
        id: "vibe-beginner-bonus",
        type: "bonus",
        tag: "🎁 Bonus",
        title: "Quà tặng độc quyền (Trị giá 5.000.000đ)",
        subtitle: "Chỉ dành cho học viên đăng ký trong tháng này",
        items: [
            { title: "Thư viện 100+ Prompts", description: "Copy-paste để AI viết code chính xác ngay lần đầu. Tiết kiệm hàng giờ debug.", value: "Trị giá 1.500.000đ", icon: "FileText" },
            { title: "10+ Project Templates", description: "Clone và customize để hoàn thành dự án nhanh gấp 5 lần.", value: "Trị giá 2.000.000đ", icon: "Folder" },
            { title: "Private Community", description: "Nhóm kín với 500+ thành viên, chia sẻ kinh nghiệm, cơ hội việc làm.", value: "Trị giá 500.000đ", icon: "Users" },
            { title: "Lifetime Updates", description: "Cập nhật nội dung mới khi công nghệ thay đổi, không mất thêm phí.", value: "Vô giá", icon: "RefreshCw" },
            { title: "Certificate of Completion", description: "Chứng chỉ hoàn thành để thêm vào CV/LinkedIn.", value: "Uy tín", icon: "Award" }
        ],
        isVisible: true,
        order: 10,
        backgroundImage: '',
        backgroundTheme: 'dark',
        overlayOpacity: 0.8
    },
    // 11. PRICING
    {
        id: "vibe-beginner-pricing",
        type: "pricing",
        tag: "Đầu tư",
        title: "Đầu tư một lần - Kỹ năng cả đời",
        subtitle: "So với 100 triệu học đại học IT 4 năm, đây là món hời lớn nhất 2026",
        items: [
            {
                id: "vibe-beginner-full",
                title: "Khoá Vibe Coding Toàn Diện",
                price: "2.790.000đ",
                originalPrice: "4.500.000đ",
                description: "Trọn bộ lộ trình 8 tuần từ 0 đến có nghề",
                tag: "BEST VALUE",
                features: [
                    "40+ giờ video HD chất lượng cao",
                    "10+ dự án thực tế từ đơn giản đến phức tạp",
                    "Hỗ trợ 1:1 với giảng viên (không giới hạn)",
                    "Review code hàng tuần",
                    "100+ prompt templates",
                    "10+ project templates",
                    "Private community access",
                    "Lifetime access & updates",
                    "Chứng chỉ hoàn thành",
                    "Guidance tìm việc/khách hàng"
                ],
                link: "/checkout?course=vibe-coding-beginner",
                icon: "Rocket",
                ctaText: "Đăng ký ngay"
            }
        ],
        isVisible: true,
        order: 11,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 12. FAQ
    {
        id: "vibe-beginner-faq",
        type: "faq",
        tag: "FAQ",
        title: "Câu hỏi thường gặp",
        subtitle: "Giải đáp mọi thắc mắc của bạn",
        items: [
            {
                question: "Tôi hoàn toàn không biết gì về lập trình, có học được không?",
                answer: "Hoàn toàn được! Khoá học được thiết kế cho người mới bắt đầu từ con số 0. Bạn chỉ cần biết sử dụng máy tính cơ bản và có tư duy logic. 90% học viên của chúng tôi không có background IT."
            },
            {
                question: "Hỗ trợ 1:1 nghĩa là gì? Có thực sự được hỗ trợ không?",
                answer: "Có! Bạn sẽ được giảng viên Nguyễn Thanh Tùng hỗ trợ trực tiếp qua Zalo/Telegram. Mọi câu hỏi được trả lời trong 24h. Ngoài ra còn có review code hàng tuần để đảm bảo bạn đi đúng hướng."
            },
            {
                question: "Học xong có thể kiếm tiền ngay không?",
                answer: "Có! Nhiều học viên đã nhận được dự án freelance ngay khi đang học (tuần 5-6). Sau khoá học, bạn hoàn toàn có thể nhận dự án $500-2000 từ các nền tảng như Upwork, Fiverr hoặc khách hàng Việt Nam."
            },
            {
                question: "Máy tính cấu hình yếu có học được không?",
                answer: "Được! Các công cụ AI đều chạy trên cloud (web), máy tính văn phòng bình thường là đủ. Chỉ cần có Internet ổn định."
            },
            {
                question: "Khoá học có thời hạn không?",
                answer: "Không! Bạn được lifetime access - học mãi mãi, không giới hạn thời gian. Nội dung khoá học cũng được cập nhật miễn phí khi công nghệ thay đổi."
            },
            {
                question: "Có hoàn tiền nếu không hài lòng không?",
                answer: "Có! Chúng tôi cam kết hoàn tiền 100% trong 7 ngày đầu nếu bạn cảm thấy khoá học không phù hợp. Không hỏi lý do."
            },
            {
                question: "Vibe Coding khác gì so với học code truyền thống?",
                answer: "Vibe Coding tập trung vào việc 'ra lệnh' cho AI viết code thay vì tự viết từng dòng. Bạn học tư duy và cách giao tiếp với AI, không cần nhớ syntax. Tốc độ nhanh hơn 10 lần và ai cũng có thể làm được."
            },
            {
                question: "Tại sao nên học năm 2026?",
                answer: "Năm 2026 là thời điểm vàng! AI đã đủ mạnh để làm được 90% công việc coding, nhưng chưa nhiều người biết cách sử dụng. Học ngay sẽ giúp bạn đi trước đám đông 2-3 năm. Đợi thêm sẽ mất lợi thế cạnh tranh."
            }
        ],
        isVisible: true,
        order: 12,
        backgroundImage: '',
        backgroundTheme: 'light',
        overlayOpacity: 0.6
    },
    // 13. CTA - Urgency
    {
        id: "vibe-beginner-cta-urgency",
        type: "cta",
        tag: "⏰ Ưu đãi có hạn",
        title: "Giá ưu đãi 2.790.000đ chỉ còn trong tháng này",
        subtitle: "Từ tháng sau, giá khoá học sẽ tăng lên 4.500.000đ. Đăng ký ngay để tiết kiệm 1.710.000đ và bắt đầu hành trình Vibe Coding của bạn.",
        ctaText: "Đăng ký ngay - 2.790.000đ",
        ctaLink: "/checkout?course=vibe-coding-beginner",
        isVisible: true,
        order: 13,
        backgroundImage: '',
        backgroundTheme: 'dark',
        overlayOpacity: 0.8
    },
    // 14. FINAL CTA
    {
        id: "vibe-beginner-cta-final",
        type: "cta",
        title: "Năm 2026: Bạn sẽ là người tạo ra app hay người dùng app của người khác?",
        subtitle: "Quyết định hôm nay sẽ thay đổi 10 năm tiếp theo của bạn. Hãy là người đi đầu xu hướng.",
        ctaText: "Bắt đầu hành trình Vibe Coding",
        ctaLink: "/checkout?course=vibe-coding-beginner",
        isVisible: true,
        order: 14,
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        backgroundTheme: 'dark',
        overlayOpacity: 0.7
    }
];
