-- Seed Landing Pages
-- Inserts the 3 main landing pages: google-sheets, ai, vibe-coding

-- Delete old/obsolete pages if exist
DELETE FROM "LandingPage" WHERE slug IN ('mau-day-du-tinh-nang', 'gioi-thieu', 'introduction');

-- Upsert Google Sheets page
INSERT INTO "LandingPage" (id, slug, title, description, "isActive", sections, "createdAt", "updatedAt")
VALUES (
    'google-sheets-page',
    'google-sheets',
    'Google Sheets & Apps Script',
    'Tự động hóa công việc với Google Ecosystem.',
    true,
    '[
        {
            "id": "sheets-hero",
            "type": "hero",
            "title": "Google Sheets & Apps Script",
            "subtitle": "Tự động hóa & Quản trị dữ liệu",
            "content": "Biến bảng tính đơn giản thành hệ thống quản trị mạnh mẽ. Học cách viết script, tạo báo cáo tự động và kết nối dữ liệu chuyên nghiệp.",
            "image": "/images/heroes/google-sheets.png",
            "buttons": [
                {"label": "Khám phá Template", "href": "/shop", "variant": "primary"},
                {"label": "Học Apps Script", "href": "/courses", "variant": "outline"}
            ],
            "isVisible": true,
            "order": 1
        },
        {
            "id": "sheets-cta",
            "type": "cta",
            "title": "Tối ưu hóa doanh nghiệp của bạn",
            "subtitle": "Sỡ hữu bộ công cụ quản trị tinh gọn ngay hôm nay",
            "buttons": [
                {"label": "Ghé thăm cửa hàng", "href": "/shop", "variant": "primary"}
            ],
            "isVisible": true,
            "order": 4
        }
    ]'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- Upsert AI page
INSERT INTO "LandingPage" (id, slug, title, description, "isActive", sections, "createdAt", "updatedAt")
VALUES (
    'ai-page',
    'ai',
    'Ứng dụng AI',
    'Giải pháp AI thực chiến cho công việc.',
    true,
    '[
        {
            "id": "ai-hero",
            "type": "hero",
            "title": "Ứng dụng AI Thực Chiến",
            "subtitle": "Tăng tốc độ làm việc gấp 10 lần",
            "content": "Tận dụng sức mạnh của trí tuệ nhân tạo để tự động hóa công việc, sáng tạo nội dung và giải quyết vấn đề phức tạp chỉ trong tích tắc.",
            "image": "/images/heroes/ai-apps.png",
            "buttons": [
                {"label": "Tìm hiểu khóa học", "href": "/courses", "variant": "primary"},
                {"label": "Công cụ AI", "href": "#tools", "variant": "outline"}
            ],
            "isVisible": true,
            "order": 1
        },
        {
            "id": "ai-cta",
            "type": "cta",
            "title": "Làm chủ công nghệ AI",
            "subtitle": "Đừng để bị bỏ lại phía sau trong cuộc cách mạng này",
            "buttons": [
                {"label": "Xem khoá học AI", "href": "/courses", "variant": "primary"}
            ],
            "isVisible": true,
            "order": 4
        }
    ]'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- Upsert Vibe Coding page
INSERT INTO "LandingPage" (id, slug, title, description, "isActive", sections, "createdAt", "updatedAt")
VALUES (
    'vibe-coding-page',
    'vibe-coding',
    'Vibe Coding',
    'Phong cách lập trình hiện đại, sáng tạo.',
    true,
    '[
        {
            "id": "vibe-hero",
            "type": "hero",
            "title": "Vibe Coding",
            "subtitle": "Khơi nguồn cảm hứng - Sáng tạo không giới hạn",
            "content": "Trải nghiệm phong cách lập trình mới mẻ, nơi code không chỉ là những dòng lệnh khô khan mà là một tác phẩm nghệ thuật đầy cảm hứng.",
            "image": "/images/heroes/vibe-coding.png",
            "buttons": [
                {"label": "Khám phá ngay", "href": "/courses", "variant": "primary"},
                {"label": "Xem demo", "href": "#demo", "variant": "outline"}
            ],
            "isVisible": true,
            "order": 1
        },
        {
            "id": "vibe-cta",
            "type": "cta",
            "title": "Bắt đầu hành trình Vibe Coding",
            "subtitle": "Tham gia cộng đồng những lập trình viên nghệ sĩ ngay hôm nay",
            "buttons": [
                {"label": "Đăng ký khoá học", "href": "/courses", "variant": "primary"}
            ],
            "isVisible": true,
            "order": 4
        }
    ]'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- Verify
SELECT slug, title, "isActive",
       CASE WHEN sections IS NOT NULL THEN '✅ HAS DATA' ELSE '❌ NO DATA' END as sections_status
FROM "LandingPage"
WHERE slug IN ('google-sheets', 'ai', 'vibe-coding')
ORDER BY slug;

SELECT '🎉 Landing Pages Seeded!' as message;
