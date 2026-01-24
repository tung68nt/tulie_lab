import { Order, Prisma } from '@prisma/client';

export interface IOrderRepository {
    create(data: Prisma.OrderCreateInput): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByCode(code: string): Promise<Order | null>;
    update(id: string, data: Prisma.OrderUpdateInput): Promise<Order>;
    delete(id: string): Promise<void>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
        include?: Prisma.OrderInclude;
    }): Promise<{ orders: Order[]; total: number; stats?: { total: number; paid: number; pending: number; cancelled: number; totalRevenue: number } }>;
}
