-- 1. Chuyển đổi các cột Enum sang TEXT để tương thích với String
DO $$ BEGIN
    ALTER TABLE "Product" ALTER COLUMN "type" DROP DEFAULT;
    ALTER TABLE "Product" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;
    ALTER TABLE "Product" ALTER COLUMN "type" SET DEFAULT 'TEMPLATE';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipping type change'; END $$;

-- 2. Thêm các cột thiếu và bảng mới
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "field" TEXT NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "detailedContent" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gallery" JSONB;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "membershipAccess" TEXT NOT NULL DEFAULT 'ALL';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "deploymentStatus" TEXT NOT NULL DEFAULT 'RELEASED';

CREATE TABLE IF NOT EXISTS "ProductClassification" (
    "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()::TEXT),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Đảm bảo có default cho updatedAt nếu bảng đã tồn tại
ALTER TABLE "ProductClassification" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS "ProductUpsell" (
    "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()::TEXT),
    "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "upsellProductId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ProductCourseUpsell" (
    "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()::TEXT),
    "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "upsellCourseId" TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed dữ liệu "Combo"
INSERT INTO "ProductClassification" (id, name, type, "updatedAt")
VALUES (gen_random_uuid()::TEXT, 'Combo', 'PRODUCT_TYPE', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
