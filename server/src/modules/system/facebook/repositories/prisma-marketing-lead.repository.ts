import { MarketingLead, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IMarketingLeadRepository } from '../interfaces/marketing-lead.repository.interface';

export class PrismaMarketingLeadRepository implements IMarketingLeadRepository {
    async create(data: Prisma.MarketingLeadUncheckedCreateInput): Promise<MarketingLead> {
        return prisma.marketingLead.create({
            data
        });
    }

    async findByOrderId(orderId: string): Promise<MarketingLead | null> {
        return prisma.marketingLead.findUnique({
            where: { orderId }
        });
    }

    async update(orderId: string, data: Prisma.MarketingLeadUpdateInput): Promise<MarketingLead> {
        return prisma.marketingLead.update({
            where: { orderId },
            data
        });
    }

    async findAll(params: any): Promise<MarketingLead[]> {
        return prisma.marketingLead.findMany(params);
    }

    async delete(id: string): Promise<void> {
        await prisma.marketingLead.delete({
            where: { id }
        });
    }
}
