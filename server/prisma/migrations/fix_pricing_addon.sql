-- =====================================================
-- FIX PRICING ADDON TABLE - Database Migration SQL
-- Run this on your production database (Supabase SQL Editor)
-- =====================================================

-- 1. Ensure Enum exists
DO $$ BEGIN
    CREATE TYPE "AddOnType" AS ENUM ('VIDEO', 'CHAT', 'REVIEW', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add missing columns to PricingAddOn table if they don't exist
DO $$ BEGIN
    ALTER TABLE "PricingAddOn" ADD COLUMN "type" "AddOnType" NOT NULL DEFAULT 'OTHER';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "PricingAddOn" ADD COLUMN "sessionCount" INTEGER NOT NULL DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "PricingAddOn" ADD COLUMN "sessionDuration" INTEGER NOT NULL DEFAULT 60;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "PricingAddOn" ADD COLUMN "curriculum" JSONB;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

SELECT 'PricingAddOn table schema updated successfully!' as result;
