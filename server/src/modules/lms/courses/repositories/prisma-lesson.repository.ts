import { Lesson, Prisma, Attachment } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ILessonRepository } from '../interfaces/lesson.repository.interface';

export class PrismaLessonRepository implements ILessonRepository {
    async create(data: Prisma.LessonCreateInput): Promise<Lesson> {
        return prisma.lesson.create({ data });
    }

    async update(id: string, data: any): Promise<Lesson> {
        // Use any to bypass strict type checking if Prisma types are not yet updated in node_modules
        return (prisma.lesson as any).update({ where: { id }, data });
    }

    async delete(id: string): Promise<Lesson> {
        return prisma.lesson.delete({ where: { id } });
    }

    async findById(id: string, include?: Prisma.LessonInclude): Promise<any | null> {
        return prisma.lesson.findUnique({
            where: { id },
            ...(include ? { include } : {})
        } as any);
    }

    async findByPosition(courseId: string, position: number): Promise<Lesson | null> {
        return prisma.lesson.findFirst({ where: { courseId, position } });
    }

    async addAttachment(lessonId: string, data: Prisma.AttachmentCreateWithoutLessonInput): Promise<Attachment> {
        return prisma.attachment.create({
            data: {
                ...data,
                lessonId
            }
        });
    }
}
