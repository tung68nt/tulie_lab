import { ShortLink } from '@prisma/client';

export interface IShortLinkRepository {
    create(data: { code: string; originalUrl: string; title?: string; userId?: string }): Promise<ShortLink>;
    findById(id: string): Promise<ShortLink | null>;
    findByCode(code: string): Promise<ShortLink | null>;
    findAll(): Promise<ShortLink[]>;
    update(id: string, data: { originalUrl?: string; title?: string }): Promise<ShortLink>;
    delete(id: string): Promise<ShortLink>;
    incrementClicks(id: string): Promise<ShortLink>;
}
