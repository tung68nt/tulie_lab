
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Starting manual schema repair...');

    try {
        // Force add the isActive column if it doesn't exist
        // Prisma usually creates table "User" (quoted) for model User
        await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='isActive') THEN 
          ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true; 
          RAISE NOTICE 'Added isActive column to User table';
        ELSE 
          RAISE NOTICE 'isActive column already exists';
        END IF; 
      END $$;
    `);
        console.log('✅ Successfully checked/patched User.isActive column');
    } catch (error) {
        console.error('⚠️ Error patching User.isActive (trying fallback):', error);

        // Fallback: try without checking (simpler query if DO blocks fail permission-wise)
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;`);
            console.log('✅ Fallback patch successful');
        } catch (e) {
            console.error('❌ Fallback failed:', e);
            // Don't exit 1, let's see if the app can survive or if it was already there
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
