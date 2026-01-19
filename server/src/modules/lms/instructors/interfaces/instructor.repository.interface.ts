import { Instructor, Prisma } from '@prisma/client';

export interface IInstructorRepository {
    findAll(): Promise<Instructor[]>;
    findById(id: string): Promise<Instructor | null>;
    create(data: Prisma.InstructorCreateInput): Promise<Instructor>;
    update(id: string, data: Prisma.InstructorUpdateInput): Promise<Instructor>;
    delete(id: string): Promise<Instructor>;
}
