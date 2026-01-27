-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "field" TEXT NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "detailedContent" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gallery" JSONB;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "membershipAccess" TEXT NOT NULL DEFAULT 'ALL';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "deploymentStatus" TEXT NOT NULL DEFAULT 'RELEASED';

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductUpsell" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "upsellProductId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductUpsell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductCourseUpsell" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "upsellCourseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCourseUpsell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseUpsell" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "upsellCourseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseUpsell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseProductUpsell" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "upsellProductId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseProductUpsell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProductUpsell_productId_upsellProductId_key" ON "ProductUpsell"("productId", "upsellProductId");
CREATE INDEX IF NOT EXISTS "ProductUpsell_productId_idx" ON "ProductUpsell"("productId");

CREATE UNIQUE INDEX IF NOT EXISTS "ProductCourseUpsell_productId_upsellCourseId_key" ON "ProductCourseUpsell"("productId", "upsellCourseId");
CREATE INDEX IF NOT EXISTS "ProductCourseUpsell_productId_idx" ON "ProductCourseUpsell"("productId");

CREATE UNIQUE INDEX IF NOT EXISTS "CourseUpsell_courseId_upsellCourseId_key" ON "CourseUpsell"("courseId", "upsellCourseId");
CREATE INDEX IF NOT EXISTS "CourseUpsell_courseId_idx" ON "CourseUpsell"("courseId");

CREATE UNIQUE INDEX IF NOT EXISTS "CourseProductUpsell_courseId_upsellProductId_key" ON "CourseProductUpsell"("courseId", "upsellProductId");
CREATE INDEX IF NOT EXISTS "CourseProductUpsell_courseId_idx" ON "CourseProductUpsell"("courseId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "ProductUpsell" ADD CONSTRAINT "ProductUpsell_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ProductUpsell" ADD CONSTRAINT "ProductUpsell_upsellProductId_fkey" FOREIGN KEY ("upsellProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ProductCourseUpsell" ADD CONSTRAINT "ProductCourseUpsell_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ProductCourseUpsell" ADD CONSTRAINT "ProductCourseUpsell_upsellCourseId_fkey" FOREIGN KEY ("upsellCourseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseUpsell" ADD CONSTRAINT "CourseUpsell_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseUpsell" ADD CONSTRAINT "CourseUpsell_upsellCourseId_fkey" FOREIGN KEY ("upsellCourseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseProductUpsell" ADD CONSTRAINT "CourseProductUpsell_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseProductUpsell" ADD CONSTRAINT "CourseProductUpsell_upsellProductId_fkey" FOREIGN KEY ("upsellProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
