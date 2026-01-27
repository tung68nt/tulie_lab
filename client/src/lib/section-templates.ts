import { Section } from "@/types/sections";

export interface SectionTemplate {
    id: string;
    name: string;
    category: 'Hero' | 'Content' | 'Social Proof' | 'Conversion' | 'Special' | 'System';
    description: string;
    data: Section;
    previewImage?: string; // New field
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
    {
        id: 'hero-standard',
        name: 'Standard Hero',
        category: 'Hero',
        description: 'Classic hero with title, subtitle, and single CTA.',
        previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'hero-std',
            type: 'hero',
            name: 'Standard Hero',
            title: 'Học Lập Trình Vibe Coding',
            subtitle: 'Khóa học thực chiến giúp bạn làm chủ tư duy lập trình và xây dựng sản phẩm công nghệ chỉ sau 3 tháng.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000',
            ctaText: 'Đăng Ký Học Thử',
            ctaLink: '/courses',
            showDotPattern: true
        }
    },
    {
        id: 'stats-modern',
        name: 'Modern Stats Grid',
        category: 'Social Proof',
        description: '4-column grid with icons and animated numbers.',
        previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'stats-mod',
            type: 'stats',
            name: 'Modern Stats Grid',
            title: 'Con Số Biết Nói',
            subtitle: 'Kết quả thực tế từ cộng đồng học viên',
            content: 'Chúng tôi tự hào về những cột mốc đã đạt được cùng học viên.',
            showDotPattern: true,
            items: [
                { value: "12k+", label: "Học viên", icon: "Users", description: "Đang theo học mỗi ngày" },
                { value: "500+", label: "Dự án", icon: "Code", description: "Đã hoàn thành và deploy" },
                { value: "95%", label: "Hài lòng", icon: "Heart", description: "Đánh giá 5 sao" },
                { value: "24/7", label: "Hỗ trợ", icon: "Zap", description: "Mentor giải đáp" }
            ]
        }
    },
    {
        id: 'comparison-table',
        name: 'Comparison Table',
        category: 'Content',
        description: 'Compare your offering with competitors.',
        previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'comparison-tbl',
            type: 'comparison',
            name: 'Comparison Table',
            title: 'Tại Sao Chọn Chúng Tôi?',
            subtitle: 'Sự khác biệt tạo nên thành công',
            content: 'So sánh lộ trình học tập của chúng tôi với các phương pháp khác.',
            showDotPattern: true,
            items: [
                {
                    title: "Tự Học Online",
                    price: "Miễn phí",
                    description: "Phù hợp người có kỷ luật thép",
                    features: ["Không có lộ trình rõ ràng", "Thiếu mentor hướng dẫn", "Dễ bỏ cuộc giữa chừng", "Không có cộng đồng", "Nội dung rời rạc"]
                },
                {
                    title: "Vibe Coding Academy",
                    price: "Tối Ưu",
                    description: "Lộ trình chuẩn kỹ sư",
                    features: ["Lộ trình bài bản A-Z", "Mentor hỗ trợ 1:1", "Cam kết đầu ra", "Cộng đồng năng động", "Dự án thực tế"]
                },
                {
                    title: "Trung Tâm Offline",
                    price: "20tr+",
                    description: "Chi phí cao, thời gian cố định",
                    features: ["Lịch học gò bó", "Sĩ số lớp đông", "Nội dung cập nhật chậm", "Đi lại tốn thời gian", "Học phí đắt đỏ"]
                }
            ]
        }
    },
    {
        id: 'coding-methods',
        name: 'Coding Methods',
        category: 'Content',
        description: 'Explanation of coding methodology.',
        previewImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'coding-meth',
            type: 'coding-methods',
            name: 'Coding Methods',
            title: 'Phương Pháp Vibe Coding',
            subtitle: 'Học nhàn, hiểu sâu, ứng dụng ngay',
            showDotPattern: true,
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
                        feasibility: { detail: "🔥 Rất khó (Cần tư duy Product)", status: "error" },
                        goal: { detail: "Làm ra tiền. Sản phẩm hoàn thiện, có thanh toán, có email, bảo mật tốt.", "status": "ok" },
                        ai_usage: { detail: '"Dùng AI để tối ưu". AI viết test tự động, AI check lỗi bảo mật, AI tối ưu tốc độ.', status: "ok" },
                        data: { detail: "Bảo vệ dữ liệu: Phân quyền (AI xem được cái gì), Sao lưu dữ liệu (Backup).", status: "ok" },
                        limits: { detail: "Cần kiến thức về triển khai (Deploy), tên miền, chi phí server.", status: "warn" },
                        output: { detail: "Startup công nghệ: Sàn TMĐT ngách, App học tập, Mạng xã hội nội bộ.", status: "ok" }
                    }
                }
            ]
        }
    },
    {
        id: 'process-roadmap',
        name: 'Process Roadmap',
        category: 'Content',
        description: 'Step-by-step roadmap with connecting lines.',
        previewImage: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'process-road',
            type: 'process',
            name: 'Process Roadmap',
            title: 'Lộ Trình Học Tập',
            subtitle: '3 giai đoạn để trở thành lập trình viên chuyên nghiệp',
            showDotPattern: true,
            items: [
                { title: "Giai đoạn 1: Nền Tảng", description: "Làm chủ tư duy lập trình và các công cụ cơ bản (HTML, CSS, JS)." },
                { title: "Giai đoạn 2: Chuyên Sâu", description: "Học các Framework hiện đại (React, Next.js) và xây dựng Backend." },
                { title: "Giai đoạn 3: Dự Án Thật", description: "Xây dựng sản phẩm hoàn chỉnh, deploy và tối ưu hiệu năng." }
            ]
        }
    },
    {
        id: 'features-grid',
        name: 'Features Grid',
        category: 'Content',
        description: 'Grid of feature cards with icons.',
        previewImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'feature-grd',
            type: 'features',
            name: 'Features Grid',
            title: 'Quyền Lợi Học Viên',
            subtitle: 'Những điều tuyệt vời bạn sẽ nhận được',
            showDotPattern: true,
            items: [
                { title: "Mentor Theo Sát 1:1", description: "Không bỏ rơi học viên. Hỗ trợ giải đáp thắc mẳc và sửa bài chi tiết hàng ngày.", icon: "Zap" },
                { title: "Dự Án Cá Nhân Cao Cấp", description: "Làm chủ trọn bộ kỹ năng để xây dựng sản phẩm chất lượng, có tính ứng dụng cao.", icon: "Cpu" },
                { title: "Lộ Trình Tối Ưu", description: "Học những gì thực sự cần thiết. Tiết kiệm 80% thời gian so với các phương pháp cũ.", icon: "Target" },
                { title: "Cộng Đồng Tương Trợ", description: "Tham gia network cùng những người có tư duy đột phá, sẵn sàng chia sẻ.", icon: "Users" },
                { title: "Hỗ Trợ Việc Làm", description: "Tư vấn CV, kỹ năng phỏng vấn và kết nối trực tiếp với 20+ doanh nghiệp đối tác.", icon: "Briefcase" },
                { title: "Sở Hữu Tài Liệu Độc Quyền", description: "Bộ template, source code mẫu và ebook chuyên sâu chỉ dành cho học viên.", icon: "Lock" }
            ]
        }
    },
    {
        id: 'content-block-alternating',
        name: 'Content Block (Alternating)',
        category: 'Content',
        description: 'Alternating image/text layout for detailed content.',
        previewImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'content-block-alt',
            type: 'content-block',
            name: 'Content Block (Alternating)',
            title: 'Chi Tiết Khóa Học',
            subtitle: 'Nội dung được thiết kế sát với thực tế',
            showDotPattern: true,
            items: [
                {
                    title: "Module 1: Frontend Modern",
                    subtitle: "TUẦN 1-4",
                    description: "Làm chủ giao diện người dùng với công nghệ mới nhất.",
                    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1000",
                    features: ["HTML5, CSS3, Flexbox & Grid", "JavaScript ES6+ Deep Dive", "Responsive Design", "UI/UX cơ bản"]
                },
                {
                    title: "Module 2: React & Ecosystem",
                    subtitle: "TUẦN 5-8",
                    description: "Xây dựng Single Page Application mạnh mẽ.",
                    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
                    features: ["React Hooks & Components", "State Management (Redux/Zustand)", "React Query & API Integration", "Performance Optimization"]
                }
            ]
        }
    },
    {
        id: 'curriculum-list',
        name: 'Lesson Curriculum',
        category: 'Content',
        description: 'Detailed list of course curriculum with lessons and images.',
        previewImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'curriculum-lst',
            type: 'curriculum',
            name: 'Lesson Curriculum',
            title: 'Lộ Trình Đào Tạo Thực Chiến',
            subtitle: 'Chương trình được thiết kế từ cơ bản đến nâng cao, tập trung vào kỹ năng xây dựng sản phẩm.',
            showDotPattern: true,
            items: [
                {
                    title: "Module 1: Mindset & Fundamentals",
                    description: "Xây dựng tư duy giải quyết vấn đề và nắm vững nền tảng cốt lõi của lập trình hiện đại.",
                    duration: "12 bài học",
                    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1000",
                    lessons: [
                        "Tư duy Vibe Coding: Code để tạo ra giá trị",
                        "Kiến trúc ứng dụng Web hiện đại",
                        "Làm chủ Git & Workflow làm việc chuyên nghiệp",
                        "Tài liệu: Cẩm nang Roadmap thành công"
                    ]
                },
                {
                    title: "Module 2: Frontend Mastery with Next.js",
                    description: "Xây dựng giao diện đẳng cấp, hiệu năng cao và chuẩn SEO với React & Next.js.",
                    duration: "24 bài học",
                    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
                    lessons: [
                        "Deep Dive into React Server Components",
                        "State Management & Data Fetching",
                        "Xây dựng Design System với Tailwind & Shadcn",
                        "Tài liệu: Bộ UI Kit độc quyền Tulie"
                    ]
                },
                {
                    title: "Module 3: Fullstack Deployment & AI Integration",
                    description: "Kết nối Backend, triển khai ứng dụng thực tế và tích hợp sức mạnh từ AI.",
                    duration: "18 bài học",
                    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
                    lessons: [
                        "Kiến trúc API & Database với Prisma",
                        "Tích hợp OpenAI SDK vào ứng dụng",
                        "Deploy & CI/CD lên Google Cloud Run",
                        "Tài liệu: Template dự án Fullstack chuẩn"
                    ]
                }
            ]
        }
    },
    {
        id: 'student-showcase',
        name: 'Student Showcase',
        category: 'Social Proof',
        description: 'Showcase of student work with "Before/After" stories.',
        previewImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'student-show',
            type: 'student-showcase',
            name: 'Student Showcase',
            title: 'Sản Phẩm Học Viên',
            subtitle: 'Những dự án tiêu biểu được xây dựng sau khóa học',
            showDotPattern: true,
            items: [
                {
                    title: "AI Video Editor SaaS",
                    subtitle: "Bởi: Minh Quân (Ex-Designer)",
                    description: "Ứng dụng biên tập video tự động bằng AI, xử lý video 4K trên cloud với Next.js và FFmpeg.",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
                    link: "#",
                    before: ["Chưa biết gì về code", "Làm UI/UX Designer"],
                    after: ["Fullstack Software Engineer", "Build xong MVP startup riêng"]
                },
                {
                    title: "Real-time Fintech App",
                    subtitle: "Bởi: Hoài Nam (SV năm 3)",
                    description: "Dashboard quản lý tài chính cá nhân tích hợp Biểu đồ theo thời gian thực và Quản lý giao dịch.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
                    link: "#",
                    before: ["Sinh viên trái ngành", "Mất gốc lập trình"],
                    after: ["Intern tại Unicorn Startup", "Tự tin xây dựng app quy mô lớn"]
                },
                {
                    title: "Smart Travel Planner",
                    subtitle: "Bởi: Thuỳ Chi (Freelancer)",
                    description: "Ứng dụng lên kế hoạch du lịch thông minh, gợi ý địa điểm theo sở thích người dùng.",
                    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
                    link: "#",
                    before: ["Đang làm Marketing", "Từng học code nhưng bỏ cuộc"],
                    after: ["Freelancer Software Dev", "Thu nhập tăng gấp 3 lần"]
                }
            ]
        }
    },
    {
        id: 'instructor-bio',
        name: 'Instructor Bio',
        category: 'Content',
        description: 'Profile section for the main instructor.',
        previewImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'instructor-bio',
            type: 'instructor-bio',
            name: 'Instructor Bio',
            title: 'Giảng Viên Của Bạn',
            subtitle: 'Người đồng hành cùng bạn trên con đường chinh phục Code',
            items: [
                {
                    title: "Trần Minh Tùng",
                    subtitle: "Senior Software Engineer",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
                    description: "10 năm kinh nghiệm phát triển phần mềm tại các startup công nghệ và tập đoàn lớn. Founder của Tulie Academy, đam mê chia sẻ kiến thức và truyền lửa cho thế hệ lập trình viên trẻ.",
                    features: ["Ex-Tech Lead @ Unicorn Startup", "5000+ Học viên theo học", "Top 1% Creator về Lập trình"]
                }
            ]
        }
    },
    {
        id: 'testimonials-carousel',
        name: 'Testimonials Carousel',
        category: 'Social Proof',
        description: 'Rotator for student reviews.',
        previewImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'testimonials-car',
            type: 'testimonials',
            name: 'Testimonials Carousel',
            title: 'Học Viên Nói Gì',
            subtitle: 'Câu chuyện thành công từ người thật việc thật',
            items: [
                { name: "Phạm Hùng", role: "Junior Dev @ FPT", content: "Khóa học thực sự thay đổi tư duy của mình. Không còn học vẹt mà hiểu sâu bản chất vấn đề.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                { name: "Lan Anh", role: "Freelancer", content: "Cách truyền đạt của anh Tùng rất dễ hiểu, support nhiệt tình. Mình đã nhận được job đầu tiên ngay khi chưa học xong.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                { name: "Tuấn Kiệt", role: "Sinh viên ĐHBK", content: "Nội dung update liên tục, sát thực tế. Rất đáng tiền!", avatar: "https://randomuser.me/api/portraits/men/86.jpg" }
            ]
        }
    },
    {
        id: 'sales-countdown',
        name: 'Sales Countdown',
        category: 'Conversion',
        description: 'Urgency timer with CTA.',
        previewImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'sales-count',
            type: 'sales-countdown',
            name: 'Sales Countdown',
            highlight: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            ctaText: "Nhận Ưu Đãi 50% Ngay",
            ctaLink: "/checkout"
        }
    },
    {
        id: 'bonus-section',
        name: 'Bonus Section',
        category: 'Conversion',
        description: 'Dark themed section highlighting extra value.',
        previewImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'bonus-sec',
            type: 'bonus',
            name: 'Bonus Section',
            title: 'Quà Tặng Độc Quyền',
            subtitle: 'Chỉ dành cho học viên đăng ký hôm nay',
            items: [
                {
                    title: "Bộ Ebook 'Roadmap to Senior'",
                    price: "Trị giá 500k",
                    description: "Cẩm nang định hướng sự nghiệp chi tiết từ Fresher lên Senior.",
                    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000",
                    features: ["Lộ trình thăng tiến", "Deal lương hiệu quả", "Kỹ năng mềm cần thiết"]
                }
            ]
        }
    },
    {
        id: 'faq-section',
        name: 'FAQ Section',
        category: 'Content',
        description: 'Frequently Asked Questions.',
        previewImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'faq-std',
            type: 'faq',
            name: 'FAQ Section',
            title: 'Câu Hỏi Thường Gặp',
            subtitle: 'Giải đáp thắc mắc của bạn',
            items: [
                { title: "Người mới bắt đầu có học được không?", content: "Hoàn toàn được. Khóa học thiết kế từ con số 0, đi từ cơ bản lên nâng cao." },
                { title: "Học xong có được cấp chứng chỉ không?", content: "Có. Bạn sẽ nhận được chứng chỉ hoàn thành sau khi nộp đủ bài tập cuối khóa." },
                { title: "Có được hỗ trợ sau khóa học không?", content: "Có. Bạn được tham gia cộng đồng Alumni và được hỗ trợ trọn đời." }
            ]
        }
    },
    {
        id: 'upsell-offer',
        name: 'Upsell Offer',
        category: 'Conversion',
        description: 'Special offer to upgrade.',
        previewImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'upsell-off',
            type: 'upsell',
            name: 'Upsell Offer',
            title: 'Nâng Cấp Gói VIP',
            subtitle: 'Nhận thêm đặc quyền Mentor 1:1',
            price: '499.000',
            oldPrice: '999.000',
            ctaText: 'Nâng Cấp Ngay',
            ctaLink: '/upgrade'
        }
    },
    {
        id: 'cta-standard',
        name: 'Standard CTA',
        category: 'Conversion',
        description: 'Simple Call to Action banner.',
        previewImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'cta-std',
            type: 'cta',
            name: 'Standard CTA',
            title: 'Đừng Chờ Đợi Cơ Hội',
            subtitle: 'Hãy bắt đầu hành trình thay đổi sự nghiệp của bạn ngay hôm nay.',
            ctaText: 'Tham Gia Ngay',
            ctaLink: '/checkout'
        }
    },
    {
        id: 'instructor-grid',
        name: 'Instructor Grid',
        category: 'Content',
        description: 'Modern grid of expert instructors with social links.',
        previewImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'instructor-grd',
            type: 'instructor-grid',
            name: 'Instructor Grid',
            title: 'Đội Ngũ Chuyên Gia',
            subtitle: 'Học hỏi trực tiếp từ những kỹ sư dày dặn kinh nghiệm thực chiến',
            items: [
                {
                    title: "Minh Tùng",
                    subtitle: "Founder & Lead Coach",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
                    description: "Software Architect với 12+ năm kinh nghiệm xây dựng hệ thống Core Banking và Startup Unicorn. Đã đào tạo trực tiếp hơn 5000+ học viên thành công."
                },
                {
                    title: "Nguyễn Hà",
                    subtitle: "Product Designer @ Grab",
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                    description: "Chuyên gia về Design System và Human-Centered Design. Giúp bạn tư duy thẩm mỹ và xây dựng trải nghiệm người dùng mượt mà vượt mong đợi."
                },
                {
                    title: "Lê Hoàng",
                    subtitle: "DevOps Engineer @ AWS",
                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
                    description: "Kiến trúc sư đám mây chuyên nghiệp. Người sẽ hướng dẫn bạn cách vận hành, deploy và tối ưu hóa ứng dụng trên hạ tầng quy mô hàng triệu người dùng."
                }
            ]
        }
    },
    {
        id: 'custom-html',
        name: 'Custom HTML',
        category: 'Special',
        description: 'Embed raw HTML code.',
        previewImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'custom-html-sec',
            type: 'custom-html',
            name: 'Custom HTML',
            html: '<div style="padding: 40px; background: #f8fafc; text-align: center; border-radius: 12px; border: 1px dashed #cbd5e1;"><h3 style="color: #0f172a; margin-bottom: 8px;">Khu Vực Custom HTML</h3><p style="color: #64748b;">Bạn có thể chèn bất kỳ mã HTML/CSS/JS nào vào đây.</p></div>'
        }
    },
    {
        id: 'payment-section',
        name: 'Payment Section',
        category: 'Conversion',
        description: 'Checkout form integration.',
        previewImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'payment-std',
            type: 'payment',
            name: 'Payment Section',
            title: 'Đăng Ký Khóa Học',
            subtitle: 'Hoàn tất đăng ký để bắt đầu học ngay.',
        }
    },
    {
        id: 'calendar-module',
        name: 'Calendar System',
        category: 'System',
        description: 'Full calendar module for events and schedule.',
        previewImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'calendar-sys',
            type: 'calendar',
            name: 'Calendar System',
            title: 'Sự kiện sắp tới',
            subtitle: 'Lịch trình các hoạt động trong tháng'
        }
    },
    {
        id: 'pricing-module',
        name: 'Pricing System',
        category: 'System',
        description: 'Complete pricing table with 3 monthly plans.',
        previewImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'pricing-sys',
            type: 'pricing',
            name: 'Pricing System',
            title: 'Các gói phổ biến',
            subtitle: 'Được nhiều thành viên lựa chọn',
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
        }
    },
    {
        id: 'video-standard',
        name: 'Standard Video',
        category: 'Special',
        description: 'Centered video player (YouTube/Vimeo/MP4) with custom aspect ratio.',
        previewImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'video-std',
            type: 'video',
            name: 'Standard Video',
            title: 'Khám Phá Tulie Academy',
            subtitle: 'Xem video hướng dẫn để hiểu rõ hơn về hệ thống học tập của chúng tôi.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            mediaAspectRatio: '16/9',
            animation: 'fade-up',
            showDotPattern: true
        }
    },
    {
        id: 'video-text-left',
        name: 'Video & Text (Left)',
        category: 'Special',
        description: 'Video on the left, descriptive text and features on the right.',
        previewImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'video-txt-l',
            type: 'video-text',
            name: 'Video & Text (Left)',
            title: 'Học Qua Thực Hành',
            subtitle: 'Phương pháp học tập hiện đại, trực quan.',
            content: 'Chúng tôi tin rằng cách tốt nhất để học lập trình là bắt tay vào xây dựng các sản phẩm thực tế ngay từ ngày đầu tiên.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            imagePosition: 'left',
            mediaAspectRatio: '16/9',
            items: [
                { title: 'Video bài giảng 4K', description: 'Hình ảnh sắc nét, dễ dàng theo dõi từng dòng code.' },
                { title: 'Tài liệu đi kèm', description: 'Mọi bài học đều có source code và slide chi tiết.' }
            ],
            animation: 'fade-up',
            ctaText: 'Xem Lộ Trình',
            ctaLink: '/courses'
        }
    },
    {
        id: 'gallery-grid',
        name: 'Media Gallery',
        category: 'Special',
        description: 'Responsive grid of images and videos with lightbox preview.',
        previewImage: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=500',
        data: {
            id: 'gallery-grd',
            type: 'gallery',
            name: 'Media Gallery',
            title: 'Khoảnh Khắc Tulie',
            subtitle: 'Hình ảnh và video hoạt động tại học viện.',
            items: [
                { title: 'Workshop Vibe Coding', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800', description: 'Buổi chia sẻ về tư duy lập trình mới.' },
                { title: 'Demo Sản Phẩm', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'Video giới thiệu dự án học viên.' },
                { title: 'Lớp Học Offline', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800', description: 'Không khí học tập sôi nổi tại văn phòng.' }
            ],
            appearance: 'glass',
            animation: 'fade-up'
        }
    }
];
