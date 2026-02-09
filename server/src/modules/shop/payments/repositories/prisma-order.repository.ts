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
                user: {
                    include: {
                        profile: true
                    }
                }
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
                user: {
                    include: {
                        profile: true
                    }
                }
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

    async delete(id: string): Promise<void> {
        await prisma.order.delete({
            where: { id }
        });
    }

    async findAll(params: any): Promise<{ data: Order[]; meta: any }> {
        const { skip, take, where, orderBy, include } = params as any;

        // Statistics should usually be global or only based on search, not on the status filter itself
        // Extract search filters if they exist to keep stats relevant to search but not to status
        const searchWhere = { ...where };
        if (searchWhere.status) {
            delete searchWhere.status;
        }

        try {
            const [orders, total, statsData] = await Promise.all([
                prisma.order.findMany({
                    skip,
                    take,
                    where: where || {},
                    orderBy: orderBy || { createdAt: 'desc' },
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
                        },
                        activationCodes: {
                            include: {
                                course: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }),
                prisma.order.count({ where: where || {} }),
                prisma.order.groupBy({
                    by: ['status'],
                    where: searchWhere, // Use global where (search only, no status filter) for stats
                    _count: {
                        _all: true
                    },
                    _sum: {
                        amount: true
                    }
                }).catch((err: any) => {
                    console.error('Stats groupBy failed:', err);
                    return [] as any[];
                })
            ]);

            const stats = {
                total,
                paid: 0,
                pending: 0,
                cancelled: 0,
                totalRevenue: 0
            };

            if (Array.isArray(statsData)) {
                statsData.forEach((group: any) => {
                    const count = group._count?._all || 0;
                    const amount = Number(group._sum?.amount || 0);

                    if (group.status === 'PAID' || group.status === 'COMPLETED') {
                        stats.paid += count;
                        stats.totalRevenue += amount;
                    } else if (group.status === 'PENDING') {
                        stats.pending = count;
                    } else if (group.status === 'CANCELLED') {
                        stats.cancelled = count;
                    }
                });
            }

            return { data: orders, meta: { total, stats } };
        } catch (error) {
            console.error('PrismaOrderRepository.findAll error:', error);
            // Fallback for extreme cases
            return {
                data: [],
                meta: {
                    total: 0,
                    stats: { total: 0, paid: 0, pending: 0, cancelled: 0, totalRevenue: 0 }
                }
            };
        }
    }
}
