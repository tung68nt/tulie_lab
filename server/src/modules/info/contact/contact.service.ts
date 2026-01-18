import { IContactRepository } from './interfaces/contact.repository.interface';

export class ContactService {
    constructor(
        private contactRepository: IContactRepository,
        private emailService?: any
    ) { }

    async createSubmission(data: { name: string, email: string, phone?: string, message: string }) {
        const submission = await this.contactRepository.create(data);

        if (this.emailService) {
            try {
                await this.emailService.sendAdminContactNotification(data);
            } catch (error) {
                console.log('Admin notification skipped');
            }
        }

        return submission;
    }

    async getSubmissions(page: number = 1, limit: number = 20, search?: string) {
        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const result = await this.contactRepository.findAll({
            where,
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            ...result,
            meta: {
                ...result.meta,
                page,
                limit,
                totalPages: Math.ceil(result.meta.total / limit)
            }
        };
    }

    async updateStatus(id: string, status: string) {
        return this.contactRepository.update(id, { status });
    }

    async deleteSubmission(id: string) {
        return this.contactRepository.delete(id);
    }
}
