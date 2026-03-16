const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables in DB:', result.map(t => t.table_name));
    
    const ebookCols = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Ebook'
    `;
    console.log('Columns in Ebook:', ebookCols);
  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
