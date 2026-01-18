import { ICourseRepository } from './interfaces/course.repository.interface';
import { ILessonRepository } from './interfaces/lesson.repository.interface';
import { IProgressRepository } from './interfaces/progress.repository.interface';
import { Prisma } from '@prisma/client';
import { secureLessonContent } from '../../../services/video.service';
import prisma from '../../../config/prisma';

export class CourseService {
    constructor(
        private courseRepository: ICourseRepository,
        private lessonRepository: ILessonRepository,
        private progressRepository: IProgressRepository,
        private cacheProvider?: any // Optional Redis provider
    ) { }

    async getAllCourses(options: any = {}) {
        const { publishedOnly = true, categoryId, level, isFree, search } = options;

        const where: any = {};
        if (publishedOnly) where.isPublished = true;
        if (categoryId) where.categoryId = categoryId;
        if (level && level !== 'ALL') where.level = level;
        if (isFree !== undefined) {
            if (isFree) where.price = 0;
            else where.price = { gt: 0 };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        return this.courseRepository.findMany({
            where,
            include: {
                lessons: {
                    select: { id: true, title: true, slug: true, isFree: true, position: true, thumbnail: true }
                },
                category: true,
                instructor: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getCourseListing(options: any = {}) {
        const cacheKey = `courses:listing:${JSON.stringify(options)}`;

        if (this.cacheProvider) {
            const cached = await this.cacheProvider.getJson(cacheKey);
            if (cached) return cached;
        }

        const { publishedOnly = true, categoryId, level, isFree, search } = options;

        const where: any = {};
        if (publishedOnly) where.isPublished = true;
        if (categoryId) where.categoryId = categoryId;
        if (level && level !== 'ALL') where.level = level;
        if (isFree !== undefined) {
            if (isFree) where.price = 0;
            else where.price = { gt: 0 };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const courses = await this.courseRepository.findMany({
            where,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                price: true,
                thumbnail: true,
                deploymentStatus: true,
                tag: true,
                category: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' }
        });

        if (this.cacheProvider) {
            await this.cacheProvider.setJson(cacheKey, courses, 300);
        }

        return courses;
    }

    async getCourseBySlug(slug: string) {
        return this.courseRepository.findBySlug(slug, {
            instructor: true,
            lessons: {
                orderBy: { position: 'asc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    position: true,
                    isFree: true,
                    duration: true,
                    videoUrl: true,
                    thumbnail: true,
                }
            }
        });
    }

    async getCourseById(id: string) {
        return this.courseRepository.findById(id, {
            instructor: true,
            lessons: {
                orderBy: { position: 'asc' },
                include: {
                    attachments: true
                }
            }
        });
    }

    async createCourse(data: any) {
        const validFields = ['title', 'slug', 'description', 'price', 'isPublished', 'instructorId', 'categoryId', 'thumbnail', 'introVideoUrl', 'learningOutcomes', 'deploymentStatus', 'tag'];
        const createData: any = {};

        for (const key of Object.keys(data)) {
            if (validFields.includes(key)) createData[key] = data[key];
        }

        // Ensure slug uniqueness
        let uniqueSlug = createData.slug;
        let counter = 1;
        while (await this.courseRepository.findBySlug(uniqueSlug)) {
            uniqueSlug = `${createData.slug}-${counter}`;
            counter++;
        }
        createData.slug = uniqueSlug;

        if (createData.instructorId === '') delete createData.instructorId;
        if (createData.categoryId === '') delete createData.categoryId;

        return this.courseRepository.create(createData);
    }

    async updateCourse(id: string, data: any) {
        const validFields = ['title', 'slug', 'description', 'price', 'isPublished', 'instructorId', 'categoryId', 'thumbnail', 'introVideoUrl', 'learningOutcomes', 'deploymentStatus', 'tag'];
        const filteredData: any = {};

        for (const key of Object.keys(data)) {
            if (validFields.includes(key)) filteredData[key] = data[key];
        }

        if (filteredData.instructorId === '') filteredData.instructorId = null;
        if (filteredData.categoryId === '') filteredData.categoryId = null;

        return this.courseRepository.update(id, filteredData);
    }

    async deleteCourse(id: string) {
        return this.courseRepository.delete(id);
    }

    // Lesson Methods
    async addLesson(courseId: string, data: any) {
        return this.lessonRepository.create({
            ...data,
            course: { connect: { id: courseId } }
        });
    }

    async updateLesson(id: string, data: any) {
        return this.lessonRepository.update(id, data);
    }

    async deleteLesson(id: string) {
        return this.lessonRepository.delete(id);
    }

    async addAttachment(lessonId: string, data: any) {
        return this.lessonRepository.addAttachment(lessonId, data);
    }

    async getLessonContent(lessonId: string, userId?: string, role?: string) {
        const lesson = await this.lessonRepository.findById(lessonId, {
            course: true,
            attachments: true
        });

        if (!lesson) throw new Error('Lesson not found');

        if (lesson.isFree || role === 'ADMIN') {
            return secureLessonContent(lesson);
        }

        if (!userId) {
            throw new Error('Access denied: Login required');
        }

        const enrollment = await this.progressRepository.getEnrollment(userId, lesson.courseId);

        if (!enrollment) {
            throw new Error('Access denied: You must enroll in this course to view this lesson.');
        }

        return secureLessonContent(lesson);
    }

    async markLessonComplete(lessonId: string, userId: string) {
        const lesson = await this.lessonRepository.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');

        const enrollment = await this.progressRepository.getEnrollment(userId, lesson.courseId);
        if (!enrollment) throw new Error('Access denied: You must be enrolled in this course');

        return this.progressRepository.upsertProgress(userId, lessonId, true);
    }

    async markLessonUncomplete(lessonId: string, userId: string) {
        const lesson = await this.lessonRepository.findById(lessonId);
        if (!lesson) throw new Error('Lesson not found');

        const enrollment = await this.progressRepository.getEnrollment(userId, lesson.courseId);
        if (!enrollment) throw new Error('Access denied: You must be enrolled in this course');

        return this.progressRepository.upsertProgress(userId, lessonId, false);
    }

    async getUserCourseProgress(courseId: string, userId: string) {
        return this.progressRepository.getUserProgress(userId, courseId);
    }

    async registerInterest(data: any) {
        // This probably needs its own repo if we want to be strict, 
        // but for now let's keep it simple or use a generic one.
        return (prisma as any).courseRegistration.create({ data });
    }
}
