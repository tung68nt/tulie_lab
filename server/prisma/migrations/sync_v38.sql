-- =====================================================
-- DATABASE SYNCHRONIZATION - Iteration 38
-- Consolidation of missing fields identified during audit
-- =====================================================

-- 1. Add missing fields to Course table
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "saleStartDate" TIMESTAMP(3);
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "saleEndDate" TIMESTAMP(3);

-- 2. Add missing fields to Lesson table
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "learningOutcomes" TEXT;

-- 3. Add index for promoCodeId in Order
-- This supports the promo code tracking and potential future formal relation
CREATE INDEX IF NOT EXISTS "Order_promoCodeId_idx" ON "Order"("promoCodeId");

-- 4. Verify existing fields in Lesson from previous audits
-- (Ensuring alignment with implementation history)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Lesson' AND column_name='guide') THEN
        ALTER TABLE "Lesson" ADD COLUMN "guide" TEXT;
    END IF;
END $$;

SELECT 'Database synchronization fields added successfully!' as result;
