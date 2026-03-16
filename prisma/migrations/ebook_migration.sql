-- CreateTable: Ebook
CREATE TABLE IF NOT EXISTS "Ebook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "cover" TEXT,
    "pdfKey" TEXT NOT NULL,
    "totalPages" INTEGER,
    "previewPages" INTEGER NOT NULL DEFAULT 5,
    "price" DECIMAL(12,0) NOT NULL DEFAULT 0,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EbookAccess
CREATE TABLE IF NOT EXISTS "EbookAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ebookId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "EbookAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Ebook_slug_key" ON "Ebook"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Ebook_productId_key" ON "Ebook"("productId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "EbookAccess_userId_ebookId_key" ON "EbookAccess"("userId", "ebookId");

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookAccess" ADD CONSTRAINT "EbookAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookAccess" ADD CONSTRAINT "EbookAccess_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
