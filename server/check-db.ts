import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const count = await prisma.order.count();
    console.log('--- DB_CHECK_SUCCESS: Order count is', count);
  } catch (err: any) {
    console.log('--- DB_CHECK_FAILED:', err.message);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
