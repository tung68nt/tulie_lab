import prisma from '../../config/prisma';

export const getAllCourses = async (options: {
    publishedOnly?: boolean,
    categoryId?: string | undefined,
    level?: string | undefined,
    isFree?: boolean | undefined,
    search?: string | undefined
} = {}) => {
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
            { title: { contains: search } }, // SQLite is case-insensitive by default for LIKE? No, only ASCII. Prisma handles it?
            { description: { contains: search } }
        ];
    }

    return prisma.course.findMany({
        where,
        include: {
            lessons: {
                select: { id: true, title: true, slug: true, isFree: true, position: true }
            },
            category: true,
            instructor: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const getCourseBySlug = async (slug: string) => {
    return prisma.course.findUnique({
        where: { slug },
        include: {
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
                    chapter: true,
                    section: true,
                    videoUrl: true, // Needed for frontend detection/fallback
                    // attachments: false // EXCLUDED SECURITY
                    // attachments: false // EXCLUDED SECURITY
                }
            }
        }
    });
};

export const getCourseById = async (id: string) => {
    return prisma.course.findUnique({
        where: { id },
        include: {
            instructor: true,
            lessons: {
                orderBy: { position: 'asc' },
                include: {
                    attachments: true
                }
            }
        }
    });
};

export const createCourse = async (data: any) => {
    const createData: any = { ...data };

    // Ensure slug uniqueness
    let uniqueSlug = createData.slug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug: uniqueSlug }, select: { id: true } })) {
        uniqueSlug = `${createData.slug}-${counter}`;
        counter++;
    }
    createData.slug = uniqueSlug;

    if (createData.instructorId === '') {
        delete createData.instructorId;
    }
    if (createData.categoryId === '') {
        delete createData.categoryId;
    }
    return prisma.course.create({
        data: createData
    });
};

export const addLesson = async (courseId: string, data: {
    title: string,
    slug: string,
    videoUrl?: string,
    position: number,
    isFree?: boolean,
    chapter?: string,
    section?: string
}) => {
    return prisma.lesson.create({
        data: {
            ...data,
            courseId
        }
    });
};

export const updateCourse = async (id: string, data: any) => {
    const updateData = { ...data };
    if (updateData.instructorId === '') {
        updateData.instructorId = null;
    }
    if (updateData.categoryId === '') {
        updateData.categoryId = null;
    }
    return prisma.course.update({
        where: { id },
        data: updateData
    });
};

export const deleteCourse = async (id: string) => {
    return prisma.course.delete({
        where: { id }
    });
};

export const updateLesson = async (id: string, data: {
    title?: string,
    slug?: string,
    videoUrl?: string,
    position?: number,
    isFree?: boolean,
    isPublished?: boolean,
    chapter?: string,
    section?: string
}) => {
    return prisma.lesson.update({
        where: { id },
        data
    });
};

export const deleteLesson = async (id: string) => {
    return prisma.lesson.delete({
        where: { id }
    });
};

export const addAttachment = async (lessonId: string, data: { name: string, url: string, type: string }) => {
    return prisma.attachment.create({
        data: {
            name: data.name,
            url: data.url,
            type: data.type,
            lessonId
        }
    });
};



export const getLessonContent = async (lessonId: string, userId?: string, role?: string) => {
    const { secureLessonContent } = await import('../../services/video.service');

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            course: true,
            attachments: true
        }
    });

    if (!lesson) throw new Error('Lesson not found');

    // Free lessons or admin access - return with secure URLs
    if (lesson.isFree || role === 'ADMIN') {
        return secureLessonContent(lesson);
    }

    if (!userId) {
        throw new Error('Access denied: Login required');
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: lesson.courseId
            }
        }
    });

    if (!enrollment) {
        throw new Error('Access denied: You must enroll in this course to view this lesson.');
    }

    // Return lesson with secure URLs
    return secureLessonContent(lesson);
};

// Mark lesson as complete
export const markLessonComplete = async (lessonId: string, userId: string) => {
    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true, courseId: true }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    // Verify user has access to this course
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: lesson.courseId
            }
        }
    });

    if (!enrollment) {
        throw new Error('Access denied: You must be enrolled in this course');
    }

    // Upsert progress record
    return prisma.lessonProgress.upsert({
        where: {
            userId_lessonId: {
                userId,
                lessonId
            }
        },
        update: {
            isCompleted: true,
            updatedAt: new Date()
        },
        create: {
            userId,
            lessonId,
            isCompleted: true
        }
    });
};

// Get user's progress for a course
export const getUserCourseProgress = async (courseId: string, userId: string) => {
    const lessons = await prisma.lesson.findMany({
        where: { courseId },
        select: { id: true }
    });

    const lessonIds = lessons.map(l => l.id);

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
        completedLessonIds: progress.map((p: { lessonId: string }) => p.lessonId)
    };
};

// Mark lesson as uncomplete (toggle off)
export const markLessonUncomplete = async (lessonId: string, userId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true, courseId: true }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    // Verify user has access to this course
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: lesson.courseId
            }
        }
    });

    if (!enrollment) {
        throw new Error('Access denied: You must be enrolled in this course');
    }

    // Update progress record to uncomplete
    return prisma.lessonProgress.updateMany({
        where: {
            userId,
            lessonId
        },
        data: {
            isCompleted: false,
            updatedAt: new Date()
        }
    });
};
