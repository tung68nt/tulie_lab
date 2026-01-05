import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import prisma from '../src/config/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  if (users.length > 0) {
    const firstUser = users[0];
    if (firstUser) {
      const updated = await prisma.user.update({ where: { id: firstUser.id }, data: { role: 'ADMIN' } });
      console.log('Updated user to ADMIN:', updated);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
