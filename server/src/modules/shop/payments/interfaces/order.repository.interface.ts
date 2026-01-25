import { Order, Prisma } from '@prisma/client';

export interface IOrderRepository {
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByCode(code: string): Promise<Order | null>;
    update(id: string, data: Prisma.OrderUpdateInput): Promise<Order>;
    delete(id: string): Promise<void>;
    findAll(params: any): Promise<{ data: Order[]; meta: any }>;
}
