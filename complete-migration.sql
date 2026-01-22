-- COMPLETE DATABASE MIGRATION SCRIPT
-- Adds ALL missing columns to production database
-- Date: 2026-01-22
-- Safe to run multiple times (idempotent)

-- ============================================
-- STEP 1: Create Campaign table if not exists
-- ============================================

CREATE TABLE IF NOT EXISTS "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- STEP 2: Add ALL missing columns to Course
-- ============================================

DO $$
BEGIN
    -- Add compareAtPrice to Course if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Course' AND column_name = 'compareAtPrice'
    ) THEN
        ALTER TABLE "Course" ADD COLUMN "compareAtPrice" DECIMAL(12,0);
        RAISE NOTICE 'Added Course.compareAtPrice';
    ELSE
        RAISE NOTICE 'Course.compareAtPrice already exists';
    END IF;

    -- Add campaignId to Course if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Course' AND column_name = 'campaignId'
    ) THEN
        ALTER TABLE "Course" ADD COLUMN "campaignId" TEXT;
        RAISE NOTICE 'Added Course.campaignId';
    ELSE
        RAISE NOTICE 'Course.campaignId already exists';
    END IF;

    -- Add saleStartDate to Course if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Course' AND column_name = 'saleStartDate'
    ) THEN
        ALTER TABLE "Course" ADD COLUMN "saleStartDate" TIMESTAMP(3);
        RAISE NOTICE 'Added Course.saleStartDate';
    ELSE
        RAISE NOTICE 'Course.saleStartDate already exists';
    END IF;

    -- Add saleEndDate to Course if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Course' AND column_name = 'saleEndDate'
    ) THEN
        ALTER TABLE "Course" ADD COLUMN "saleEndDate" TIMESTAMP(3);
        RAISE NOTICE 'Added Course.saleEndDate';
    ELSE
        RAISE NOTICE 'Course.saleEndDate already exists';
    END IF;
END $$;

-- ============================================
-- STEP 3: Add ALL missing columns to Product
-- ============================================

DO $$
BEGIN
    -- Add compareAtPrice to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'compareAtPrice'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "compareAtPrice" DECIMAL(12,0);
        RAISE NOTICE 'Added Product.compareAtPrice';
    ELSE
        RAISE NOTICE 'Product.compareAtPrice already exists';
    END IF;

    -- Add campaignId to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'campaignId'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "campaignId" TEXT;
        RAISE NOTICE 'Added Product.campaignId';
    ELSE
        RAISE NOTICE 'Product.campaignId already exists';
    END IF;

    -- Add saleStartDate to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'saleStartDate'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "saleStartDate" TIMESTAMP(3);
        RAISE NOTICE 'Added Product.saleStartDate';
    ELSE
        RAISE NOTICE 'Product.saleStartDate already exists';
    END IF;

    -- Add saleEndDate to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'saleEndDate'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "saleEndDate" TIMESTAMP(3);
        RAISE NOTICE 'Added Product.saleEndDate';
    ELSE
        RAISE NOTICE 'Product.saleEndDate already exists';
    END IF;
END $$;

-- ============================================
-- STEP 4: Create EventType enum
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventType') THEN
        CREATE TYPE "EventType" AS ENUM ('WEBINAR', 'WORKSHOP', 'COURSE', 'MEETUP', 'OTHER');
        RAISE NOTICE 'Created EventType enum';
    ELSE
        RAISE NOTICE 'EventType enum already exists';
    END IF;
END $$;

-- ============================================
-- STEP 5: Create Event table
-- ============================================

CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "type" "EventType" NOT NULL DEFAULT 'WEBINAR',
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- STEP 6: Create indexes
-- ============================================

DO $$
BEGIN
    -- Event indexes
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'Event' AND indexname = 'Event_date_idx'
    ) THEN
        CREATE INDEX "Event_date_idx" ON "Event"("date");
        RAISE NOTICE 'Created index Event_date_idx';
    ELSE
        RAISE NOTICE 'Event_date_idx already exists';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'Event' AND indexname = 'Event_isActive_idx'
    ) THEN
        CREATE INDEX "Event_isActive_idx" ON "Event"("isActive");
        RAISE NOTICE 'Created index Event_isActive_idx';
    ELSE
        RAISE NOTICE 'Event_isActive_idx already exists';
    END IF;
END $$;

-- ============================================
-- STEP 7: Add foreign key constraints
-- ============================================

DO $$
BEGIN
    -- Course.campaignId foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Course_campaignId_fkey'
        AND table_name = 'Course'
    ) THEN
        ALTER TABLE "Course"
        ADD CONSTRAINT "Course_campaignId_fkey"
        FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        RAISE NOTICE 'Added Course.campaignId foreign key';
    ELSE
        RAISE NOTICE 'Course.campaignId foreign key already exists';
    END IF;

    -- Product.campaignId foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Product_campaignId_fkey'
        AND table_name = 'Product'
    ) THEN
        ALTER TABLE "Product"
        ADD CONSTRAINT "Product_campaignId_fkey"
        FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        RAISE NOTICE 'Added Product.campaignId foreign key';
    ELSE
        RAISE NOTICE 'Product.campaignId foreign key already exists';
    END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify Campaign table
SELECT
    'Campaign table' as check_item,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_name = 'Campaign'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- Verify Course columns
SELECT
    'Course.compareAtPrice' as check_item,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Course' AND column_name = 'compareAtPrice'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
UNION ALL
SELECT
    'Course.campaignId',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Course' AND column_name = 'campaignId'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END
UNION ALL
SELECT
    'Course.saleStartDate',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Course' AND column_name = 'saleStartDate'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END
UNION ALL
SELECT
    'Course.saleEndDate',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Course' AND column_name = 'saleEndDate'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END;

-- Verify Product columns
SELECT
    'Product.compareAtPrice' as check_item,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'compareAtPrice'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
UNION ALL
SELECT
    'Product.campaignId',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'campaignId'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END
UNION ALL
SELECT
    'Product.saleStartDate',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'saleStartDate'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END
UNION ALL
SELECT
    'Product.saleEndDate',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'saleEndDate'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END;

-- Verify Event table
SELECT
    'Event table' as check_item,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_name = 'Event'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- Verify EventType enum
SELECT
    'EventType enum' as check_item,
    CASE
        WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventType')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- ============================================
-- SUMMARY
-- ============================================

SELECT
    '🎉 COMPLETE MIGRATION FINISHED!' as message,
    'All database schema changes have been applied.' as details,
    'Your production site should now work perfectly!' as next_step;
