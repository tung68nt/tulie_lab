import { Course, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ICourseRepository } from '../interfaces/course.repository.interface';

export class PrismaCourseRepository implements ICourseRepository {
    async create(data: Prisma.CourseCreateInput): Promise<Course> {
        return prisma.course.create({ data });
    }

    async update(id: string, data: Prisma.CourseUpdateInput): Promise<Course> {
        return prisma.course.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Course> {
        return prisma.course.delete({ where: { id } });
    }

    async findById(id: string, include?: Prisma.CourseInclude): Promise<any | null> {
        return prisma.course.findUnique({
            where: { id },
            include: include as any
        });
    }

    async findBySlug(slug: string, include?: Prisma.CourseInclude): Promise<any | null> {
        return prisma.course.findUnique({
            where: { slug },
            include: (include as any) || { lessons: { orderBy: { position: 'asc' } } }
        });
    }

    async findAll(params: any): Promise<{ data: Course[]; meta: any }> {
        // Basic findAll for generic repo compliance
        const courses = await prisma.course.findMany({
            include: { category: true, instructor: true }
        });
        return { data: courses, meta: { total: courses.length } };
    }

    async findMany(options: {
        where?: Prisma.CourseWhereInput;
        select?: Prisma.CourseSelect;
        include?: Prisma.CourseInclude;
        orderBy?: Prisma.CourseOrderByWithRelationInput;
    }): Promise<any[]> {
        return prisma.course.findMany(options);
    }
}
