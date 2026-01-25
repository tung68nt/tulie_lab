import { Instructor, Prisma } from '@prisma/client';

export interface IInstructorRepository {
    findAll(params?: any): Promise<{ data: Instructor[]; meta: any }>;
    findById(id: string): Promise<Instructor | null>;
    create(data: Prisma.InstructorCreateInput): Promise<Instructor>;
    update(id: string, data: Prisma.InstructorUpdateInput): Promise<Instructor>;
    delete(id: string): Promise<Instructor>;
}
