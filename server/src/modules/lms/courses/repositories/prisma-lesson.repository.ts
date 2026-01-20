import { Lesson, Prisma, Attachment } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { ILessonRepository } from '../interfaces/lesson.repository.interface';

export class PrismaLessonRepository implements ILessonRepository {
    async create(data: Prisma.LessonCreateInput): Promise<Lesson> {
        return prisma.lesson.create({ data });
    }

    async update(id: string, data: any): Promise<Lesson> {
        console.log(`[PrismaLessonRepository] Entering update for lesson ${id} with data keys:`, Object.keys(data));
        try {
            // Try standard update first
            return await (prisma.lesson as any).update({ where: { id }, data });
        } catch (error: any) {
            // If it fails (likely due to unknown fields like 'chapter'/'section' on an old client)
            // we fall back to raw SQL for those specific fields.
            console.error(`[PrismaLessonRepository] Prisma update failed for ${id}, attempting fallback:`, error.message);

            const specialFields = ['chapter', 'section'];
            const standardData = { ...data };
            const fallbackData: any = {};

            specialFields.forEach(field => {
                if (field in data) {
                    fallbackData[field] = data[field];
                    delete standardData[field];
                }
            });

            // Update remaining standard fields via Prisma
            let lesson = await (prisma.lesson as any).update({
                where: { id },
                data: standardData
            });

            // Update special fields via Raw SQL
            for (const [field, value] of Object.entries(fallbackData)) {
                await prisma.$executeRawUnsafe(
                    `UPDATE "Lesson" SET "${field}" = $1 WHERE "id" = $2`,
                    value,
                    id
                );
                (lesson as any)[field] = value;
            }

            return lesson;
        }
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
