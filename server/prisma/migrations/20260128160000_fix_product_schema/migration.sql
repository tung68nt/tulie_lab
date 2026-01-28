-- 1. Chuyển đổi các cột Enum sang TEXT để tương thích với Prisma Schema String
-- Bảng Product: Chuyển type từ Enum sang TEXT
DO $$ BEGIN
    ALTER TABLE "Product" ALTER COLUMN "type" DROP DEFAULT;
    ALTER TABLE "Product" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;
    ALTER TABLE "Product" ALTER COLUMN "type" SET DEFAULT 'TEMPLATE';
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Column type might already be TEXT or not exist yet';
END $$;

-- Bảng Product: Chuyển field từ Enum sang TEXT (nếu đã lỡ tạo là Enum)
DO $$ BEGIN
    ALTER TABLE "Product" ALTER COLUMN "field" DROP DEFAULT;
    ALTER TABLE "Product" ALTER COLUMN "field" TYPE TEXT USING "field"::TEXT;
    ALTER TABLE "Product" ALTER COLUMN "field" SET DEFAULT 'OTHER';
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Column field might already be TEXT or not exist yet';
END $$;

-- Bảng Product: Chuyển deploymentStatus
DO $$ BEGIN
    ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" DROP DEFAULT;
    ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" TYPE TEXT USING "deploymentStatus"::TEXT;
    ALTER TABLE "Product" ALTER COLUMN "deploymentStatus" SET DEFAULT 'RELEASED';
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Column deploymentStatus might already be TEXT or not exist yet';
END $$;

-- 2. Thêm các cột thiếu vào bảng Product (nếu chưa có)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "field" TEXT NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "detailedContent" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gallery" JSONB;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "membershipAccess" TEXT NOT NULL DEFAULT 'ALL';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "deploymentStatus" TEXT NOT NULL DEFAULT 'RELEASED';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "campaignId" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "saleStartDate" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "saleEndDate" TIMESTAMP(3);

-- 3. Tạo bảng ProductClassification
DO $$ BEGIN
    CREATE TYPE "ClassificationType" AS ENUM ('PRODUCT_TYPE', 'PRODUCT_FIELD');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "ProductClassification" (
    "id" TEXT PRIMARY KEY DEFAULT (gen_random_uuid()::TEXT),
    "name" TEXT NOT NULL,
    "type" "ClassificationType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProductClassification_name_type_key" ON "ProductClassification"("name", "type");

-- 4. Tạo các bảng Upsell
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

-- 5. Seed dữ liệu mặc định cho ProductClassification
INSERT INTO "ProductClassification" (id, name, type, "isActive")
VALUES 
    (gen_random_uuid()::TEXT, 'Template', 'PRODUCT_TYPE', true),
    (gen_random_uuid()::TEXT, 'App', 'PRODUCT_TYPE', true),
    (gen_random_uuid()::TEXT, 'License', 'PRODUCT_TYPE', true),
    (gen_random_uuid()::TEXT, 'Subscription', 'PRODUCT_TYPE', true),
    (gen_random_uuid()::TEXT, 'Combo', 'PRODUCT_TYPE', true)
ON CONFLICT ("name", "type") DO NOTHING;
