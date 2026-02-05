import { IShortLinkRepository } from './interfaces/short-link.repository.interface';
import crypto from 'crypto';

export class ShortLinkService {
    constructor(private shortLinkRepository: IShortLinkRepository) { }

    private generateRandomCode(length: number = 7): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const bytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            const byte = bytes[i];
            if (byte !== undefined) {
                result += chars[byte % chars.length];
            }
        }
        return result;
    }

    async createShortLink(data: { code?: string; originalUrl: string; title?: string; userId?: string }) {
        let code = data.code;

        if (code) {
            // Validate custom alias
            const assigned = await this.shortLinkRepository.findByCode(code);
            if (assigned) {
                throw new Error('Mã rút gọn này đã được sử dụng. Vui lòng chọn mã khác.');
            }

            // Basic URL path safety check
            const forbidden = ['api', 'admin', 'login', 'register', 'auth', 'courses', 'shop', 'blog', 'docs', 'contact'];
            if (forbidden.includes(code.toLowerCase())) {
                throw new Error('Mã rút gọn này trùng với hệ thống. Vui lòng chọn mã khác.');
            }
        } else {
            // Generate random code and ensure uniqueness
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 10) {
                code = this.generateRandomCode();
                const existing = await this.shortLinkRepository.findByCode(code);
                if (!existing) isUnique = true;
                attempts++;
            }
            if (!isUnique) throw new Error('Không thể tạo mã rút gọn ngẫu nhiên. Vui lòng thử lại.');
        }

        return this.shortLinkRepository.create({
            code: code!,
            originalUrl: data.originalUrl,
            ...(data.title !== undefined && { title: data.title }),
            ...(data.userId !== undefined && { userId: data.userId })
        });
    }

    async resolveCode(code: string) {
        const link = await this.shortLinkRepository.findByCode(code);
        if (link) {
            await this.shortLinkRepository.incrementClicks(link.id);
        }
        return link;
    }

    async getAllLinks() {
        return this.shortLinkRepository.findAll();
    }

    async getLink(id: string) {
        return this.shortLinkRepository.findById(id);
    }

    async updateLink(id: string, data: { originalUrl?: string; title?: string }) {
        return this.shortLinkRepository.update(id, data);
    }

    async deleteLink(id: string) {
        return this.shortLinkRepository.delete(id);
    }
}
