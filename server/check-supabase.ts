import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.jlreyzyvtylrmgaacuqs:0wWZeKFeyM6buTc9@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});
async function main() {
  try {
    const count = await prisma.order.count();
    console.log('--- SUPABASE_CHECK_SUCCESS: Order count is', count);
  } catch (err: any) {
    console.log('--- SUPABASE_CHECK_FAILED:', err.message);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
