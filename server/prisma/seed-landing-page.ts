
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

const PAGES_TO_SEED = [
    {
        title: "Lịch hoạt động",
        slug: "calendar",
        description: "Lịch khai giảng, webinar và các sự kiện mới nhất.",
        isActive: true,
        sections: [
            {
                "id": "hero-calendar",
                "type": "hero",
                "title": "Lịch hoạt động & Sự kiện",
                "subtitle": "Cập nhật lịch khai giảng, webinar và workshop mới nhất từ The Tulie Lab.",
                "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop",
                "ctaText": "Đăng ký tham gia",
                "ctaLink": "#events"
            }
        ]
    },
    {
        title: "Bảng giá & Gói thành viên",
        slug: "pricing",
        description: "Thông tin chi tiết về các gói thành viên và quyền lợi.",
        isActive: true,
        sections: [
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
                type: 'upsell',
                title: 'Các gói phổ biến',
                subtitle: 'Được nhiều thành viên lựa chọn',
                order: 2,
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
        ]
    },
    {
        title: "Google Sheets & Apps Script",
        slug: "google-sheets",
        description: "Tự động hóa công việc với Google Ecosystem.",
        isActive: true,
        sections: [
            {
                id: 'sheets-hero',
                type: 'hero',
                title: 'Google Sheets & Apps Script',
                subtitle: 'Tự động hóa & Quản trị dữ liệu',
                content: 'Biến bảng tính đơn giản thành hệ thống quản trị mạnh mẽ. Học cách viết script, tạo báo cáo tự động và kết nối dữ liệu chuyên nghiệp.',
                image: '/images/heroes/google-sheets.png',
                buttons: [
                    { label: 'Khám phá Template', href: '/shop', variant: 'primary' },
                    { label: 'Học Apps Script', href: '/courses', variant: 'outline' }
                ],
                isVisible: true,
                order: 1
            },
            {
                id: 'sheets-intro',
                type: 'content',
                title: 'Sức mạnh của Google Apps Script',
                subtitle: 'Mở rộng khả năng của Google Workspace',
                content: 'Apps Script cho phép bạn viết mã để tự động hóa các tác vụ trên Google Sheets, Docs, Forms và hơn thế nữa.\n\nTạo các hàm tùy chỉnh, menu, và web app ngay trên nền tảng Google mà không cần setup server phức tạp.',
                image: '/images/sheets-intro.jpg',
                imagePosition: 'right',
                isVisible: true,
                order: 2
            },
            {
                id: 'sheets-usecases',
                type: 'content-block',
                title: 'Ứng dụng Thực tế',
                subtitle: 'Tự động hóa Doanh nghiệp',
                isVisible: true,
                order: 3,
                items: [
                    {
                        title: 'Hệ thống CRM Tùy biến',
                        subtitle: 'Quản lý khách hàng',
                        description: 'Xây dựng CRM ngay trên Sheets. Quản lý thông tin, lịch sử mua hàng mà không cần tốn chi phí phần mềm đắt đỏ.',
                        image: '/images/sheets-crm.jpg',
                        features: [
                            'Quản lý Data khách hàng',
                            'Tự động gửi Email Marketing',
                            'Nhắc hẹn & Follow-up tự động'
                        ]
                    },
                    {
                        title: 'Báo cáo Tự động (Dashboard)',
                        subtitle: 'Realtime Data',
                        description: 'Biến những con số khô khan thành biểu đồ trực quan. Theo dõi KPI và tiến độ dự án mọi lúc mọi nơi.',
                        image: '/images/sheets-dashboard.jpg',
                        features: [
                            'Cập nhật dữ liệu từ nhiều nguồn',
                            'Báo cáo doanh thu qua Telegram/Slack',
                            'Trực quan hóa dữ liệu Realtime'
                        ]
                    }
                ]
            },
            {
                id: 'sheets-benefits',
                type: 'benefits',
                title: 'Tại sao chọn Google Sheets?',
                subtitle: 'Công cụ linh hoạt nhất thế giới',
                items: [
                    { title: 'Miễn phí & Đám mây', description: 'Truy cập mọi lúc mọi nơi, không cần cài đặt.', icon: 'Cloud' },
                    { title: 'Tùy biến cao', description: 'Xây dựng CRM, ERP mini theo đúng nhu cầu của bạn.', icon: 'Settings' },
                    { title: 'Cộng đồng lớn', description: 'Hàng ngàn template và script có sẵn để sử dụng.', icon: 'Users' }
                ],
                isVisible: true,
                order: 3
            },
            {
                id: 'sheets-cta',
                type: 'cta',
                title: 'Tối ưu hóa doanh nghiệp của bạn',
                subtitle: 'Sỡ hữu bộ công cụ quản trị tinh gọn ngay hôm nay',
                buttons: [
                    { label: 'Ghé thăm cửa hàng', href: '/shop', variant: 'primary' }
                ],
                isVisible: true,
                order: 4
            }
        ]
    },
    {
        title: "Ứng dụng AI",
        slug: "ai",
        description: "Giải pháp AI thực chiến cho công việc.",
        isActive: true,
        sections: [
            {
                id: 'ai-hero',
                type: 'hero',
                title: 'Ứng dụng AI Thực Chiến',
                subtitle: 'Tăng tốc độ làm việc gấp 10 lần',
                content: 'Tận dụng sức mạnh của trí tuệ nhân tạo để tự động hóa công việc, sáng tạo nội dung và giải quyết vấn đề phức tạp chỉ trong tích tắc.',
                image: '/images/heroes/ai-apps.png',
                buttons: [
                    { label: 'Tìm hiểu khóa học', href: '/courses', variant: 'primary' },
                    { label: 'Công cụ AI', href: '#tools', variant: 'outline' }
                ],
                isVisible: true,
                order: 1
            },
            {
                id: 'ai-intro',
                type: 'content',
                title: 'AI cho mọi người',
                subtitle: 'Không cần biết lập trình',
                content: 'Chúng tôi hướng dẫn bạn cách sử dụng các công cụ AI hàng đầu hiện nay như **ChatGPT**, **Midjourney**, **Claude**, v.v. để ứng dụng vào công việc văn phòng, marketing, thiết kế và đời sống.\n\nBạn sẽ học được cách:\n- Viết prompt (câu lệnh) hiệu quả.\n- Tối ưu hóa quy trình làm việc hàng ngày.\n- Giải quyết các vấn đề phức tạp nhanh chóng.',
                image: '/images/ai-intro.jpg',
                imagePosition: 'left',
                isVisible: true,
                order: 2
            },
            {
                id: 'ai-showcase',
                type: 'content-block',
                title: 'Sức mạnh của AI',
                subtitle: 'Ứng dụng thực tế vào công việc của bạn',
                isVisible: true,
                order: 3,
                items: [
                    {
                        title: 'Nghiên cứu & Phân tích',
                        subtitle: 'Research sâu',
                        description: 'Sử dụng sức mạnh của Perplexity, Consensus và Claude để tổng hợp thông tin từ hàng ngàn nguồn tài liệu trong vài giây. "AI giúp bạn tiết kiệm 90% thời gian nghiên cứu."',
                        image: '/images/ai-research.jpg',
                        features: [
                            'Tổng hợp thông tin siêu tốc',
                            'Phân tích xu hướng thị trường',
                            'Tự động hóa đọc hiểu báo cáo'
                        ]
                    },
                    {
                        title: 'Sáng tạo Hình ảnh',
                        subtitle: 'Nghệ thuật số',
                        description: 'Làm chủ Midjourney v6 và Stable Diffusion để tạo ra những hình ảnh tuyệt đẹp cho marketing, thiết kế và nội dung số.',
                        image: '/images/ai-art.jpg',
                        features: [
                            'Thiết kế Logo & Brand Identity',
                            'Tạo Concept Art & Character',
                            'Mở rộng hình ảnh với Firefly'
                        ]
                    },
                    {
                        title: 'Sản xuất Video Tự động',
                        subtitle: 'Kỷ nguyên Video AI',
                        description: 'Biến ý tưởng thành video động với Runway Gen-2, Pika Labs và Sora. Không cần ekip quay phim đắt tiền, chỉ cần trí tưởng tượng.',
                        image: '/images/ai-video.jpg',
                        features: [
                            'Tạo video quảng cáo từ Text',
                            'Làm phim hoạt hình ngắn',
                            'Lồng tiếng AI đa ngôn ngữ'
                        ]
                    }
                ]
            },
            {
                id: 'ai-benefits',
                type: 'benefits',
                title: 'Sức mạnh của AI',
                subtitle: 'Giải pháp cho kỷ nguyên số',
                items: [
                    { title: 'Tự động hóa', description: 'Giảm thiểu các tác vụ lặp lại nhàm chán.', icon: 'Cpu' },
                    { title: 'Sáng tạo nội dung', description: 'Viết bài, tạo ảnh, dựng video nhanh chóng.', icon: 'Image' },
                    { title: 'Phân tích dữ liệu', description: 'Xử lý và đưa ra insight từ dữ liệu khổng lồ.', icon: 'BarChart' }
                ],
                isVisible: true,
                order: 3
            },
            {
                id: 'ai-cta',
                type: 'cta',
                title: 'Làm chủ công nghệ AI',
                subtitle: 'Đừng để bị bỏ lại phía sau trong cuộc cách mạng này',
                buttons: [
                    { label: 'Xem khoá học AI', href: '/courses', variant: 'primary' }
                ],
                isVisible: true,
                order: 4
            }
        ]
    },
]
    },
{
    title: "Vibe Coding Cho Người Mới Bắt Đầu - Khóa Học Lập Trình Cùng AI",
        slug: "vibe-coding-nguoi-moi",
            description: "Khóa học Vibe Coding toàn diện dành cho người mới bắt đầu.",
                isActive: true,
                    sections: [
                        {
                            id: "vibe-newbie-hero",
                            type: "hero",
                            title: "Vibe Coding: Lập Trình Cùng AI",
                            subtitle: "Không cần kinh nghiệm code. Chỉ cần ý tưởng sáng tạo.",
                            content: "Khóa học tiên phong giúp bạn làm chủ sức mạnh của AI để xây dựng phần mềm, website và ứng dụng chỉ trong thời gian ngắn. Biến ý tưởng thành hiện thực ngay hôm nay.",
                            image: "/images/heroes/vibe-coding.png",
                            ctaText: "Đăng ký ưu đãi ngay",
                            ctaLink: "#payment",
                            isVisible: true,
                            order: 1
                        },
                        {
                            id: "vibe-countdown",
                            type: "sales-countdown",
                            highlight: null, // Use duration
                            duration: 1020, // 17 hours * 60 minutes
                            ctaText: "Nhận ưu đãi giảm 50%",
                            ctaLink: "#payment",
                            isVisible: true,
                            order: 2
                        },
                        {
                            id: "vibe-intro",
                            type: "content",
                            title: "Tại sao chọn Vibe Coding?",
                            subtitle: "Kỷ nguyên mới của lập trình",
                            content: "Vibe Coding không nhắm đến việc đào tạo bạn trở thành một kỹ sư phần mềm chuyên sâu về thuật toán. Chúng tôi hướng dẫn bạn cách **\"chơi nhạc\" cùng AI**.\n\nSử dụng Prompt Engineering, tư duy hệ thống và các công cụ AI (Cursor, Claude 3.5 Sonnet, v0.dev) để tạo ra sản phẩm thực tế mà không cần gõ từng dòng code thủ công.",
                            image: "/images/vibe-coding-intro.jpg",
                            imagePosition: "right",
                            isVisible: true,
                            order: 3
                        },
                        {
                            id: "vibe-benefits",
                            type: "benefits",
                            title: "Bạn sẽ đạt được gì?",
                            subtitle: "Kết quả sau khóa học",
                            items: [
                                { title: "Tư duy Lập trình AI", description: "Hiểu cách AI 'suy nghĩ' và cách ra lệnh hiệu quả.", icon: "Brain" },
                                { title: "Xây dựng 3 Dự án", description: "Hoàn thiện 3 ứng dụng thực tế: Landing Page, To-Do App, AI Chatbot.", icon: "Layers" },
                                { title: "Làm chủ Công cụ", description: "Thành thạo Cursor, Vercel, Supabase và v0.dev.", icon: "Tool" },
                                { title: "Kiếm tiền từ Code", description: "Biết cách đóng gói sản phẩm số để kinh doanh hoặc freelance.", icon: "DollarSign" }
                            ],
                            isVisible: true,
                            order: 4
                        },
                        {
                            id: "vibe-curriculum",
                            type: "curriculum",
                            title: "Lộ trình học tập chi tiết",
                            subtitle: "Đi từ con số 0 đến khi có sản phẩm đầu tay",
                            items: [
                                {
                                    title: "Phần 1: Tư Duy & Setup (The Vibe)",
                                    description: "Thiết lập môi trường làm việc 'cực chill' và cài đặt tư duy đúng đắn.",
                                    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
                                    lessons: [
                                        "Bài 1: Vibe Coding là gì? Tại sao lại Hot?",
                                        "Bài 2: Setup góc làm việc tạo cảm hứng (Desk Setup)",
                                        "Bài 3: Cài đặt Cursor & AI Tools cần thiết",
                                        "Tài liệu: Checklist setup môi trường"
                                    ]
                                },
                                {
                                    title: "Phần 2: Nền tảng HTML/CSS/JS cùng AI",
                                    description: "Học cú pháp cơ bản siêu tốc nhờ sự trợ giúp của AI.",
                                    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
                                    lessons: [
                                        "Bài 4: Prompt Engineering cho Frontend",
                                        "Bài 5: Dựng giao diện với v0.dev trong 5 phút",
                                        "Bài 6: Tùy chỉnh CSS/Tailwind không cần nhớ code",
                                        "Project 1: Portfolio cá nhân"
                                    ]
                                },
                                {
                                    title: "Phần 3: Xây dựng Ứng dụng Thực chiến",
                                    description: "Kết nối Backend, Database và triển khai ứng dụng.",
                                    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
                                    lessons: [
                                        "Bài 7: React & Next.js Crash Course (AI hỗ trợ)",
                                        "Bài 8: Kết nối Database Supabase/Firebase",
                                        "Bài 9: Deploy lên Vercel & Custom Domain",
                                        "Project 2: Ứng dụng quản lý công việc (SaaS Mini)"
                                    ]
                                }
                            ],
                            isVisible: true,
                            order: 5
                        },
                        {
                            id: "vibe-bonus",
                            type: "bonus",
                            title: "Quà tặng đặc biệt",
                            subtitle: "Chỉ dành cho học viên đăng ký hôm nay",
                            items: [
                                { title: "Bộ Prompt Vip", description: "Thư viện 500+ Prompts tối ưu cho Coding.", value: "Trị giá 2.000.000đ" },
                                { title: "Ebook: Freelance Guide", description: "Hướng dẫn tìm việc và deal giá dự án với khách hàng.", value: "Trị giá 500.000đ" },
                                { title: "Community Access", description: "Tham gia Discord kín, support 1:1 trọn đời.", value: "Vô giá" }
                            ],
                            isVisible: true,
                            order: 6
                        },
                        {
                            id: "vibe-payment",
                            type: "payment",
                            title: "Đầu tư cho bản thân ngay hôm nay",
                            subtitle: "Cam kết hoàn tiền trong 7 ngày nếu không hài lòng",
                            content: "Sở hữu trọn đời khóa học + Tất cả tài nguyên đi kèm.",
                            pricing: [
                                {
                                    id: "plan-retail",
                                    title: "Mua lẻ (Single)",
                                    price: "Lựa chọn",
                                    originalPrice: "",
                                    description: "Lựa chọn và mua lẻ từng Template/Ứng dụng AI phù hợp với nhu cầu sử dụng thực tế.",
                                    tag: "LINH HOẠT",
                                    features: [
                                        "Mua lẻ theo túi tiền",
                                        "Sở hữu vĩnh viễn file",
                                        "Tiết kiệm chi phí ban đầu",
                                        "Hỗ trợ setup cơ bản"
                                    ],
                                    link: "/shop",
                                    ctaText: "Xem cửa hàng",
                                    isPopular: false
                                },
                                {
                                    id: "plan-basic",
                                    title: "Gói Cơ Bản",
                                    price: "1.990k/năm",
                                    originalPrice: "3.500k",
                                    description: "Truy cập và tải xuống KHÔNG GIỚI HẠN toàn bộ kho Template Google Sheets & Apps Script.",
                                    tag: "PHỔ BIẾN",
                                    features: [
                                        "Tải xuống Unlimited Template",
                                        "Truy cập Template Premium mới nhất",
                                        "Tiết kiệm >90% chi phí mua lẻ",
                                        "Cập nhật mẫu mới hàng tuần",
                                        "Hỗ trợ kỹ thuật qua Group"
                                    ],
                                    link: "/checkout/yearly-shop",
                                    ctaText: "Đăng ký Gói Cơ Bản",
                                    isPopular: true
                                },
                                {
                                    id: "plan-premium",
                                    title: "Gói Premium",
                                    price: "4.990k/năm",
                                    originalPrice: "15.000k",
                                    description: "Giải pháp thiết kế riêng và hỗ trợ kỹ thuật 1:1 cho Doanh nghiệp/Cá nhân chuyên nghiệp.",
                                    tag: "VIP SUPPORT",
                                    features: [
                                        "Tất cả quyền lợi Gói Cơ Bản",
                                        "Thiết kế Custom Template (theo yêu cầu)",
                                        "Support 1:1 qua Zoom/UltraViewer",
                                        "Setup hệ thống Automation riêng",
                                        "Tư vấn quy trình vận hành tối ưu",
                                        "Ưu tiên hỗ trợ 24/7"
                                    ],
                                    link: "/contact",
                                    ctaText: "Liên hệ tư vấn",
                                    isPopular: false
                                }
                            ],
                            isVisible: true,
                            order: 7
                        }
                    ]
},
{
    title: "Vibe Coding",
        slug: "vibe-coding",
            description: "Phong cách lập trình hiện đại, sáng tạo.",
                isActive: true,
                    sections: [
                        {
                            id: 'vibe-hero',
                            type: 'hero',
                            title: 'Vibe Coding',
                            subtitle: 'Khơi nguồn cảm hứng - Sáng tạo không giới hạn',
                            content: 'Trải nghiệm phong cách lập trình mới mẻ, nơi code không chỉ là những dòng lệnh khô khan mà là một tác phẩm nghệ thuật đầy cảm hứng.',
                            image: '/images/heroes/vibe-coding.png',
                            buttons: [
                                { label: 'Khám phá ngay', href: '/courses', variant: 'primary' },
                                { label: 'Xem demo', href: '#demo', variant: 'outline' }
                            ],
                            isVisible: true,
                            order: 1
                        },
                        {
                            id: 'vibe-intro',
                            type: 'content',
                            title: 'Vibe Coding là gì?',
                            subtitle: 'Hơn cả việc viết mã',
                            content: 'Vibe Coding là phương pháp tiếp cận lập trình tập trung vào trạng thái dòng chảy (flow state) và trải nghiệm thẩm mỹ.\n\nChúng tôi tin rằng **môi trường làm việc đẹp**, **công cụ tối ưu** và **tư duy nghệ thuật** sẽ giúp lập trình viên không chỉ làm việc hiệu quả hơn mà còn tìm thấy niềm vui trong từng dòng code.',
                            image: '/images/vibe-coding-intro.jpg',
                            imagePosition: 'right',
                            isVisible: true,
                            order: 2
                        },
                        {
                            id: 'vibe-core',
                            type: 'content-block',
                            title: 'Triết lý Vibe Coding',
                            subtitle: 'Nghệ thuật & Hiệu suất',
                            isVisible: true,
                            order: 3,
                            items: [
                                {
                                    title: 'Không gian (The Setup)',
                                    subtitle: 'Nơi cảm hứng bắt đầu',
                                    description: '"Không gian định hình tư duy. Setup đẹp, Code sạch." Một setup chuẩn Vibe Coding không chỉ đẹp mà còn tối ưu cho sức khỏe.',
                                    image: '/images/vibe-setup.jpg',
                                    features: [
                                        'Ánh sáng Ambient bảo vệ mắt',
                                        'Âm thanh Lo-fi/Synthwave tập trung',
                                        'Gear công thái học cao cấp'
                                    ]
                                },
                                {
                                    title: 'Trạng thái Dòng chảy (Flow)',
                                    subtitle: 'Đỉnh cao tập trung',
                                    description: 'Khi bạn ở trong "The Zone", code tuôn trào như một bản nhạc. Học cách loại bỏ xao nhãng và tối đa hóa năng suất.',
                                    image: '/images/vibe-flow.jpg',
                                    features: [
                                        'Loại bỏ xao nhãng Digital',
                                        'Kỹ thuật Deep Work & Pomodoro',
                                        'Mindfulness cho Developer'
                                    ]
                                }
                            ]
                        },
                        {
                            id: 'vibe-benefits',
                            type: 'benefits',
                            title: 'Lợi ích của Vibe Coding',
                            subtitle: 'Tại sao bạn nên theo đuổi?',
                            items: [
                                { title: 'Tăng sự tập trung', description: 'Đạt trạng thái Flow nhanh chóng nhờ môi trường và tư duy tối ưu.', icon: 'Zap' },
                                { title: 'Cảm hứng sáng tạo', description: 'Biến việc code thành quá trình sáng tạo nghệ thuật.', icon: 'Palette' },
                                { title: 'Hiệu suất cao', description: 'Tối ưu hóa quy trình làm việc với các công cụ và setup chuẩn.', icon: 'TrendingUp' }
                            ],
                            isVisible: true,
                            order: 3
                        },
                        {
                            id: 'vibe-cta',
                            type: 'cta',
                            title: 'Bắt đầu hành trình Vibe Coding',
                            subtitle: 'Tham gia cộng đồng những lập trình viên nghệ sĩ ngay hôm nay',
                            buttons: [
                                { label: 'Đăng ký khoá học', href: '/courses', variant: 'primary' }
                            ],
                            isVisible: true,
                            order: 4
                        }
                    ]
},
{
    title: "Template Landing Page (Mẫu)",
        slug: "mau-landing-page",
            description: "Trang mẫu demo tất cả các component.",
                isActive: false,
                    sections: [
                        {
                            "id": "hero-1",
                            "type": "hero",
                            "title": "Mẫu Landing Page",
                            "subtitle": "Đây là trang mẫu để tham khảo cấu trúc.",
                            "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                        }
                    ]
}
];

const SLUGS_TO_REMOVE = ["mau-day-du-tinh-nang", "gioi-thieu", "introduction"];

async function main() {
    console.log('Start seeding landing pages...');

    if (SLUGS_TO_REMOVE.length > 0) {
        console.log(`Removing obsolete pages: ${SLUGS_TO_REMOVE.join(', ')}`);
        await prismaClient.landingPage.deleteMany({
            where: {
                slug: { in: SLUGS_TO_REMOVE }
            }
        });
    }

    for (const page of PAGES_TO_SEED) {
        const existing = await prismaClient.landingPage.findUnique({
            where: { slug: page.slug }
        });

        if (existing) {
            console.log(`Update existing page: ${page.slug}`);
            await prismaClient.landingPage.update({
                where: { slug: page.slug },
                data: {
                    title: page.title,
                    description: page.description,
                    sections: page.sections as any,
                    isActive: page.isActive
                }
            });
        } else {
            console.log(`Create new page: ${page.slug}`);
            await prismaClient.landingPage.create({
                data: {
                    ...page,
                    sections: page.sections as any
                }
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });

export { };
