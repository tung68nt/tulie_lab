-- Restore Home Page as a System Page
-- This ensures 'Trang chủ' appears in the Admin > System Pages list

INSERT INTO "LandingPage" (
    "id",
    "title",
    "slug",
    "description",
    "type",
    "isActive",
    "sections",
    "createdAt",
    "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'Trang chủ',
    '',
    'Trang chủ hệ thống Academy Tulie',
    'SYSTEM',
    true,
    '[]', -- Initialize with empty sections, or you could copy defaults if available
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "LandingPage" WHERE "slug" = ''
);

-- Ensure all other system pages are correctly typed
UPDATE "LandingPage" SET "type" = 'SYSTEM' WHERE "slug" IN ('/about', '/instructors', '/calendar', '/pricing', '/google-sheets', '/ai', '/vibe-coding', '/shop');
