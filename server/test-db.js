const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const ebooks = await prisma.ebook.findMany({ take: 1 });
    console.log('Success: Ebook table found', ebooks);
  } catch (error) {
    console.error('Error: Table not found or schema out of sync', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
