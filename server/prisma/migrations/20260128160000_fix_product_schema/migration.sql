-- MASTER DB FIX V2 - CHẠY TRÊN SUPABASE SQL EDITOR
-- LỆNH NÀY SẼ CHUYỂN ĐỔI KIỂU DỮ LIỆU CŨ SANG STRING ĐỂ FIX LỖI "INCOMPATIBLE VALUE"

-- 1. CHUYỂN ĐỔI BẢNG PRODUCT
DO $$ BEGIN
    -- Chuyển type từ Enum sang TEXT
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='type') THEN
        ALTER TABLE "Product" ALTER COLUMN "type" DROP DEFAULT;
        ALTER TABLE "Product" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;
        ALTER TABLE "Product" ALTER COLUMN "type" SET DEFAULT 'TEMPLATE';
    END IF;

    -- Chuyển field từ Enum sang TEXT (nếu có)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='field') THEN
        ALTER TABLE "Product" ALTER COLUMN "field" DROP DEFAULT;
        ALTER TABLE "Product" ALTER COLUMN "field" TYPE TEXT USING "field"::TEXT;
        ALTER TABLE "Product" ALTER COLUMN "field" SET DEFAULT 'OTHER';
    END IF;

    -- Chuyển deploymentStatus
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='deploymentStatus') THEN
        ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" DROP DEFAULT;
        ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" TYPE TEXT USING "deploymentStatus"::TEXT;
        ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" SET DEFAULT 'RELEASED';
    END IF;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Error in Product conversion: %', SQLERRM;
END $$;

-- 2. ĐẢM BẢO CÁC CỘT MỚI TỒN TẠI
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "field" TEXT NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "detailedContent" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gallery" JSONB;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "membershipAccess" TEXT NOT NULL DEFAULT 'ALL';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "deploymentStatus" TEXT NOT NULL DEFAULT 'RELEASED';

-- 3. FIX BẢNG PRODUCTCLASSIFICATION
CREATE TABLE IF NOT EXISTS "ProductClassification" (
    "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()::TEXT),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Fix default cho updatedAt nếu bảng đã có sẵn
ALTER TABLE "ProductClassification" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "ProductClassification" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- 4. TẠO CÁC BẢNG BỔ TRỢ
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

-- 5. SEED DỮ LIỆU
INSERT INTO "ProductClassification" (id, name, type, "updatedAt")
VALUES (gen_random_uuid()::TEXT, 'Combo', 'PRODUCT_TYPE', CURRENT_TIMESTAMP)
ON CONFLICT (name, type) DO NOTHING;
