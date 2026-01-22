import { Section } from '@/types/sections';

export const DEFAULT_LANDING_PAGE_SECTIONS: Section[] = [
    {
        id: 'countdown-1',
        type: 'sales-countdown',
        title: 'Ưu đãi có hạn',
        subtitle: 'Đừng bỏ lỡ',
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
        id: 'stats-1',
        type: 'stats',
        title: 'Bạn có ý tưởng tuyệt vời... Nhưng',
        subtitle: 'Đây có vẻ quen không?',
        content: 'Bạn đang gặp khó khăn biến ý tưởng của mình thành hiện thực? Đừng lo, 90% người có ý tưởng đều gặp vấn đề tương tự.',
        items: [
            {
                title: '"Không biết code, làm sao build app?"',
                description: 'Học lập trình truyền thống mất 1-2 năm. Thuê developer thì chi phí cao, khó kiểm soát chất lượng. Bạn cảm thấy bế tắc.',
                icon: 'Lightbulb'
            },
            {
                title: '"Công cụ no-code hạn chế, nâng cấp phải trả phí cao"',
                description: 'Wix, Bubble... chỉ làm được landing page đơn giản. Muốn custom logic phức tạp? Xin lỗi, không hỗ trợ hoặc phí hàng trăm USD/tháng.',
                icon: 'Banknote'
            },
            {
                title: '"ChatGPT cho code, nhưng ghép lại thì... lỗi!"',
                description: 'AI viết code rời rạc, copy-paste vào không chạy. Không ai hướng dẫn cách tổ chức file, deploy, hay fix bug thực tế.',
                icon: 'Wrench'
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
                title: '1. Cách cũ',
                description: 'Học code 6 tháng → Làm dự án nhỏ → Mất hứng → Bỏ cuộc.',
                features: [
                    'Học syntax mệt mỏi',
                    'Dự án toy, không thực tế',
                    'Không biết bắt đầu từ đâu',
                    'Bế tắc khi gặp bug'
                ]
            },
            {
                title: '2. Vibe Coding',
                description: 'Có ý tưởng → Prompt AI → Review & tinh chỉnh → Ship sản phẩm thật.',
                price: 'Hiệu quả gấp 10 lần',
                features: [
                    'Bắt đầu từ vấn đề thực tế CỦA BẠN',
                    'AI code, bạn kiểm soát logic',
                    'Ship sản phẩm sau 2-4 tuần Khoá học',
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
                title: 'Cho Công ty / Doanh nghiệp',
                description: '- Hệ thống quản lý nhân sự\n- CRM, ERP mini\n- Dashboard theo dõi KPI\n- Công cụ tự động hóa workflow'
            },
            {
                title: 'Cho Freelancer / Startup',
                description: '- SaaS MVP\n- Landing page dynamic\n- Hệ thống booking\n- App quản lý khách hàng\n- Thanh toán online'
            },
            {
                title: 'Cho Sinh viên / Cá nhân',
                description: '- App học tập\n- Quản lý thời gian\n- Flashcard AI\n- Note-taking thông minh\n- Portfolio cá nhân'
            },
            {
                title: 'Cho Đam mê sáng tạo',
                description: '- Game web đơn giản\n- App entertainment\n- Social tools\n- Productivity apps\n- Blog cá nhân'
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
                title: 'Học viên',
                description: '10,000+',
                icon: 'GraduationCap'
            },
            {
                title: 'Khóa học',
                description: '500+',
                icon: 'MonitorPlay'
            },
            {
                title: 'Tỷ lệ hoàn thành',
                description: '94%',
                icon: 'Trophy'
            },
            {
                title: 'Đối tác',
                description: '200+',
                icon: 'Briefcase'
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
        subtitle: 'Không phải tutorial - Đây là app thật, user thật, giá trị thật',
        items: [
            {
                title: "TaskFlow - Quản lý công việc",
                student: "Nguyễn Minh Tuấn",
                description: "Ứng dụng quản lý task với drag-drop, real-time sync giữa các thành viên team.",
                image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
                tech: ["React", "Node.js", "Socket.io"]
            },
            {
                title: "FoodieApp - Đặt đồ ăn",
                student: "Trần Hoàng Anh",
                description: "Ứng dụng đặt đồ ăn với tích hợp thanh toán và theo dõi đơn hàng real-time.",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
                tech: ["React Native", "Firebase", "Stripe"]
            },
            {
                title: "LearnHub - LMS Platform",
                student: "Phạm Thị Lan",
                description: "Nền tảng học trực tuyến với video streaming, quiz và chứng chỉ tự động.",
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
                tech: ["Next.js", "PostgreSQL", "AWS"]
            },
            {
                title: "HealthTrack - Theo dõi sức khỏe",
                student: "Lê Văn Đức",
                description: "App theo dõi sức khỏe tích hợp AI để phân tích và đưa ra lời khuyên.",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
                tech: ["Flutter", "Python", "TensorFlow"]
            },
            {
                title: "FinTrack - Quản lý tài chính",
                student: "Trần Thu Hà",
                description: "Ứng dụng quản lý chi tiêu cá nhân, tích hợp import SMS ngân hàng tự động.",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
                tech: ["React Native", "NestJS", "MongoDB"]
            },
            {
                title: "TravelMate - Lên lịch trình du lịch",
                student: "Nguyễn Văn Hùng",
                description: "Nền tảng gợi ý lịch trình du lịch dựa trên sở thích và ngân sách sử dụng AI.",
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
                tech: ["Next.js", "OpenAI API", "Supabase"]
            }
        ]
    },
    {
        id: 'testimonials-2',
        type: 'testimonials',
        title: 'Thành viên đã làm được gì?',
        subtitle: 'Kết quả thực tế từ những người như bạn',
        items: [
            {
                name: "Tuấn Anh",
                role: "Khoá học: Đầu tư chứng khoán",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                before: [
                    "Chỉ tư vấn 1-1 tốn nhiều thời gian.",
                    "Không scale được số lượng khách hàng.",
                    "Thu nhập bị giới hạn bởi thời gian."
                ],
                after: [
                    "Đóng gói khóa học Basic bán tự động.",
                    "Tập trung tư vấn gói Premium giá cao.",
                    "Xây dựng kênh Youtube 100k sub."
                ]
            },
            {
                name: "Helen Hải",
                role: "Khoá học: Ma trận dịch vụ spa",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                content: "Chương trình đã thay đổi hoàn toàn tư duy kinh doanh của tôi.",
                before: [
                    "Tốn nhiều thời gian để dạy trực tiếp.",
                    "Dạy đi dạy lại một mảng kiến thức sinh ra nhàm chán.",
                    "Không ứng dụng marketing online nên số lượng học viên không đều."
                ],
                after: [
                    "Đạt doanh số trăm triệu ngay sau 1 tháng.",
                    "Xây dựng được cộng đồng và bán được gói tư vấn giá cao.",
                    "Giảm thời gian đào tạo và có thêm thời gian mở rộng kinh doanh."
                ]
            },
            {
                name: "Hoàng Lê Na",
                role: "Khoá học: Vận hành F&B",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                before: [
                    "Chưa có kinh nghiệm làm đào tạo.",
                    "Không có thương hiệu cá nhân.",
                    "Không quá giỏi về công nghệ, chỉ có kinh nghiệm chuyên môn F&B."
                ],
                after: [
                    "Tạo ra khoá học sau 1 tuần.",
                    "Đạt ~50 học viên mới trong vòng 15 ngày.",
                    "Xây dựng được Thương hiệu cá nhân qua khoá Elearning.",
                    "Gia tăng thêm nguồn thu ngoài việc kinh doanh chính."
                ]
            }
        ]
    },
    {
        id: 'history-1',
        type: 'history',
        title: 'Lịch sử đào tạo & sự kiện',
        subtitle: 'Hành trình lan tỏa giá trị đến cộng đồng',
        items: [
            {
                title: "Tháng 06/2023",
                description: "Ra mắt khoá học đầu tiên với 50 học viên.",
                type: "milestone"
            },
            {
                title: "Tháng 09/2023",
                description: "Tổ chức Khoá học Offline tại Hà Nội - 200+ tham dự.",
                image: "https://images.unsplash.com/photo-1544531696-361385ca9885?w=600&h=400&fit=crop",
                type: "event"
            },
            {
                title: "Tháng 12/2023",
                description: "Cán mốc 1000 học viên trên toàn hệ thống.",
                type: "milestone"
            },
            {
                title: "Tháng 03/2024",
                description: "Hợp tác chiến lược với 5 đối tác công nghệ lớn.",
                type: "milestone"
            },
            {
                title: "Tháng 06/2024",
                description: "Ra mắt nền tảng Tulie Academy 2.0 tích hợp AI.",
                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
                type: "event"
            },
            {
                title: "Hiện tại",
                description: "Tiếp tục mở rộng và phát triển không ngừng.",
                type: "milestone"
            }
        ]
    },
    {
        id: 'benefits-1',
        type: 'benefits',
        title: 'Đồng Hành & Cùng Phát Triển',
        subtitle: 'Từ nền tảng công nghệ học trực tuyến đến đối tác chiến lược marketing tăng trưởng kinh doanh'
    },
    {
        id: 'methods-1',
        type: 'coding-methods',
        title: '5 Loại Hình Vibe Coding',
        subtitle: 'Từ đơn giản đến phức tạp - Bạn chọn cách nào?',
        items: [
            {
                id: 'level-1',
                name: 'Ăn Liền',
                subtitle: 'One-shot Prompting',
                icon: 'Zap',
                color: 'from-neutral-400 to-neutral-600',
                complexity: 'Cực dễ',
                time: '15 - 30 phút',
                description: 'Làm cho vui, Demo ý tưởng nhanh chóng.',
                bestFor: 'Game đơn giản, Thiệp, Tool tính toán',
                example: 'Snake Game, Todo List cơ bản',
                stepsDetail: {
                    feasibility: { status: 'full', detail: 'Rất dễ' },
                    goal: { status: 'full', detail: 'Làm cho vui/Demo. Xem ý tưởng hình hài ra sao.' },
                    ai_usage: { status: 'full', detail: '"Đưa hết cho AI". Ra 1 lệnh dài, AI trả về 1 cục code. Hỏng thì tạo lại.' },
                    data: { status: 'simple', detail: 'Dữ liệu cứng (Fake). Tắt tab đi là mất hết.' },
                    limits: { status: 'simple', detail: 'Chỉ dùng tác vụ cơ bản, khó sửa sâu, chức năng đơn lẻ' },
                    output: { status: 'full', detail: 'Máy tính, Game đơn giản (Snake, Caro), Thiệp nhạc.' }
                }
            },
            {
                id: 'level-2',
                name: 'Tinh Chỉnh',
                subtitle: 'Iterative Prompting',
                icon: 'SlidersHorizontal',
                color: 'from-neutral-500 to-neutral-700',
                complexity: 'Dễ',
                time: '1 - 3 giờ',
                description: 'Làm cho đẹp, giao diện đúng ý.',
                bestFor: 'Landing Page, Portfolio, Dashboard',
                example: 'Web Portfolio cá nhân, Landing bán hàng',
                stepsDetail: {
                    feasibility: { status: 'full', detail: 'Dễ' },
                    goal: { status: 'full', detail: '"Làm cho đẹp". Giao diện đúng ý, đúng màu thương hiệu.' },
                    ai_usage: { status: 'full', detail: '"Vừa nhìn vừa sửa". Ra lệnh -> Xem -> Khoanh vùng bảo AI sửa lại.' },
                    data: { status: 'simple', detail: 'JSON giả. Nhìn như thật nhưng chưa lưu DB.' },
                    limits: { status: 'simple', detail: 'Đẹp nhưng "rỗng ruột". Chỉ có bề ngoài (Frontend).' },
                    output: { status: 'full', detail: 'Landing Page, Portfolio, Dashboard mẫu (UI Kit).' }
                }
            },
            {
                id: 'level-3',
                name: 'Logic Dữ Liệu',
                subtitle: 'Data Integration',
                icon: 'Database',
                color: 'from-stone-600 to-stone-800',
                complexity: 'Trung bình',
                time: '1 - 3 ngày',
                description: 'Làm cho chạy, lưu được dữ liệu.',
                bestFor: 'App Chat, Blog, CMS nhỏ',
                example: 'App Chat nội bộ, Blog cá nhân',
                stepsDetail: {
                    feasibility: { status: 'full', detail: 'Trung bình' },
                    goal: { status: 'full', detail: '"Làm cho chạy". Lưu được thông tin, tính toán đúng.' },
                    ai_usage: { status: 'full', detail: '"Ghép não cho AI". Viết hàm (API) nối Database (Supabase).' },
                    data: { status: 'full', detail: '"Database thật". Biết tạo bảng, quan hệ (Relation).' },
                    limits: { status: 'simple', detail: 'Có thể chạy sai logic nếu Prompt không chặt chẽ.' },
                    output: { status: 'full', detail: 'App To-Do, App Chat nội bộ, Blog cá nhân, CMS nhỏ.' }
                }
            },
            {
                id: 'level-4',
                name: 'Kiến Trúc Sư',
                subtitle: 'Modular Coding',
                icon: 'Workflow',
                color: 'from-gray-700 to-gray-900',
                complexity: 'Khó',
                time: '1 - 2 tuần',
                description: 'Làm cho gọn, dễ nâng cấp.',
                bestFor: 'SaaS nhỏ, CRM, Booking',
                example: 'Hệ thống CRM, Công cụ quản lý',
                stepsDetail: {
                    feasibility: { status: 'simple', detail: 'Khó (Cần kỹ năng chia nhỏ)' },
                    goal: { status: 'full', detail: '"Làm cho gọn". Code dễ sửa, dễ nâng cấp về sau.' },
                    ai_usage: { status: 'full', detail: '"Quản lý nhân sự AI". Chia file rõ ràng, không code cục bộ.' },
                    data: { status: 'full', detail: '"Luồng dữ liệu (Flow)". Kiểm soát input/output chặt chẽ.' },
                    limits: { status: 'simple', detail: 'Đòi hỏi người dùng phải hiểu cấu trúc file code.' },
                    output: { status: 'full', detail: 'Hệ thống SaaS nhỏ, CRM, Web đặt lịch.' }
                }
            },
            {
                id: 'level-5',
                name: 'Sản Phẩm Thực',
                subtitle: 'MVP Launch',
                icon: 'Rocket',
                color: 'from-black to-neutral-800',
                complexity: 'Rất khó',
                time: '2 - 4 tuần',
                description: 'Làm để bán, chạy ổn định.',
                bestFor: 'Startup, Sàn TMĐT, App học tập',
                example: 'Sàn TMĐT, Mạng xã hội',
                stepsDetail: {
                    feasibility: { status: 'simple', detail: 'Rất khó (Cần tư duy Product)' },
                    goal: { status: 'full', detail: '"Làm để bán/Dùng thật". Ổn định, ít lỗi, có user.' },
                    ai_usage: { status: 'full', detail: '"Tổng công trình sư". Code + Test + Security + SEO.' },
                    data: { status: 'full', detail: '"Bảo vệ dữ liệu". Phân quyền, Backup, Security.' },
                    limits: { status: 'simple', detail: 'Cần kiến thức Deploy, Domain, Server.' },
                    output: { status: 'full', detail: 'Startup: Sàn TMĐT ngách, App học tập, MXH nội bộ.' }
                }
            }
        ]
    },
    {
        id: 'upsell-1',
        type: 'upsell',
        title: 'Nâng cấp trải nghiệm',
        subtitle: 'Các gói Combo tiết kiệm hơn cho bạn',
        items: [
            {
                id: 'combo-starter',
                title: 'Combo Newbie',
                price: '999k',
                originalPrice: '1.500k',
                description: 'Khoá học Vibe Coding + Template Landing Page Premium',
                tag: 'Save 30%',
                icon: 'Gift',
                color: 'from-pink-500 to-rose-500',
                features: ['Truy cập trọn đời', 'Source code mẫu', 'Hỗ trợ 1-1 30 ngày'],
                link: '/checkout/combo-newbie'
            },
            {
                id: 'combo-pro',
                title: 'Combo Career',
                price: '2.499k',
                originalPrice: '4.000k',
                description: 'Full lộ trình Vibe Coding + Mentoring 1:1 + Review CV',
                tag: 'Best Value',
                icon: 'Crown',
                color: 'from-amber-400 to-orange-500',
                features: ['Tất cả quyền lợi Newbie', 'Review Code trực tiếp', 'Tư vấn phỏng vấn'],
                link: '/checkout/combo-pro'
            }
        ]
    },
    {
        id: 'payment-1',
        type: 'payment',
        title: 'Thanh toán',
        subtitle: 'Bảo mật - Nhanh chóng - Tự động kích hoạt',
        image: '' // Để trống sẽ hiện icon fallback
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



export const DEFAULT_HOME_SECTIONS: Section[] = [
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
        id: 'stats-1',
        type: 'stats',
        title: 'Bạn có ý tưởng tuyệt vời... Nhưng',
        subtitle: 'Đây có vẻ quen không?',
        content: 'Bạn đang gặp khó khăn biến ý tưởng của mình thành hiện thực? Đừng lo, 90% người có ý tưởng đều gặp vấn đề tương tự.',
        items: [
            {
                title: '"Không biết code, làm sao build app?"',
                description: 'Học lập trình truyền thống mất 1-2 năm. Thuê developer thì chi phí cao, khó kiểm soát chất lượng. Bạn cảm thấy bế tắc.',
                icon: 'Lightbulb'
            },
            {
                title: '"Công cụ no-code hạn chế, nâng cấp phải trả phí cao"',
                description: 'Wix, Bubble... chỉ làm được landing page đơn giản. Muốn custom logic phức tạp? Xin lỗi, không hỗ trợ hoặc phí hàng trăm USD/tháng.',
                icon: 'Banknote'
            },
            {
                title: '"ChatGPT cho code, nhưng ghép lại thì... lỗi!"',
                description: 'AI viết code rời rạc, copy-paste vào không chạy. Không ai hướng dẫn cách tổ chức file, deploy, hay fix bug thực tế.',
                icon: 'Wrench'
            }
        ]
    },
    {
        id: 'pillars',
        type: 'benefits',
        title: '3 Lĩnh Vực Cốt Lõi',
        subtitle: 'Hệ sinh thái giải pháp toàn diện cho kỷ nguyên số',
        items: [
            {
                title: 'Vibe Coding',
                description: 'Phương pháp lập trình sáng tạo, tập trung vào trải nghiệm và trạng thái dòng chảy (Flow State). Biến code thành nghệ thuật.',
                icon: 'Code',
                href: '/applications/vibe-coding'
            },
            {
                title: 'Ứng dụng AI',
                description: 'Làm chủ các công cụ AI hàng đầu (ChatGPT, Midjourney...) để tối ưu hiệu suất và tự động hóa công việc.',
                icon: 'Bot',
                href: '/applications/ai'
            },
            {
                title: 'Google Sheets Automation',
                description: 'Xây dựng hệ thống quản trị, CRM, ERP tinh gọn trên nền tảng Google Sheets và Apps Script.',
                icon: 'Table',
                href: '/applications/google-sheets'
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
                title: '1. Cách cũ',
                description: 'Học code 6 tháng → Làm dự án nhỏ → Mất hứng → Bỏ cuộc.',
                features: [
                    'Học syntax mệt mỏi',
                    'Dự án toy, không thực tế',
                    'Không biết bắt đầu từ đâu',
                    'Bế tắc khi gặp bug'
                ]
            },
            {
                title: '2. Vibe Coding',
                description: 'Có ý tưởng → Prompt AI → Review & tinh chỉnh → Ship sản phẩm thật.',
                price: 'Hiệu quả gấp 10 lần',
                features: [
                    'Bắt đầu từ vấn đề thực tế CỦA BẠN',
                    'AI code, bạn kiểm soát logic',
                    'Ship sản phẩm sau 2-4 tuần Khoá học',
                    'Có Consultant hỗ trợ xuyên suốt'
                ]
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
                description: 'Từ MVP startup đến hệ thống enterprise phục vụ hàng nghìn users.',
                icon: 'Briefcase'
            },
            {
                title: 'Tech Lead tại các công ty lớn',
                description: 'Kinh nghiệm làm việc và quản lý team tại FPT, VNG, các startup triệu USD.',
                icon: 'Terminal'
            },
            {
                title: 'Đã tư vấn cho 1000+ Member',
                description: 'Hiểu rõ điểm nghẽn của người mới, tối ưu lộ trình thực hành hiệu quả.',
                icon: 'Users'
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
        id: 'cta-1',
        type: 'cta',
        title: 'Bắt đầu xây dựng app của bạn ngay hôm nay',
        subtitle: 'Đăng ký tham dự Khoá học miễn phí. Trải nghiệm 7 ngày. Không cần thẻ tín dụng.',
        ctaText: 'Đăng ký miễn phí',
        ctaLink: '/register'
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
        content: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và tư vấn giải pháp công nghệ, tôi tin rằng...'
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
        ctaLink: '/careers'
    }
];

export const DEFAULT_PRICING_SECTIONS: Section[] = [
    {
        id: 'hero-pricing',
        type: 'hero',
        title: 'Bảng giá Template & Gói thành viên',
        subtitle: 'Giải pháp tối ưu cho công việc của bạn. Chọn gói thành viên để tiếp cận kho Template Google Sheets chất lượng cao.',
        ctaText: 'Tư vấn gói giải pháp',
        ctaLink: '/contact',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
    },
    {
        id: 'pricing-plans',
        type: 'pricing',
        title: 'Chọn gói phù hợp với nhu cầu',
        subtitle: 'Tiết kiệm thời gian xây dựng hệ thống quản lý với các Template chuyên nghiệp.',
        items: [
            {
                title: 'Gói Cơ Bản',
                price: '1.990k/năm',
                topBadge: 'Khuyên dùng',
                originalPrice: '3.500k',
                description: 'Truy cập và tải xuống KHÔNG GIỚI HẠN toàn bộ kho Template Google Sheets & Apps Script.',
                tag: 'Phổ biến',
                icon: 'Zap',
                ctaText: 'Đăng ký gói Cơ bản',
                link: '/checkout/pro-template',
                features: [
                    'Tải xuống Unlimited Template',
                    'Truy cập Template Premium mới nhất',
                    'Tiết kiệm >90% chi phí mua lẻ',
                    'Cập nhật mẫu mới hàng tuần',
                    'Hỗ trợ kỹ thuật qua Group'
                ]
            },
            {
                title: 'Gói Premium',
                price: '7.990k/năm',
                originalPrice: '15.000k',
                description: 'Giải pháp thiết kế riêng và hỗ trợ kỹ thuật 1:1 cho Doanh nghiệp/Cá nhân chuyên nghiệp.',
                tag: 'VIP Support',
                icon: 'Crown',
                ctaText: 'Liên hệ tư vấn',
                link: '/contact',
                features: [
                    'Tất cả quyền lợi Gói Cơ Bản',
                    'Thiết kế Custom Template (theo yêu cầu)',
                    'Support 1:1 qua Zoom/UltraViewer',
                    'Setup hệ thống Automation riêng',
                    'Tư vấn quy trình vận hành tối ưu',
                    'Ưu tiên hỗ trợ 24/7'
                ]
            }
        ]
    },
    {
        id: 'faq-pricing',
        type: 'faq',
        title: 'Câu hỏi thường gặp',
        subtitle: 'Thắc mắc về gói thành viên Template'
    }
];
