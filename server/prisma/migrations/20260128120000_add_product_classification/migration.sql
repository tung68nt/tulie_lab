-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ClassificationType" AS ENUM ('PRODUCT_TYPE', 'PRODUCT_FIELD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductClassification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ClassificationType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductClassification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProductClassification_name_type_key" ON "ProductClassification"("name", "type");
