-- Add productId column to LandingPage table
ALTER TABLE "LandingPage" ADD COLUMN "productId" TEXT;

-- Add upsellProductId column to LandingPage table
ALTER TABLE "LandingPage" ADD COLUMN "upsellProductId" TEXT;

-- Add foreign key constraints (optional but recommended if you can)
-- ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_upsellProductId_fkey" FOREIGN KEY ("upsellProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update existing system pages to have type 'SYSTEM' (safety check)
UPDATE "LandingPage" SET "type" = 'SYSTEM' WHERE "slug" IN ('/', '/about', '/instructors');
