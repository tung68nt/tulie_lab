import { PrismaClient, ShortLink } from '@prisma/client';
import { IShortLinkRepository } from '../interfaces/short-link.repository.interface';

const prisma = new PrismaClient();

export class PrismaShortLinkRepository implements IShortLinkRepository {
    async create(data: { code: string; originalUrl: string; title?: string; userId?: string }): Promise<ShortLink> {
        return prisma.shortLink.create({
            data
        });
    }

    async findById(id: string): Promise<ShortLink | null> {
        return prisma.shortLink.findUnique({
            where: { id }
        });
    }

    async findByCode(code: string): Promise<ShortLink | null> {
        return prisma.shortLink.findUnique({
            where: { code }
        });
    }

    async findAll(): Promise<ShortLink[]> {
        return prisma.shortLink.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, data: { originalUrl?: string; title?: string }): Promise<ShortLink> {
        return prisma.shortLink.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<ShortLink> {
        return prisma.shortLink.delete({
            where: { id }
        });
    }

    async incrementClicks(id: string): Promise<ShortLink> {
        return prisma.shortLink.update({
            where: { id },
            data: {
                clicks: { increment: 1 },
                lastClickedAt: new Date()
            }
        });
    }
}
