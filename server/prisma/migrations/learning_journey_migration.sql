-- =====================================================
-- LEARNING JOURNEY SYSTEM - Database Migration SQL
-- Run this on your production database
-- =====================================================

-- Step 1: Create new enums (if not exist)
DO $$ BEGIN
    CREATE TYPE "SubmissionType" AS ENUM ('IMAGE', 'FILE', 'URL', 'TEXT', 'ANY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "JourneyStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create LearningJourney table
CREATE TABLE IF NOT EXISTS "LearningJourney" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "courseId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isAddOn" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningJourney_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create JourneyStep table
CREATE TABLE IF NOT EXISTS "JourneyStep" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "submissionType" "SubmissionType" NOT NULL DEFAULT 'ANY',
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "deadlineDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyStep_pkey" PRIMARY KEY ("id")
);

-- Step 4: Create JourneyEnrollment table
CREATE TABLE IF NOT EXISTS "JourneyEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "status" "JourneyStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "JourneyEnrollment_pkey" PRIMARY KEY ("id")
);

-- Step 5: Create JourneySubmission table
CREATE TABLE IF NOT EXISTS "JourneySubmission" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "submissionType" "SubmissionType" NOT NULL,
    "content" TEXT NOT NULL,
    "fileName" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneySubmission_pkey" PRIMARY KEY ("id")
);

-- Step 6: Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "LearningJourney_slug_key" ON "LearningJourney"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "JourneyEnrollment_userId_journeyId_key" ON "JourneyEnrollment"("userId", "journeyId");

-- Step 7: Create foreign key constraints
ALTER TABLE "LearningJourney" 
    ADD CONSTRAINT "LearningJourney_courseId_fkey" 
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "JourneyStep" 
    ADD CONSTRAINT "JourneyStep_journeyId_fkey" 
    FOREIGN KEY ("journeyId") REFERENCES "LearningJourney"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JourneyEnrollment" 
    ADD CONSTRAINT "JourneyEnrollment_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JourneyEnrollment" 
    ADD CONSTRAINT "JourneyEnrollment_journeyId_fkey" 
    FOREIGN KEY ("journeyId") REFERENCES "LearningJourney"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JourneySubmission" 
    ADD CONSTRAINT "JourneySubmission_enrollmentId_fkey" 
    FOREIGN KEY ("enrollmentId") REFERENCES "JourneyEnrollment"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JourneySubmission" 
    ADD CONSTRAINT "JourneySubmission_stepId_fkey" 
    FOREIGN KEY ("stepId") REFERENCES "JourneyStep"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Done!
SELECT 'Learning Journey tables created successfully!' as result;
