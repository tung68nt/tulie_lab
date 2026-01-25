import { Instructor, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IInstructorRepository } from '../interfaces/instructor.repository.interface';

export class PrismaInstructorRepository implements IInstructorRepository {
    async findAll(params: any = {}): Promise<{ data: Instructor[]; meta: any }> {
        const where = params.where || {};
        const skip = params.skip || 0;
        const take = params.take || 100;

        const [data, total] = await Promise.all([
            prisma.instructor.findMany({
                where,
                skip,
                take,
                orderBy: { name: 'asc' }
            }),
            prisma.instructor.count({ where })
        ]);

        return { data, meta: { total } };
    }

    async findById(id: string): Promise<Instructor | null> {
        return prisma.instructor.findUnique({ where: { id } });
    }

    async create(data: Prisma.InstructorCreateInput): Promise<Instructor> {
        return prisma.instructor.create({ data });
    }

    async update(id: string, data: Prisma.InstructorUpdateInput): Promise<Instructor> {
        return prisma.instructor.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Instructor> {
        return prisma.instructor.delete({ where: { id } });
    }
}
