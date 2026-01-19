-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "courseCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studentCount" INTEGER NOT NULL DEFAULT 0;
