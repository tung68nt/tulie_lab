import { MarketingLead, Prisma } from '@prisma/client';

export interface IMarketingLeadRepository {
    create(data: Prisma.MarketingLeadUncheckedCreateInput): Promise<MarketingLead>;
    findByOrderId(orderId: string): Promise<MarketingLead | null>;
    update(orderId: string, data: Prisma.MarketingLeadUpdateInput): Promise<MarketingLead>;
    findAll(params: any): Promise<MarketingLead[]>;
    delete(id: string): Promise<void>;
}
