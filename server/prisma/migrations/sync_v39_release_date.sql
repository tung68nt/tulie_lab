-- Add releaseDate column to Course table
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "releaseDate" TIMESTAMP(3);

SELECT 'Course releaseDate field added successfully!' as result;
