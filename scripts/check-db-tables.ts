import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔍 Checking database tables...');
        const tables: any[] = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        console.log('Found tables:');
        tables.forEach(t => console.group(`- ${t.table_name}`));

        if (tables.length === 0) {
            console.log('❌ NO TABLES FOUND IN PUBLIC SCHEMA!');
        } else {
            // Check count for some key tables
            for (const t of tables) {
                try {
                    const count: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${t.table_name}"`);
                    console.log(`  Count: ${count[0].count}`);
                } catch (e) {
                    console.log(`  Error counting: ${e instanceof Error ? e.message : String(e)}`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error checking tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
