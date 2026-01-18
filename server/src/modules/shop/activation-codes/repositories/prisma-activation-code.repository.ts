import { ActivationCode, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IActivationCodeRepository } from '../interfaces/activation-code.repository.interface';

export class PrismaActivationCodeRepository implements IActivationCodeRepository {
    async create(data: Prisma.ActivationCodeCreateInput): Promise<ActivationCode> {
        return prisma.activationCode.create({ data });
    }

    async update(id: string, data: Prisma.ActivationCodeUpdateInput): Promise<ActivationCode> {
        return prisma.activationCode.update({ where: { id }, data });
    }

    async delete(id: string): Promise<ActivationCode> {
        return prisma.activationCode.delete({ where: { id } });
    }

    async findById(id: string): Promise<ActivationCode | null> {
        return prisma.activationCode.findUnique({ where: { id }, include: { course: true, buyer: { include: { profile: true } }, redeemedBy: { include: { profile: true } } } });
    }

    async findByCode(code: string, include?: Prisma.ActivationCodeInclude): Promise<ActivationCode | null> {
        return prisma.activationCode.findUnique({ where: { code }, include: include || { course: true } });
    }

    async findByOrderId(orderId: string): Promise<ActivationCode[]> {
        return prisma.activationCode.findMany({ where: { orderId }, include: { course: true } });
    }

    async findAll(params: any): Promise<{ data: ActivationCode[]; meta: any }> {
        const skip = params.skip || 0;
        const take = params.take || 20;
        const where = params.where || {};

        const [data, total] = await Promise.all([
            prisma.activationCode.findMany({
                where,
                skip,
                take,
                include: { course: true, buyer: { include: { profile: true } }, redeemedBy: { include: { profile: true } } },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.activationCode.count({ where })
        ]);

        return { data, meta: { total } };
    }
}
