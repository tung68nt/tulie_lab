-- Add gallery and detailedContent to Product table
-- Date: 2026-01-22

DO $$
BEGIN
    -- Add gallery (JSON) to Product
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'gallery'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "gallery" JSONB;
        RAISE NOTICE 'Added Product.gallery';
    ELSE
        RAISE NOTICE 'Product.gallery already exists';
    END IF;

    -- Add detailedContent (TEXT) to Product
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Product' AND column_name = 'detailedContent'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "detailedContent" TEXT;
        RAISE NOTICE 'Added Product.detailedContent';
    ELSE
        RAISE NOTICE 'Product.detailedContent already exists';
    END IF;
END $$;

-- Verify
SELECT
    'Product.gallery' as check_item,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'gallery'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
UNION ALL
SELECT
    'Product.detailedContent',
    CASE
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Product' AND column_name = 'detailedContent'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END;

SELECT '🎉 Product gallery & detailedContent added!' as message;
