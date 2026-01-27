-- Database Migration: Add Gallery and Detailed Content to Product
-- Date: 2026-01-27
-- Description: Adds missing columns for the product redesign

DO $$
BEGIN
    -- Add gallery to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'gallery'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "gallery" JSONB DEFAULT '[]';
        RAISE NOTICE 'Added Product.gallery';
    ELSE
        RAISE NOTICE 'Product.gallery already exists';
    END IF;

    -- Add detailedContent to Product if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'detailedContent'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "detailedContent" TEXT;
        RAISE NOTICE 'Added Product.detailedContent';
    ELSE
        RAISE NOTICE 'Product.detailedContent already exists';
    END IF;

    -- Add compareAtPrice to Course if not exists (Double coverage)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Course' AND column_name = 'compareAtPrice'
    ) THEN
        ALTER TABLE "Course" ADD COLUMN "compareAtPrice" DECIMAL(12,0);
        RAISE NOTICE 'Added Course.compareAtPrice';
    END IF;
    
    -- Add compareAtPrice to Product if not exists (Double coverage)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'compareAtPrice'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "compareAtPrice" DECIMAL(12,0);
        RAISE NOTICE 'Added Product.compareAtPrice';
    END IF;
END $$;

-- Verification
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('Product', 'Course') 
AND column_name IN ('gallery', 'detailedContent', 'compareAtPrice');
