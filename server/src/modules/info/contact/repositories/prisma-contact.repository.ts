import { ContactSubmission, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IContactRepository } from '../interfaces/contact.repository.interface';

export class PrismaContactRepository implements IContactRepository {
    async create(data: Prisma.ContactSubmissionCreateInput): Promise<ContactSubmission> {
        return prisma.contactSubmission.create({ data });
    }

    async update(id: string, data: Prisma.ContactSubmissionUpdateInput): Promise<ContactSubmission> {
        return prisma.contactSubmission.update({ where: { id }, data });
    }

    async delete(id: string): Promise<ContactSubmission> {
        return prisma.contactSubmission.delete({ where: { id } });
    }

    async findById(id: string): Promise<ContactSubmission | null> {
        return prisma.contactSubmission.findUnique({ where: { id } });
    }

    async findAll(params: any): Promise<{ data: ContactSubmission[]; meta: any }> {
        const where = params.where || {};
        const skip = params.skip || 0;
        const take = params.take || 20;

        const [data, total] = await Promise.all([
            prisma.contactSubmission.findMany({
                where,
                skip,
                take,
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.contactSubmission.count({ where })
        ]);

        return { data, meta: { total } };
    }
}
