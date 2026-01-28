-- 1. Chuyển đổi các cột Enum sang TEXT để tương thích với Prisma Schema String
-- Bảng Product: type
DO $$ BEGIN
    ALTER TABLE "Product" ALTER COLUMN "type" DROP DEFAULT;
    -- Dùng cast sang TEXT để tránh lỗi type mismatch
    ALTER TABLE "Product" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;
    ALTER TABLE "Product" ALTER COLUMN "type" SET DEFAULT 'TEMPLATE';
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping Product.type conversion';
END $$;

-- Bảng Product: field
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='field') THEN
        ALTER TABLE "Product" ALTER COLUMN "field" DROP DEFAULT;
        ALTER TABLE "Product" ALTER COLUMN "field" TYPE TEXT USING "field"::TEXT;
        ALTER TABLE "Product" ALTER COLUMN "field" SET DEFAULT 'OTHER';
    ELSE
        ALTER TABLE "Product" ADD COLUMN "field" TEXT NOT NULL DEFAULT 'OTHER';
    END IF;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping Product.field conversion';
END $$;

-- Bảng Product: deploymentStatus
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='deploymentStatus') THEN
        ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" DROP DEFAULT;
        ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" TYPE TEXT USING "deploymentStatus"::TEXT;
        ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" SET DEFAULT 'RELEASED';
    ELSE
        ALTER TABLE "Product" ADD COLUMN "deploymentStatus" TEXT NOT NULL DEFAULT 'RELEASED';
    END IF;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping Product.deploymentStatus conversion';
END $$;

-- 2. Fix ProductClassification
CREATE TABLE IF NOT EXISTS "ProductClassification" (
    "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()::TEXT),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảo đảm có default cho updatedAt
ALTER TABLE "ProductClassification" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
-- Cập nhật các dòng cũ nếu bị NULL (để tránh lỗi Not Null constraint)
UPDATE "ProductClassification" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- 3. Tạo các bảng Upsell
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

CREATE UNIQUE INDEX IF NOT EXISTS "ProductUpsell_productId_upsellProductId_key" ON "ProductUpsell"("productId", "upsellProductId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductCourseUpsell_productId_upsellCourseId_key" ON "ProductCourseUpsell"("productId", "upsellCourseId");

-- 4. Seed dữ liệu Combo
INSERT INTO "ProductClassification" (id, name, type, "updatedAt")
VALUES (gen_random_uuid()::TEXT, 'Combo', 'PRODUCT_TYPE', CURRENT_TIMESTAMP)
ON CONFLICT (name, type) DO NOTHING;
