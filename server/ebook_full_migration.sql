-- Drop bảng nếu bạn muốn làm rỗng data hoặc reset (không khuyến nghị trên Productiion)
-- DROP TABLE IF EXISTS "EbookAccess" CASCADE;
-- DROP TABLE IF EXISTS "Ebook" CASCADE;

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

-- ===================================
-- INDEXES VÀ CONSTRAINTS 
-- (Nếu bị lỗi "already exists" ở đoạn dưới, nghĩa là bạn ĐÃ chạy thành công script trước đó. KHÔNG SAO CẢ)
-- ===================================

-- CreateIndex: Đảm bảo slug ebook là duy nhất
CREATE UNIQUE INDEX IF NOT EXISTS "Ebook_slug_key" ON "Ebook"("slug");

-- CreateIndex: Đảm bảo mỗi Ebook chỉ liên kết 1 Product duy nhất (optional cho Upsell)
CREATE UNIQUE INDEX IF NOT EXISTS "Ebook_productId_key" ON "Ebook"("productId");

-- CreateIndex: Ngăn chặn 1 khóa học viên mua nhiều lần
CREATE UNIQUE INDEX IF NOT EXISTS "EbookAccess_userId_ebookId_key" ON "EbookAccess"("userId", "ebookId");

-- Foreign Keys (Sử dụng lệnh khối DO để bỏ qua lỗi nếu FK đã được tạo)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Ebook_productId_fkey') THEN
        ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EbookAccess_userId_fkey') THEN
        ALTER TABLE "EbookAccess" ADD CONSTRAINT "EbookAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EbookAccess_ebookId_fkey') THEN
        ALTER TABLE "EbookAccess" ADD CONSTRAINT "EbookAccess_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
