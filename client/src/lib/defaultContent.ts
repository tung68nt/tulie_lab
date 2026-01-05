import { Section } from '@/types/sections';

export const DEFAULT_LANDING_PAGE_SECTIONS: Section[] = [
    {
        id: 'hero-1',
        type: 'hero',
        title: 'Biến ý tưởng thành Web App thực tế - Không cần biết code',
        subtitle: 'Giải pháp Gói xây dựng App đa lĩnh vực, đa mục đích với các công cụ AI. Từ idea trên giấy đến sản phẩm hoàn chỉnh trong vài tuần.',
        ctaText: 'Khám phá Workshop',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'stats-1',
        type: 'stats',
        title: 'Bạn có ý tưởng tuyệt vời... Nhưng',
        subtitle: 'Đây có vẻ quen không?',
        content: 'Bạn đang gặp khó khăn biến ý tưởng của mình thành hiện thực? Đừng lo, 90% người có ý tưởng đều gặp vấn đề tương tự.',
        items: [
            {
                title: '😫 "Không biết code, làm sao build app?"',
                description: 'Học lập trình truyền thống mất 1-2 năm. Thuê developer thì chi phí cao, khó kiểm soát chất lượng. Bạn cảm thấy bế tắc.',
                icon: '🚧'
            },
            {
                title: '💸 "Công cụ no-code hạn chế, nâng cấp phải trả phí cao"',
                description: 'Wix, Bubble... chỉ làm được landing page đơn giản. Muốn custom logic phức tạp? Xin lỗi, không hỗ trợ hoặc phí hàng trăm USD/tháng.',
                icon: '💰'
            },
            {
                title: '🤯 "ChatGPT cho code, nhưng ghép lại thì... lỗi!"',
                description: 'AI viết code rời rạc, copy-paste vào không chạy. Không ai hướng dẫn cách tổ chức file, deploy, hay fix bug thực tế.',
                icon: '🔧'
            }
        ]
    },
    {
        id: 'comparison-1',
        type: 'comparison',
        title: 'Vibe Coding là gì?',
        subtitle: 'Phương pháp xây dựng app bằng AI + Tư duy hệ thống',
        content: 'Không phải học code truyền thống. Không phải no-code giới hạn. Vibe Coding là cách tiếp cận mới - dùng AI như trợ lý, bạn là kiến trúc sư.',
        items: [
            {
                title: '❌ Cách cũ',
                description: 'Học code 6 tháng → Làm dự án nhỏ → Mất hứng → Bỏ cuộc.',
                features: [
                    'Học syntax mệt mỏi',
                    'Dự án toy, không thực tế',
                    'Không biết bắt đầu từ đâu',
                    'Bế tắc khi gặp bug'
                ]
            },
            {
                title: '✅ Vibe Coding',
                description: 'Có ý tưởng → Prompt AI → Review & tinh chỉnh → Ship sản phẩm thật.',
                price: 'Hiệu quả gấp 10 lần',
                features: [
                    'Bắt đầu từ vấn đề thực tế CỦA BẠN',
                    'AI code, bạn kiểm soát logic',
                    'Ship sản phẩm sau 2-4 tuần Workshop',
                    'Có Consultant hỗ trợ xuyên suốt'
                ]
            }
        ]
    },
    {
        id: 'process-1',
        type: 'process',
        title: 'Ứng dụng bạn có thể xây dựng',
        subtitle: 'Phù hợp mọi đối tượng, mọi nhu cầu',
        items: [
            {
                title: '🏢 Cho Công ty / Doanh nghiệp',
                description: 'Hệ thống quản lý nhân sự, CRM, ERP mini, dashboard theo dõi KPI, công cụ tự động hóa workflow.'
            },
            {
                title: 'Cho Freelancer / Startup',
                description: 'SaaS MVP, landing page dynamic, hệ thống booking, app quản lý khách hàng, thanh toán online.'
            },
            {
                title: 'Cho Sinh viên / Cá nhân',
                description: 'App học tập, quản lý thời gian, flashcard AI, note-taking thông minh, portfolio cá nhân.'
            },
            {
                title: 'Cho Đam mê sáng tạo',
                description: 'Game web đơn giản, app entertainment, social tools, productivity apps, blog cá nhân.'
            }
        ]
    },
    {
        id: 'instructor-1',
        type: 'stats',
        title: 'Tư vấn từ người đã đi trước',
        subtitle: '10+ năm kinh nghiệm thực chiến',
        content: 'Không chỉ lý thuyết suông. Consultant của chúng tôi đã xây dựng hàng chục sản phẩm thực tế, từ startup đến enterprise.',
        items: [
            {
                title: '50+ Dự án đã hoàn thành',
                description: 'Từ MVP startup đến hệ thống enterprise phục vụ hàng nghìn users.'
            },
            {
                title: 'Tech Lead tại các công ty lớn',
                description: 'Kinh nghiệm làm việc và quản lý team tại FPT, VNG, các startup triệu USD.'
            },
            {
                title: 'Đã tư vấn cho 1000+ Member',
                description: 'Hiểu rõ điểm nghẽn của người mới, tối ưu lộ trình thực hành hiệu quả.'
            }
        ]
    },
    {
        id: 'testimonials-1',
        type: 'testimonials',
        title: 'Thành viên đã làm được gì?',
        subtitle: 'Kết quả thực tế từ những người như bạn'
    },
    {
        id: 'projects-1',
        type: 'projects',
        title: 'Sản phẩm Member đã ship',
        subtitle: 'Không phải tutorial - Đây là app thật, user thật, giá trị thật'
    },
    {
        id: 'benefits-1',
        type: 'benefits',
        title: 'Đồng Hành & Cùng Phát Triển',
        subtitle: 'Từ nền tảng công nghệ học trực tuyến đến đối tác chiến lược marketing tăng trưởng kinh doanh'
    },
    {
        id: 'cta-1',
        type: 'cta',
        title: 'Bắt đầu xây dựng app của bạn ngay hôm nay',
        subtitle: 'Đăng ký tham dự Workshop miễn phí. Trải nghiệm 7 ngày. Không cần thẻ tín dụng.',
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
        ctaText: 'Xem Workshop',
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

The Tulie Lab cung cấp tất cả điều đó trong các Workshop thực hành, và hỗ trợ xuyên suốt.`,
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
                icon: '👨‍💻'
            },
            {
                title: 'Community Mentors',
                description: 'Đội ngũ TA và mentors là Member xuất sắc đã ship sản phẩm thành công.',
                icon: '🤝'
            },
            {
                title: 'Guest speakers',
                description: 'Founders và CTOs từ các startup Việt Nam chia sẻ kinh nghiệm thực tế.',
                icon: '🎤'
            }
        ]
    },
    {
        id: 'about-cta',
        type: 'cta',
        title: 'Sẵn sàng bắt đầu?',
        subtitle: 'Tham gia cùng 1000+ Member đã thay đổi sự nghiệp với Vibe Coding.',
        ctaText: 'Đăng ký tham dự Workshop miễn phí',
        ctaLink: '/register'
    }
];

export const DEFAULT_INSTRUCTORS_PAGE_SECTIONS: Section[] = [
    {
        id: 'instructors-hero',
        type: 'hero',
        title: 'Đội ngũ Consultant',
        subtitle: 'Tư vấn từ những người có kinh nghiệm thực chiến trong ngành công nghệ.',
        ctaText: 'Xem Workshop',
        ctaLink: '/courses',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop'
    }
];
