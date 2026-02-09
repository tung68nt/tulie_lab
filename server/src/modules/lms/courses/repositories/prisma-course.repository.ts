import { Course, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ICourseRepository } from '../interfaces/course.repository.interface';

export class PrismaCourseRepository implements ICourseRepository {
    async create(data: Prisma.CourseCreateInput): Promise<Course> {
        return prisma.course.create({ data });
    }

    async update(id: string, data: any): Promise<Course> {
        return (prisma.course as any).update({ where: { id }, data });
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

    async findAll(params: { skip?: number; take?: number; where?: Prisma.CourseWhereInput } = {}): Promise<{ data: Course[]; meta: any }> {
        const { skip, take, where } = params;
        const [data, total] = await Promise.all([
            prisma.course.findMany({
                ...(where && { where }),
                ...(skip !== undefined && { skip }),
                ...(take !== undefined && { take }),
                include: { category: true, instructor: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.course.count({ ...(where && { where }) })
        ]);

        return { data, meta: { total } };
    }

    async findMany(options: Prisma.CourseFindManyArgs): Promise<Course[]> {
        return prisma.course.findMany(options);
    }

    async count(where?: Prisma.CourseWhereInput): Promise<number> {
        return prisma.course.count({ ...(where && { where }) });
    }
}
