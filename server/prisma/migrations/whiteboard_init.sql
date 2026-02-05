-- =====================================================
-- WHITEBOARD SYSTEM INITIALIZATION
-- =====================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE "WhiteboardStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "WhiteboardPermission" AS ENUM ('VIEW', 'EDIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Whiteboard table
CREATE TABLE IF NOT EXISTS "Whiteboard" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "status" "WhiteboardStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Whiteboard_pkey" PRIMARY KEY ("id")
);

-- 3. Create Artboard table
CREATE TABLE IF NOT EXISTS "Artboard" (
    "id" TEXT NOT NULL,
    "whiteboardId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,
    "width" INTEGER NOT NULL DEFAULT 1920,
    "height" INTEGER NOT NULL DEFAULT 1080,
    "elements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artboard_pkey" PRIMARY KEY ("id")
);

-- 4. Create WhiteboardShare table
CREATE TABLE IF NOT EXISTS "WhiteboardShare" (
    "id" TEXT NOT NULL,
    "whiteboardId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "permission" "WhiteboardPermission" NOT NULL DEFAULT 'VIEW',
    "expiresAt" TIMESTAMP(3),
    "maxAccesses" INTEGER,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteboardShare_pkey" PRIMARY KEY ("id")
);

-- 5. Create WhiteboardCollaborator table
CREATE TABLE IF NOT EXISTS "WhiteboardCollaborator" (
    "id" TEXT NOT NULL,
    "whiteboardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cursorX" DOUBLE PRECISION,
    "cursorY" DOUBLE PRECISION,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteboardCollaborator_pkey" PRIMARY KEY ("id")
);

-- 6. Create WhiteboardHistory table
CREATE TABLE IF NOT EXISTS "WhiteboardHistory" (
    "id" TEXT NOT NULL,
    "whiteboardId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteboardHistory_pkey" PRIMARY KEY ("id")
);

-- 7. Create ArtboardHistory table
CREATE TABLE IF NOT EXISTS "ArtboardHistory" (
    "id" TEXT NOT NULL,
    "artboardId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtboardHistory_pkey" PRIMARY KEY ("id")
);

-- 8. Create Indexes
CREATE INDEX IF NOT EXISTS "Whiteboard_creatorId_idx" ON "Whiteboard"("creatorId");
CREATE INDEX IF NOT EXISTS "Whiteboard_status_idx" ON "Whiteboard"("status");
CREATE INDEX IF NOT EXISTS "Artboard_whiteboardId_idx" ON "Artboard"("whiteboardId");
CREATE INDEX IF NOT EXISTS "Artboard_order_idx" ON "Artboard"("order");
CREATE UNIQUE INDEX IF NOT EXISTS "WhiteboardShare_shareToken_key" ON "WhiteboardShare"("shareToken");
CREATE INDEX IF NOT EXISTS "WhiteboardShare_whiteboardId_idx" ON "WhiteboardShare"("whiteboardId");
CREATE INDEX IF NOT EXISTS "WhiteboardCollaborator_whiteboardId_idx" ON "WhiteboardCollaborator"("whiteboardId");
CREATE INDEX IF NOT EXISTS "WhiteboardCollaborator_userId_idx" ON "WhiteboardCollaborator"("userId");
CREATE INDEX IF NOT EXISTS "WhiteboardHistory_whiteboardId_idx" ON "WhiteboardHistory"("whiteboardId");
CREATE INDEX IF NOT EXISTS "ArtboardHistory_artboardId_idx" ON "ArtboardHistory"("artboardId");

-- 9. Add Foreign Keys
ALTER TABLE "Whiteboard" ADD CONSTRAINT "Whiteboard_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Artboard" ADD CONSTRAINT "Artboard_whiteboardId_fkey" FOREIGN KEY ("whiteboardId") REFERENCES "Whiteboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WhiteboardShare" ADD CONSTRAINT "WhiteboardShare_whiteboardId_fkey" FOREIGN KEY ("whiteboardId") REFERENCES "Whiteboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WhiteboardCollaborator" ADD CONSTRAINT "WhiteboardCollaborator_whiteboardId_fkey" FOREIGN KEY ("whiteboardId") REFERENCES "Whiteboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WhiteboardCollaborator" ADD CONSTRAINT "WhiteboardCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WhiteboardHistory" ADD CONSTRAINT "WhiteboardHistory_whiteboardId_fkey" FOREIGN KEY ("whiteboardId") REFERENCES "Whiteboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArtboardHistory" ADD CONSTRAINT "ArtboardHistory_artboardId_fkey" FOREIGN KEY ("artboardId") REFERENCES "Artboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

SELECT 'Whiteboard system tables initialized successfully!' as result;
