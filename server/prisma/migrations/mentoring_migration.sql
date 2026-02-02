-- =====================================================
-- MENTORING SESSION SYSTEM - Database Migration SQL
-- Run this on your production database (Supabase SQL Editor)
-- =====================================================

-- Step 1: Create new enums (safely)
DO $$ BEGIN
    CREATE TYPE "MentoringSessionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AddOnType" AS ENUM ('VIDEO', 'CHAT', 'REVIEW', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create PricingAddOn table (Required for relation)
CREATE TABLE IF NOT EXISTS "PricingAddOn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceAddon" DECIMAL(12, 0) NOT NULL,
    "compareAtAddon" DECIMAL(12, 0),
    "features" TEXT[],
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    -- Mentoring Fields
    "type" "AddOnType" NOT NULL DEFAULT 'OTHER',
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "sessionDuration" INTEGER NOT NULL DEFAULT 60,
    "curriculum" JSONB,

    CONSTRAINT "PricingAddOn_pkey" PRIMARY KEY ("id")
);

-- Indexes for PricingAddOn
CREATE INDEX IF NOT EXISTS "PricingAddOn_isActive_idx" ON "PricingAddOn"("isActive");
CREATE INDEX IF NOT EXISTS "PricingAddOn_position_idx" ON "PricingAddOn"("position");

-- Step 3: Create MentoringSession table
CREATE TABLE IF NOT EXISTS "MentoringSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "courseId" TEXT,
    "status" "MentoringSessionStatus" NOT NULL DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "meetingLink" TEXT,
    "notes" TEXT,
    "bookingNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentoringSession_pkey" PRIMARY KEY ("id")
);

-- Step 4: Create indexes for MentoringSession
CREATE INDEX IF NOT EXISTS "MentoringSession_userId_idx" ON "MentoringSession"("userId");
CREATE INDEX IF NOT EXISTS "MentoringSession_addOnId_idx" ON "MentoringSession"("addOnId");
CREATE INDEX IF NOT EXISTS "MentoringSession_startTime_idx" ON "MentoringSession"("startTime");

-- Step 5: Add Foreign Keys (safely)
DO $$ BEGIN
    ALTER TABLE "MentoringSession" 
        ADD CONSTRAINT "MentoringSession_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "MentoringSession" 
        ADD CONSTRAINT "MentoringSession_addOnId_fkey" 
        FOREIGN KEY ("addOnId") REFERENCES "PricingAddOn"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "MentoringSession" 
        ADD CONSTRAINT "MentoringSession_courseId_fkey" 
        FOREIGN KEY ("courseId") REFERENCES "Course"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

SELECT 'Mentoring Session & PricingAddOn tables created successfully!' as result;
