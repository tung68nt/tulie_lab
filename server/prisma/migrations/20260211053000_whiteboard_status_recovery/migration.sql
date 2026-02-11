-- Defensive Recovery Migration
BEGIN;

-- 1. Ensure the table exists (soft check)
-- This assumes the table name is "Whiteboard" as per whiteboard_init.sql
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Whiteboard') THEN
        
        -- 2. Check if we need to rename the old type to avoid conflict
        -- If WhiteboardStatus exists but doesn't have the new values, we'll rename it
        IF EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'WhiteboardStatus' AND e.enumlabel = 'DRAFT') THEN
            ALTER TYPE "WhiteboardStatus" RENAME TO "WhiteboardStatus_old";
            CREATE TYPE "WhiteboardStatus" AS ENUM ('PUBLIC', 'PRIVATE');
            
            -- Convert the column
            ALTER TABLE "Whiteboard" ALTER COLUMN status DROP DEFAULT;
            ALTER TABLE "Whiteboard" ALTER COLUMN status TYPE "WhiteboardStatus" USING 
                CASE 
                    WHEN status::text = 'PUBLISHED' THEN 'PUBLIC'::"WhiteboardStatus"
                    ELSE 'PRIVATE'::"WhiteboardStatus"
                END;
            ALTER TABLE "Whiteboard" ALTER COLUMN status SET DEFAULT 'PRIVATE';
            
            DROP TYPE "WhiteboardStatus_old";
        END IF;

    END IF;
END
$$;

COMMIT;
