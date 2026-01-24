
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
            description: "Biến ý tưởng thành ứng dụng thực tế trong 30 phút - Không cần kinh nghiệm lập trình.",
                isActive: true,
                    sections: [
                        {
                            id: "vibe-hero",
                            type: "hero",
                            title: "BIẾN Ý TƯỞNG THÀNH ỨNG DỤNG THỰC TẾ TRONG 30 PHÚT",
                            subtitle: "Làm chủ tư duy \"Vibe Coding\": Tự tay xây dựng 10 Mini Apps giải quyết công việc Marketing, Sales, Admin và Đời sống ngay lập tức.",
                            content: "✅ Không cần học code phức tạp.\n✅ Sở hữu vĩnh viễn Source Code 10 ứng dụng thực chiến.\n✅ Tiết kiệm hàng chục triệu đồng thuê Dev.",
                            image: "/images/heroes/vibe-coding.png",
                            ctaText: "ĐĂNG KÝ HỌC NGAY - 1.790.000Đ",
                            ctaLink: "#payment",
                            isVisible: true,
                            order: 1
                        },
                        {
                            id: "vibe-pain",
                            type: "content-block",
                            title: "Dừng ngay việc lãng phí thời gian và tiền bạc",
                            subtitle: "Bạn có đang rơi vào những tình cảnh này?",
                            items: [
                                {
                                    title: "Thao tác thủ công lặp lại",
                                    description: "Ngày nào cũng phải copy-paste dữ liệu giữa 10 file Excel, sửa từng dòng báo cáo. Cảm giác như một \"cỗ máy chạy cơm\".",
                                    image: "/images/pain-manual.jpg"
                                },
                                {
                                    title: "Bế tắc ý tưởng công nghệ",
                                    description: "Muốn có app tính lương, tool viết content nhưng nghĩ đến chi phí thuê chục triệu lại thôi.",
                                    image: "/images/pain-idea.jpg"
                                },
                                {
                                    title: "Dùng AI chưa tới",
                                    description: "Chỉ biết chat với ChatGPT mà chưa biết biến nó thành \"nhân viên lập trình\" để tạo ra công cụ làm việc.",
                                    image: "/images/pain-ai.jpg"
                                }
                            ],
                            isVisible: true,
                            order: 2
                        },
                        {
                            id: "vibe-solution",
                            type: "content",
                            title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
                            subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
                            content: "**Vibe Coding** không bắt bạn học cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng và luồng đi (Flow).\n* **AI là Thợ Xây:** AI (Cursor, Claude...) sẽ viết code và hoàn thiện sản phẩm.\n\nTôi không dạy bạn làm Dev đi xin việc. Tôi dạy bạn tư duy dùng AI để tạo công cụ phục vụ chính mình.",
                            image: "/images/vibe-solution.jpg",
                            imagePosition: "right",
                            isVisible: true,
                            order: 3
                        },
                        {
                            id: "vibe-curriculum",
                            type: "curriculum",
                            title: "Lộ Trình Thực Chiến 10 Ngày",
                            subtitle: "Cầm tay chỉ việc - Từ con số 0 đến 10 Apps",
                            items: [
                                {
                                    title: "Module 1: Khởi động & Tư duy (Móng nhà)",
                                    description: "Thiết lập môi trường và cài đặt tư duy đúng.",
                                    lessons: [
                                        "Bài 1: Thiết lập môi trường Vibe Coding (Cursor, Bolt.new)",
                                        "Bài 2: Product Mindset - Phân rã vấn đề",
                                        "Bài 3: Prompt Engineering - Thần chú ra lệnh cho AI"
                                    ]
                                },
                                {
                                    title: "Module 2: Xây dựng 10 Super Apps (Thực hành)",
                                    description: "Code từng dòng cho 10 ứng dụng thực tế.",
                                    lessons: [
                                        "Marketing: Caption Generator, QR Branding, Watermark Tool",
                                        "Văn phòng: Excel Merger, PDF Invoice, Salary Calculator",
                                        "Cá nhân: Eisenhower Todo, AI Flashcard, Voice to Note",
                                        "Tổng hợp: Personal Dashboard"
                                    ]
                                },
                                {
                                    title: "Module 3: Triển khai & Kiếm tiền",
                                    description: "Đưa ứng dụng lên Internet và kinh doanh.",
                                    lessons: [
                                        "Bài 11: Deploy miễn phí lên Vercel/Netlify",
                                        "Bài 12: Business Model - Đóng gói bán lại hoặc Freelance"
                                    ]
                                }
                            ],
                            isVisible: true,
                            order: 4
                        },
                        {
                            id: "vibe-value",
                            type: "benefits",
                            title: "Bài toán kinh tế: 1.790k là Đắt hay Rẻ?",
                            subtitle: "So sánh chi phí nếu bạn KHÔNG học khoá này",
                            items: [
                                { title: "Thuê Freelancer/Dev", description: "~5.000.000đ/năm (cho 2 app đơn giản)", icon: "DollarSign" },
                                { title: "Mua phần mềm SaaS", description: "~3.600.000đ/năm (300k/tháng)", icon: "CreditCard" },
                                { title: "Thời gian lãng phí", description: "~30.000.000đ/năm (1h/ngày)", icon: "Clock" }
                            ],
                            isVisible: true,
                            order: 5
                        },
                        {
                            id: "vibe-bonuses",
                            type: "bonus",
                            title: "Quà tặng độc quyền (Trị giá 5.000.000đ)",
                            subtitle: "Dành cho học viên đăng ký hôm nay",
                            items: [
                                { title: "Ebook 'Vibe Coding Playbook'", description: "Cẩm nang tra cứu thuật ngữ & UI.", value: "Trị giá 500k" },
                                { title: "Thư viện 'Thần Chú' Prompt", description: "Copy & Paste để code chạy ngay.", value: "Trị giá 2M" },
                                { title: "Full Source Code 10 Mini Apps", description: "Toàn quyền chỉnh sửa và kinh doanh.", value: "Trị giá 10M" },
                                { title: "Private Group Support", description: "Hỗ trợ trọn đời, cập nhật công nghệ mới.", value: "Vô giá" }
                            ],
                            isVisible: true,
                            order: 6
                        },
                        {
                            id: "vibe-instructor",
                            type: "content",
                            title: "Giảng viên: Liên",
                            subtitle: "Người đi trước chia sẻ con đường ngắn nhất",
                            content: "Tôi không xuất thân là dân IT. Tôi là dân Marketing & Quản trị giống bạn.\n\nTừng chật vật với quy trình thủ công và tốn kém thuê Dev, tôi tìm ra Vibe Coding và thay đổi hoàn toàn cách làm việc. Tôi ở đây để giúp bạn làm chủ nó.",
                            image: "/images/instructor-lien.jpg",
                            imagePosition: "left",
                            isVisible: true,
                            order: 7
                        },
                        {
                            id: "vibe-faq",
                            type: "faq",
                            title: "Câu hỏi thường gặp",
                            subtitle: "Giải đáp thắc mắc",
                            items: [
                                { question: "Tôi mù công nghệ có học được không?", answer: "Được. Công cụ hiểu tiếng Việt, chỉ cần tư duy logic." },
                                { question: "Máy tính yếu có học được không?", answer: "Được. Chúng ta code trên Cloud (Web)." },
                                { question: "Học qua hình thức nào?", answer: "Video quay sẵn 4K, xem lại trọn đời." },
                                { question: "Có hỗ trợ khi gặp lỗi không?", answer: "Có đội ngũ support 1:1 trong nhóm kín." }
                            ],
                            isVisible: true,
                            order: 8
                        },
                        {
                            id: "vibe-payment",
                            type: "payment",
                            title: "Đầu tư cho tương lai ngay hôm nay",
                            subtitle: "Đừng để AI thay thế bạn. Hãy học cách điều khiển nó.",
                            content: "Cam kết hoàn tiền trong 3 ngày nếu không làm được App đầu tiên.",
                            pricing: [
                                {
                                    id: "plan-retail",
                                    title: "Mua lẻ (Single)",
                                    price: "Lựa chọn",
                                    originalPrice: "",
                                    description: "Mua lẻ từng Template/Ứng dụng AI phù hợp nhu cầu.",
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
                                    id: "plan-course",
                                    title: "Khoá học Vibe Coding",
                                    price: "1.790.000đ",
                                    originalPrice: "5.000.000đ",
                                    description: "Trọn bộ Khoá học + 10 Source Code + Quà tặng.",
                                    tag: "ƯU ĐÃI FLASH SALE",
                                    features: [
                                        "Truy cập trọn đời",
                                        "Sở hữu 10 Source Apps",
                                        "Support 1:1 qua Nhóm kín",
                                        "Tặng Bộ Prompt Thần chú"
                                    ],
                                    link: "/checkout?product=vibe-coding",
                                    ctaText: "ĐĂNG KÝ HỌC NGAY",
                                    isPopular: true
                                }
                            ],
                            isVisible: true,
                            order: 9
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
