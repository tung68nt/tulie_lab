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

    private parseCourse(course: any) {
        if (!course) return null;
        if (course.learningOutcomes && typeof course.learningOutcomes === 'string') {
            try {
                const parsed = JSON.parse(course.learningOutcomes);
                if (parsed !== null && (typeof parsed === 'object' || Array.isArray(parsed))) {
                    course.learningOutcomes = parsed;
                }
            } catch (e) {
                // If it fails to parse (e.g. plain text with newlines from Admin UI), 
                // keep as a string so frontend can split it by \n
            }
        }
        if (course.structure && typeof course.structure === 'string') {
            try {
                course.structure = JSON.parse(course.structure);
            } catch (e) {
                course.structure = [];
            }
        }
        return course;
    }

    async getAllCourses(options: any = {}) {
        const { publishedOnly = true, categoryId, level, isFree, search } = options;

        const where: any = { isHidden: false };
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
            include: {
                lessons: {
                    select: { id: true, title: true, slug: true, isFree: true, position: true, thumbnail: true, chapter: true, section: true, duration: true }
                },
                category: true,
                instructor: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return courses.map(c => this.parseCourse(c));
    }

    async getCourseListing(options: any = {}) {
        const cacheKey = `courses:listing:${JSON.stringify(options)}`;

        if (this.cacheProvider) {
            const cached = await this.cacheProvider.getJson(cacheKey);
            if (cached) return cached;
        }

        const { publishedOnly = true, categoryId, level, isFree, search } = options;

        const where: any = { isHidden: false };
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
                compareAtPrice: true,
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
        const course = await this.courseRepository.findBySlug(slug, {
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
                    chapter: true,
                    section: true,
                }
            }
        });
        return this.parseCourse(course);
    }

    async getCourseById(id: string) {
        const course = await this.courseRepository.findById(id, {
            instructor: true,
            lessons: {
                orderBy: { position: 'asc' },
                include: {
                    attachments: true
                }
            }
        });
        return this.parseCourse(course);
    }

    async createCourse(data: any) {
        const validFields = ['title', 'slug', 'description', 'price', 'compareAtPrice', 'isPublished', 'instructorId', 'categoryId', 'thumbnail', 'introVideoUrl', 'learningOutcomes', 'deploymentStatus', 'tag', 'structure'];
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
        if (createData.structure && typeof createData.structure === 'object') {
            createData.structure = JSON.stringify(createData.structure);
        }
        createData.slug = uniqueSlug;

        if (createData.instructorId === '') delete createData.instructorId;
        if (createData.categoryId === '') delete createData.categoryId;

        const createdKey = await this.courseRepository.create(createData);
        return this.parseCourse(createdKey);
    }

    async updateCourse(id: string, data: any) {
        const validFields = ['title', 'slug', 'description', 'price', 'compareAtPrice', 'isPublished', 'instructorId', 'categoryId', 'thumbnail', 'introVideoUrl', 'learningOutcomes', 'deploymentStatus', 'tag', 'structure'];
        const filteredData: any = {};

        for (const key of Object.keys(data)) {
            if (validFields.includes(key)) filteredData[key] = data[key];
        }

        if (filteredData.instructorId === '') filteredData.instructorId = null;
        if (filteredData.categoryId === '') filteredData.categoryId = null;
        if (filteredData.learningOutcomes === '') filteredData.learningOutcomes = null;
        if (filteredData.introVideoUrl === '') filteredData.introVideoUrl = null;
        if (filteredData.thumbnail === '') filteredData.thumbnail = null;
        if (filteredData.description === '') filteredData.description = null;

        if (filteredData.structure && typeof filteredData.structure === 'object') {
            filteredData.structure = JSON.stringify(filteredData.structure);
        }

        const updatedCourse = await this.courseRepository.update(id, filteredData);
        return this.parseCourse(updatedCourse);
    }

    async deleteCourse(id: string) {
        // Check if course has enrollments
        const enrollmentCount = await prisma.enrollment.count({ where: { courseId: id } });

        if (enrollmentCount > 0) {
            // Soft delete: hide the course instead of deleting
            return this.courseRepository.update(id, { isHidden: true });
        }

        // No enrollments, safe to delete
        return this.courseRepository.delete(id);
    }

    async toggleCourseVisibility(id: string, isHidden: boolean) {
        return this.courseRepository.update(id, { isHidden });
    }

    async getHiddenCourses() {
        return this.courseRepository.findMany({
            where: { isHidden: true },
            include: {
                category: true,
                instructor: true,
                _count: { select: { enrollments: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    // Lesson Methods
    async addLesson(courseId: string, data: any) {
        return this.lessonRepository.create({
            ...data,
            course: { connect: { id: courseId } }
        });
    }

    async updateLesson(id: string, data: any) {
        const validFields = ['title', 'slug', 'description', 'thumbnail', 'videoUrl', 'duration', 'chapter', 'section', 'content', 'isFree', 'position'];
        const filteredData: any = {};

        for (const key of Object.keys(data)) {
            if (validFields.includes(key)) filteredData[key] = data[key];
        }

        return this.lessonRepository.update(id, filteredData);
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

        if (lesson.course) {
            lesson.course = this.parseCourse(lesson.course);
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
