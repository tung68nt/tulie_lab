
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Starting manual schema repair for COURSE table...');

    try {
        // --- 0. Enums ---
        console.log('Creating Course Enums...');
        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "CourseDeploymentStatus" AS ENUM ('RELEASED', 'COMING_SOON', 'UPDATING');`);
            console.log('✅ Created CourseDeploymentStatus Enum');
        } catch (e: any) {
            if (e.message.includes('already exists')) console.log('⚠️ CourseDeploymentStatus already exists');
        }

        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "CourseTag" AS ENUM ('NONE', 'BEST_SELLER', 'HOT', 'NEW', 'DISCOUNT');`);
            console.log('✅ Created CourseTag Enum');
        } catch (e: any) {
            if (e.message.includes('already exists')) console.log('⚠️ CourseTag already exists');
        }

        // --- 1. Columns ---
        console.log('Checking/Adding Course columns...');

        // deploymentStatus
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "Course" 
        ADD COLUMN "deploymentStatus" "CourseDeploymentStatus" NOT NULL DEFAULT 'RELEASED';
      `);
            console.log('✅ Added deploymentStatus column');
        } catch (e: any) {
            if (e.message.includes('already exists')) console.log('⚠️ deploymentStatus already exists');
            else console.error('❌ Error adding deploymentStatus:', e.message);
        }

        // tag
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "Course" 
        ADD COLUMN "tag" "CourseTag" NOT NULL DEFAULT 'NONE';
      `);
            console.log('✅ Added tag column');
        } catch (e: any) {
            if (e.message.includes('already exists')) console.log('⚠️ tag already exists');
            else console.error('❌ Error adding tag:', e.message);
        }

        // introVideoUrl
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "Course" 
        ADD COLUMN "introVideoUrl" TEXT;
      `);
            console.log('✅ Added introVideoUrl column');
        } catch (e: any) {
            if (e.message.includes('already exists')) console.log('⚠️ introVideoUrl already exists');
            else console.error('❌ Error adding introVideoUrl:', e.message);
        }

        // learningOutcomes
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "Course" 
        ADD COLUMN "learningOutcomes" JSONB;
      `);
            console.log('✅ Added learningOutcomes column');
        } catch (e: any) {
            if (e.message.includes('already exists')) console.log('⚠️ learningOutcomes already exists');
            else console.error('❌ Error adding learningOutcomes:', e.message);
        }

        console.log('✅ Successfully patched Course schema');
    } catch (error) {
        console.error('❌ Fatal error patching schema:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
