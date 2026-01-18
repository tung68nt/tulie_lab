import { LessonProgress, Enrollment, Prisma } from '@prisma/client';

export interface IProgressRepository {
    upsertProgress(userId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgress>;
    getUserProgress(userId: string, courseId: string): Promise<any>;
    getEnrollment(userId: string, courseId: string): Promise<Enrollment | null>;
}
