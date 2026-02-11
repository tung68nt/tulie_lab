/*
  Warnings:

  - The values [DRAFT,PUBLISHED,ARCHIVED] on the enum `WhiteboardStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
-- Map existing data to new enum values
-- Use text casts to handle existing values before the type change
UPDATE "whiteboards" SET status = CASE 
  WHEN status::text = 'PUBLISHED' THEN 'PUBLIC'::text
  ELSE 'PRIVATE'::text
END;

-- Explicitly drop the default since it references the old enum/type
ALTER TABLE "whiteboards" ALTER COLUMN status DROP DEFAULT;

-- RENAME the old type
ALTER TYPE "WhiteboardStatus" RENAME TO "WhiteboardStatus_old";

-- CREATE the new type
CREATE TYPE "WhiteboardStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- ALTER the column to use the new type
ALTER TABLE "whiteboards" ALTER COLUMN status TYPE "WhiteboardStatus" USING status::text::"WhiteboardStatus";

-- RESTORE the default
ALTER TABLE "whiteboards" ALTER COLUMN status SET DEFAULT 'PRIVATE';

-- DROP the old type
DROP TYPE "WhiteboardStatus_old";

COMMIT;
