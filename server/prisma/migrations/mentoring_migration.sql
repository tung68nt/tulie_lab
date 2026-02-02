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

-- Step 2: Create MentoringSession table
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

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS "MentoringSession_userId_idx" ON "MentoringSession"("userId");
CREATE INDEX IF NOT EXISTS "MentoringSession_addOnId_idx" ON "MentoringSession"("addOnId");
CREATE INDEX IF NOT EXISTS "MentoringSession_startTime_idx" ON "MentoringSession"("startTime");

-- Step 4: Add Foreign Keys (safely)
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

SELECT 'Mentoring Session tables created successfully!' as result;
