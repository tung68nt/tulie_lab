import { Instructor, Prisma } from '@prisma/client';

export interface IInstructorRepository {
    findAll(): Promise<Instructor[]>;
    findById(id: string): Promise<Instructor | null>;
}
