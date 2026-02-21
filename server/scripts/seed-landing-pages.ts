import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const daoTaoAiSections = [
    {
        id: "hero-ai",
        type: "hero",
        tag: "Đào tạo ứng dụng AI",
        title: "Chủ động kiểm soát Công nghệ. Bứt tốc cùng Vibe Coding.",
        subtitle: "Dám khác biệt để dẫn đầu. Cung cấp khóa học ứng dụng AI giúp bạn tự tay tạo ra ảnh, video, website và phần mềm hoàn chỉnh chỉ từ ý tưởng.",
        ctaText: "Nhận Tư Vấn Lộ Trình",
        ctaLink: "/contact",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        isVisible: true,
        order: 1,
        backgroundTheme: 'light',
        glowVariant: 10
    },
    {
        id: "pain-ai",
        type: "features",
        tag: "Vấn đề của bạn",
        title: "Rào cản khiến doanh nghiệp / cá nhân chậm phát triển",
        subtitle: "Bạn có đang gặp những tình trạng này?",
        items: [
            { title: "Phụ thuộc nhân sự IT", description: "Bất kể ý tưởng nhỏ hay lớn, bạn đều phải chờ đợi hoặc chi trả số tiền lớn để đội ngũ outsource thực hiện.", icon: "Ban" },
            { title: "Ý tưởng nằm trên giấy", description: "Muốn tạo một tool nhỏ quản lý nội bộ, hay landing page thu thập data nhưng không biết bắt đầu từ đâu.", icon: "Clock" },
            { title: "Dùng AI sai cách", description: "Chỉ dừng lại ở hỏi đáp cơ bản với chat bot, chưa khai thác để tự động thiết kế hay viết mã (coding) trực tiếp.", icon: "AlertTriangle" }
        ],
        isVisible: true,
        order: 2,
        backgroundTheme: 'light'
    },
    {
        id: "solution-ai",
        type: "process",
        tag: "Giải pháp",
        title: "Chương trình đào tạo Vibe Coding",
        subtitle: "Từ Zero đến Builder App thực chiến",
        items: [
            { title: "Module 1: AI cho Content & Media", description: "Sử dụng AI tạo ra nội dung chuẩn SEO, thiết kế hình ảnh, video chuyên nghiệp trong vài phút." },
            { title: "Module 2: Tư duy Hệ thống", description: "Hiểu cấu trúc luồng của một website / app để ra lệnh cho AI chính xác hơn." },
            { title: "Module 3: Vibe Coding Thực Chiến", description: "Sử dụng các LLM agent kết hợp như Cursor, Claude xây dựng Tool, Landing Page từ con số 0." },
            { title: "Module 4: Deploy & Vận hành", description: "Đưa sản phẩm lên môi trường internet thực tế, theo dõi và bảo trì." }
        ],
        isVisible: true,
        order: 3,
        backgroundTheme: 'light'
    },
    {
        id: "cta-ai",
        type: "cta",
        title: "Sẵn sàng làm chủ công nghệ?",
        subtitle: "Tham gia khóa học, rút ngắn hàng năm trời mò mẫm.",
        ctaText: "Đăng ký ngay",
        ctaLink: "/register",
        isVisible: true,
        order: 4,
        backgroundTheme: 'light'
    }
];

const templateSections = [
    {
        id: "hero-template",
        type: "hero",
        tag: "Templates Google Sheets & App Scripts",
        title: "Tự động hóa Quy trình. Tối ưu Nguồn lực.",
        subtitle: "Loại bỏ hoàn toàn công việc thủ công, quản lý dữ liệu chặt chẽ và báo cáo Real-time với mức chi phí đầu tư ban đầu cực thấp.",
        ctaText: "Xem Kho Templates",
        ctaLink: "/shop",
        image: "https://images.unsplash.com/photo-1454165833772-d996d49510d1?q=80&w=2070&auto=format&fit=crop",
        isVisible: true,
        order: 1,
        backgroundTheme: 'light',
        glowVariant: 8
    },
    {
        id: "pain-template",
        type: "features",
        tag: "Pain Points",
        title: "Quản trị thủ công giết chết hiệu suất",
        subtitle: "Hãy chấm dứt chuỗi ngày làm việc không hiệu quả",
        items: [
            { title: "Giấy tờ, Excel rời rạc", description: "Mỗi bộ phận dùng một file, mất thời gian tổng hợp, dữ liệu bất đồng bộ.", icon: "FileText" },
            { title: "Lỗi do con người", description: "Copy & Paste nhầm dòng, lỡ tay xóa công thức gây sai lệch báo cáo cuối tháng.", icon: "AlertOctagon" },
            { title: "Chi phí phần mềm cao", description: "Các SaaS (phần mềm quản trị) trả phí hàng tháng quá cao, lại chứa quá nhiều tính năng không dùng đến.", icon: "DollarSign" }
        ],
        isVisible: true,
        order: 2,
        backgroundTheme: 'light'
    },
    {
        id: "benefits-template",
        type: "benefits",
        tag: "Giá trị mang lại",
        title: "Tại sao chọn Templates & App Scripts từ Tulie?",
        subtitle: "Khởi tạo nhanh chóng, làm chủ dữ liệu doanh nghiệp",
        items: [
            { title: "100% Linh hoạt", description: "Chỉnh sửa thêm bớt tính năng tùy theo đặc thù công ty trực tiếp trên Google Sheets.", icon: "Settings" },
            { title: "Tự động gửi mail/thông báo", description: "Kết hợp App Scripts để tự động nhắc lịch, gửi email đến đối tác, thông báo qua Zalo/Telegram.", icon: "Bell" },
            { title: "Sở hữu trọn đời", description: "Chỉ thanh toán 1 lần, sở hữu vĩnh viễn, không phí ẩn hàng tháng.", icon: "Unlock" },
            { title: "Bảo mật nền tảng Google", description: "Data nằm hoàn toàn trên tài khoản Drive của bạn, không lo rò rỉ.", icon: "Shield" }
        ],
        isVisible: true,
        order: 3,
        backgroundTheme: 'light'
    },
    {
        id: "cta-template",
        type: "cta",
        title: "Chuyển giao giải pháp ngay hôm nay",
        subtitle: "Chọn mẫu Template phù hợp với quy mô và yêu cầu doanh nghiệp của bạn.",
        ctaText: "Mua Template",
        ctaLink: "/shop",
        isVisible: true,
        order: 4,
        backgroundTheme: 'light'
    }
];

