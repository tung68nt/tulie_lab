import { Course, Prisma } from '@prisma/client';
import { IBaseRepository } from '../../../../core/interfaces/repository.interface';

export interface ICourseRepository extends IBaseRepository<Course, Prisma.CourseCreateInput, Prisma.CourseUpdateInput> {
    findBySlug(slug: string, include?: Prisma.CourseInclude): Promise<Course | null>;
    findById(id: string, include?: Prisma.CourseInclude): Promise<Course | null>;
    findMany(options: any): Promise<any[]>;
}
