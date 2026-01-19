
import { PrismaClient } from '@prisma/client';
import { PaymentService } from './modules/shop/payments/payments.service';
import { PrismaOrderRepository } from './modules/shop/payments/repositories/prisma-order.repository';
import { PrismaUserRepository } from './modules/system/users/repositories/prisma-user.repository';
import { EventBus } from './core/event-bus';

// Mocks
const eventBus = new EventBus();
const prisma = new PrismaClient();
const orderRepo = new PrismaOrderRepository();
const userRepo = new PrismaUserRepository();

// We need to construct service but it has many deps.
// Simpler: use Repo directly to check data access.

async function debugOrders() {
    console.log("🔍 Debugging Order List...");

    try {
        const result = await orderRepo.findAll({
            page: 1, limit: 10
        } as any);

        console.log("✅ Order List Success!");
        console.log(`   Total: ${result.total}`);
        console.log(`   Count: ${result.orders.length}`);
        if (result.orders.length > 0) {
            console.log("   First Order:", JSON.stringify(result.orders[0], null, 2));
        }

    } catch (e: any) {
        console.error("❌ Order List Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

debugOrders();
