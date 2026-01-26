import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const subs = await prisma.product.findMany({
    where: { type: 'SUBSCRIPTION' },
    select: { id: true, title: true, slug: true }
  });
  console.log('--- SUBSCRIPTION PRODUCTS ---');
  console.log(JSON.stringify(subs, null, 2));
  process.exit(0);
}
main();
