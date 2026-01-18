import { Order, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IOrderRepository } from '../interfaces/order.repository.interface';

export class PrismaOrderRepository implements IOrderRepository {
    async create(data: Prisma.OrderCreateInput): Promise<Order> {
        return prisma.order.create({
            data,
            include: {
                items: true,
                user: true
            }
        });
    }

    async findById(id: string): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        course: true,
                        product: true
                    }
                },
                user: true
            }
        });
    }

    async findByCode(code: string): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { code },
            include: {
                items: {
                    include: {
                        course: true,
                        product: true
                    }
                },
                user: true
            }
        });
    }

    async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data,
            include: {
                items: true, // Return items for context if needed
                user: true
            }
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
        include?: Prisma.OrderInclude;
    }): Promise<{ orders: Order[]; total: number }> {
        const { skip, take, where, orderBy, include } = params as any;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take,
                where: where || {},
                orderBy: orderBy || undefined,
                include: include || {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    items: {
                        include: {
                            course: {
                                select: {
                                    title: true
                                }
                            },
                            product: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.order.count({ where: where || {} })
        ]);

        return { orders, total };
    }
}
