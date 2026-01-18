import { Instructor, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IInstructorRepository } from '../interfaces/instructor.repository.interface';

export class PrismaInstructorRepository implements IInstructorRepository {
    async findAll(): Promise<Instructor[]> {
        return prisma.instructor.findMany({
            orderBy: { name: 'asc' }
        });
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
