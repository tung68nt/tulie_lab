-- Production Database Migration Script
-- Run this directly on production database to fix all issues
-- Date: 2026-01-22

-- ============================================
-- STEP 1: Add missing columns to Course table
-- ============================================

DO $$
BEGIN
    -- Add compareAtPrice to Course if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Course' AND column_name = 'compareAtPrice'
    ) THEN
        ALTER TABLE "Course" ADD COLUMN "compareAtPrice" DECIMAL(12,0);
        RAISE NOTICE 'Added compareAtPrice column to Course table';
    ELSE
        RAISE NOTICE 'Course.compareAtPrice already exists';
    END IF;
END $$;

-- ============================================
-- STEP 2: Add missing columns to Product table
-- ============================================

DO $$
BEGIN
    -- Add compareAtPrice to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'compareAtPrice'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "compareAtPrice" DECIMAL(12,0);
        RAISE NOTICE 'Added compareAtPrice column to Product table';
    ELSE
        RAISE NOTICE 'Product.compareAtPrice already exists';
    END IF;
END $$;

-- ============================================
-- STEP 3: Create EventType enum
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
-- STEP 4: Create Event table
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
-- STEP 5: Create indexes on Event table
-- ============================================

DO $$
BEGIN
    -- Create index on date if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'Event' AND indexname = 'Event_date_idx'
    ) THEN
        CREATE INDEX "Event_date_idx" ON "Event"("date");
        RAISE NOTICE 'Created index Event_date_idx';
    ELSE
        RAISE NOTICE 'Event_date_idx already exists';
    END IF;

    -- Create index on isActive if not exists
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
-- VERIFICATION
-- ============================================

-- Verify Course table
SELECT
    'Course.compareAtPrice' as column_check,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Course' AND column_name = 'compareAtPrice'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- Verify Product table
SELECT
    'Product.compareAtPrice' as column_check,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'compareAtPrice'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- Verify Event table
SELECT
    'Event table' as table_check,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_name = 'Event'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- Verify EventType enum
SELECT
    'EventType enum' as enum_check,
    CASE
        WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventType')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status;

-- Show Event table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'Event'
ORDER BY ordinal_position;

-- ============================================
-- SUMMARY
-- ============================================

SELECT
    '🎉 MIGRATION COMPLETE!' as message,
    'All database schema changes have been applied.' as details,
    'Next: Rebuild application and restart server' as next_step;
