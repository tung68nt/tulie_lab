import { LessonProgress, Enrollment, Prisma } from '@prisma/client';
import prisma from '../../../../config/prisma';
import { IProgressRepository } from '../interfaces/progress.repository.interface';

export class PrismaProgressRepository implements IProgressRepository {
    async upsertProgress(userId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgress> {
        return prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: { userId, lessonId }
            },
            update: {
                isCompleted,
                updatedAt: new Date()
            },
            create: {
                userId,
                lessonId,
                isCompleted
            }
        });
    }

    async getUserProgress(userId: string, courseId: string): Promise<any> {
        const lessons = await prisma.lesson.findMany({
            where: { courseId },
            select: { id: true }
        });

        const lessonIds = lessons.map((l: any) => l.id);

        const progress = await prisma.lessonProgress.findMany({
            where: {
                userId,
                lessonId: { in: lessonIds },
                isCompleted: true
            },
            select: { lessonId: true }
        });

        return {
            totalLessons: lessons.length,
            completedLessons: progress.length,
            completedLessonIds: progress.map((p: any) => p.lessonId)
        };
    }

    async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
        return prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });
    }
}