const creativeSections = [
    {
        id: "hero-creative",
        type: "hero",
        tag: "Ứng dụng Sáng tạo",
        title: "Đưa Tương tác và Sáng tạo vào Công việc hàng ngày",
        subtitle: "Hệ sinh thái nền tảng: Whiteboard, Form trắc nghiệm, Nền tảng Gamification và Giải pháp Xếp Thời khóa biểu chuyên nghiệp.",
        ctaText: "Liên hệ dùng thử",
        ctaLink: "/contact",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
        isVisible: true,
        order: 1,
        backgroundTheme: 'light',
        glowVariant: 11
    },
    {
        id: "pain-creative",
        type: "features",
        tag: "Thách thức hiện tại",
        title: "Phương pháp cũ đang kìm hãm nhân sự / học sinh",
        subtitle: "Thiếu tương tác là kẻ thù của sự hứng thú",
        items: [
            { title: "Môi trường học tập/họp trực tuyến nhàm chán", description: "Chỉ một chiều nói, học sinh/nhân sự mất tập trung, mệt mỏi.", icon: "MicOff" },
            { title: "Test/Kiểm tra thiếu động lực", description: "Chỉ có trắc nghiệm text đơn thuần, không có yếu tố cạnh tranh hay game hóa (gamification).", icon: "Frown" },
            { title: "Xếp lịch thủ công", description: "Trường học / Trung tâm mất hàng tuần để cắm biểu, hay bị trùng giờ giáo viên, phòng học.", icon: "Calendar" }
        ],
        isVisible: true,
        order: 2,
        backgroundTheme: 'light'
    },
    {
        id: "features-creative",
        type: "benefits",
        tag: "Danh mục Giải pháp",
        title: "Bộ ứng dụng tối ưu hóa từ Tulie TSS",
        subtitle: "Biến những công việc khô khan trở nên thú vị",
        items: [
            { title: "Tulie Whiteboard", description: "Bảng trắng online cho phép nhiều người cùng vẽ, thảo luận, mindmap thời gian thực.", icon: "Edit3" },
            { title: "Gamified Quiz", description: "Hệ thống trắc nghiệm thi đấu trực tuyến, leaderboard, tăng cường sự tương tác và giữ chân người dùng.", icon: "Award" },
            { title: "Nền tảng TKB Tự động", description: "Thuật toán tối ưu (Genetic Algorithm) xếp hàng nghìn tiết học không trùng lặp, tối ưu lộ trình cho giáo viên.", icon: "CalendarCheck" }
        ],
        isVisible: true,
        order: 3,
        backgroundTheme: 'light'
    },
    {
        id: "cta-creative",
        type: "cta",
        title: "Trải nghiệm sức mạnh của Ứng dụng Sáng tạo",
        subtitle: "Thay đổi cách bạn giảng dạy, hội họp và quản lý.",
        ctaText: "Đăng ký dùng thử",
        ctaLink: "/register",
        isVisible: true,
        order: 4,
        backgroundTheme: 'light'
    }
];

async function seedLandingPages() {
    const pages = [
        {
            slug: 'dao-tao-ai',
            title: 'Đào tạo ứng dụng AI (Vibe Coding) - Tulie TSS',
            description: 'Làm chủ công nghệ Vibe Coding, sử dụng trí tuệ nhân tạo (AI) tạo ảnh, video, website, ứng dụng không cần biết code.',
            sections: JSON.stringify(daoTaoAiSections),
            type: 'LANDING',
        },
        {
            slug: 'templates-tools',
            title: 'Templates Google Sheets & App Scripts - Tulie TSS',
            description: 'Tự động hóa doanh nghiệp, quản trị hiệu quả với bộ giải pháp Google Sheets & App Scripts tiện lợi, linh hoạt và chi phí thấp.',
            sections: JSON.stringify(templateSections),
            type: 'LANDING',
        },
        {
            slug: 'ung-dung-sang-tao',
            title: 'Hệ Sinh Thái Ứng Dụng Sáng Tạo - Tulie TSS',
            description: 'Giải pháp Whiteboard teamwork, Hệ thống Trắc nghiệm Gamification, Nền tảng Xếp Thời Khóa Biểu thông minh cho trường học.',
            sections: JSON.stringify(creativeSections),
            type: 'LANDING',
        }
    ];

    for (const p of pages) {
        await prisma.landingPage.upsert({
            where: { slug: p.slug },
            update: {
                title: p.title,
                description: p.description,
                sections: p.sections,
                isActive: true, // Assuming isActive field exists, based on usual schema
            },
            create: {
                title: p.title,
                slug: p.slug,
                description: p.description,
                sections: p.sections,
                type: 'LANDING' as any, // Cast to avoid strictly matching Enum type if TS complains
                isActive: true,
            },
        });
        console.log(`Upserted landing page: /p/${p.slug}`);
    }
    console.log('All landing pages seeded successfully.');
}

seedLandingPages()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
