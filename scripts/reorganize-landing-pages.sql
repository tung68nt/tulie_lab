-- =========================================
-- SQL Script: Reorganize Landing Pages & Create Vibe Coding Sales Page
-- =========================================

-- Step 1: Chuyển các trang thông tin navbar sang type SYSTEM
-- Các trang này hiển thị trên menu bar, là trang thông tin hệ thống
UPDATE "LandingPage" 
SET "type" = 'SYSTEM'
WHERE "slug" IN ('calendar', 'pricing', 'google-sheets', 'ai', 'vibe-coding');

-- Step 2: Xác nhận đã chuyển thành công
SELECT "title", "slug", "type" FROM "LandingPage" ORDER BY "type", "title";

-- Step 3: Tìm ID của khóa học Vibe Coding để liên kết
-- (Chạy riêng query này để lấy courseId)
-- SELECT "id", "title", "price" FROM "Course" WHERE "slug" = 'vibe-coding-ai-app';

-- Step 4: Tạo Landing Page mới cho khóa học Vibe Coding
-- NOTE: Thay '{{COURSE_ID}}' bằng ID thực của khóa học Vibe Coding
INSERT INTO "LandingPage" (
    "id",
    "title", 
    "slug", 
    "description",
    "sections",
    "isActive",
    "courseId",
    "type",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'Vibe Coding Cho Người Mới Bắt Đầu - Khóa Học Lập Trình Cùng AI',
    'vibe-coding-nguoi-moi',
    'Học cách sử dụng AI để lập trình nhanh gấp 10 lần. Phù hợp cho người mới hoàn toàn chưa biết code.',
    '[
        {
            "id": "hero-vibe-1",
            "type": "hero",
            "title": "Vibe Coding Cho Người Mới Bắt Đầu",
            "subtitle": "Học lập trình cùng AI - Nhanh gấp 10 lần phương pháp truyền thống. Không cần kinh nghiệm trước đó.",
            "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
            "ctaText": "Đăng Ký Ngay - 1.790.000đ",
            "ctaLink": "/checkout?course=vibe-coding-nguoi-moi",
            "isVisible": true
        },
        {
            "id": "stats-vibe-1",
            "type": "stats",
            "title": "Kết Quả Thực Tế",
            "subtitle": "Những con số nói lên tất cả",
            "items": [
                { "value": "500+", "label": "Học viên", "description": "Đã hoàn thành khóa học" },
                { "value": "10x", "label": "Nhanh hơn", "description": "So với học truyền thống" },
                { "value": "95%", "label": "Hài lòng", "description": "Đánh giá 5 sao" },
                { "value": "24/7", "label": "Hỗ trợ", "description": "Group Discord riêng" }
            ],
            "isVisible": true
        },
        {
            "id": "features-vibe-1",
            "type": "features",
            "title": "Bạn Sẽ Học Được Gì?",
            "subtitle": "Nội dung khóa học toàn diện",
            "items": [
                { "title": "Vibe Coding Methodology", "description": "Phương pháp lập trình mới cùng AI - làm việc thông minh hơn, không phải chăm chỉ hơn.", "icon": "Zap" },
                { "title": "Cursor AI Editor", "description": "Làm chủ công cụ AI mạnh nhất cho developers. Code nhanh, debug thông minh.", "icon": "Code" },
                { "title": "GitHub Copilot", "description": "Tận dụng AI pair programmer để viết code chất lượng cao.", "icon": "Bot" },
                { "title": "Build MVP trong 24h", "description": "Xây dựng sản phẩm hoàn chỉnh chỉ trong 1 ngày với sự hỗ trợ của AI.", "icon": "Rocket" },
                { "title": "Prompt Engineering", "description": "Nghệ thuật giao tiếp với AI để nhận được kết quả tốt nhất.", "icon": "MessageSquare" },
                { "title": "AI-Assisted Debug", "description": "Sử dụng AI để tìm và sửa lỗi nhanh chóng.", "icon": "Bug" }
            ],
            "isVisible": true
        },
        {
            "id": "testimonials-vibe-1",
            "type": "testimonials",
            "title": "Học Viên Nói Gì?",
            "subtitle": "Câu chuyện thành công thực tế",
            "items": [
                { "name": "Minh Quân", "role": "Ex-Designer → Developer", "content": "Trước kia tôi chỉ biết làm UI/UX, giờ đã có thể tự code và ship sản phẩm riêng. Vibe Coding thực sự thay đổi cách tôi nhìn nhận về lập trình.", "avatar": "https://randomuser.me/api/portraits/men/32.jpg" },
                { "name": "Thuỳ Linh", "role": "Marketing → Fullstack", "content": "Không nghĩ mình có thể học code ở tuổi 30. Nhưng với AI hỗ trợ, mọi thứ dễ dàng hơn nhiều.", "avatar": "https://randomuser.me/api/portraits/women/44.jpg" },
                { "name": "Tuấn Anh", "role": "Sinh viên năm 2", "content": "Khóa học giúp tôi đi tắt đón đầu. Bạn bè cùng lớp còn học Java cơ bản, tôi đã build được SaaS app.", "avatar": "https://randomuser.me/api/portraits/men/86.jpg" }
            ],
            "isVisible": true
        },
        {
            "id": "cta-vibe-1",
            "type": "cta",
            "title": "Bắt Đầu Hành Trình Lập Trình Của Bạn",
            "subtitle": "Đăng ký ngay hôm nay với mức giá ưu đãi chỉ 1.790.000đ",
            "ctaText": "Đăng Ký Ngay",
            "ctaLink": "/checkout?course=vibe-coding-nguoi-moi",
            "isVisible": true
        }
    ]',
    true,
    NULL,
    'LANDING',
    NOW(),
    NOW()
);

-- Xác nhận kết quả
SELECT "title", "slug", "type" FROM "LandingPage" ORDER BY "type", "title";
