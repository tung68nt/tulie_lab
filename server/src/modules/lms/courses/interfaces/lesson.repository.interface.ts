import { Lesson, Prisma, Attachment } from '@prisma/client';

export interface ILessonRepository {
    create(data: Prisma.LessonCreateInput): Promise<Lesson>;
    update(id: string, data: Prisma.LessonUpdateInput): Promise<Lesson>;
    delete(id: string): Promise<Lesson>;
    findById(id: string, include?: Prisma.LessonInclude): Promise<any | null>;
    findByPosition(courseId: string, position: number): Promise<Lesson | null>;

    // Attachments
    addAttachment(lessonId: string, data: Prisma.AttachmentCreateWithoutLessonInput): Promise<Attachment>;
}
