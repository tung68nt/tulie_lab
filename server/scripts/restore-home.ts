import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_HOME_SECTIONS = [
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
                    ai_usage: { detail: '\"Đưa hết cho AI\". Ra 1 lệnh dài, AI trả về 1 cục code. Hỏng thì tạo lại cái mới.', status: "ok" },
                    data: { detail: "Dữ liệu cứng (Fake). Tất cả tab đi là mất hết.", status: "ok" },
                    limits: { detail: 'Chỉ dùng được 1 lần, khó sửa đổi sâu. App \"chết\" (tĩnh).', status: "warn" },
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
                    ai_usage: { detail: '\"Vừa nhìn vừa sửa\". Ra lệnh -> Xem kết quả -> Khoanh vùng chỗ sai bảo AI sửa lại (In-painting/Edit).', status: "ok" },
                    data: { detail: "Dữ liệu giả định dạng JSON. Nhìn như thật nhưng chưa lưu.", status: "ok" },
                    limits: { detail: 'Đẹp nhưng \"rỗng ruột\". Chỉ có bề ngoài (Frontend).', status: "warn" },
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
                    ai_usage: { detail: '\"Ghép não cho AI\". Yêu cầu AI viết các hàm xử lý (API) để nối với Database (Supabase/Firebase).', status: "ok" },
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
                    ai_usage: { detail: '\"Quản lý nhân sự AI\". Bảo AI: \"Tạo file A làm việc này, file B làm việc kia\". Không code chung 1 file.', status: "ok" },
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
                    ai_usage: { detail: '\"Tổng công trình sư\". Dùng AI để: Viết code + Viết test + Scan lỗi bảo mật + Tối ưu SEO.', status: "ok" },
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
    }
];

async function main() {
    console.log('Restoring home landing page...');

    const slug = 'home';
    const title = 'Vibe Coding: Lập trình bằng AI - Kỹ năng bắt buộc năm 2026';
    const sections = JSON.stringify(DEFAULT_HOME_SECTIONS);

    const existing = await prisma.landingPage.findUnique({
        where: { slug }
    });

    if (existing) {
        await prisma.landingPage.update({
            where: { slug },
            data: {
                title,
                sections,
                isActive: true
            }
        });
        console.log('Updated existing home page');
    } else {
        await prisma.landingPage.create({
            data: {
                slug,
                title,
                sections,
                isActive: true,
                type: 'LANDING'
            }
        });
        console.log('Created new home page');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
