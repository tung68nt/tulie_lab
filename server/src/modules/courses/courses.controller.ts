import { Request, Response } from 'express';
import * as CourseService from './courses.service';
import { AuthRequest } from '../../middleware/auth.middleware';

// Public list (published only)
export const listCourses = async (req: Request, res: Response) => {
    try {
        const { category, level, price, search } = req.query;
        let isFree: boolean | undefined = undefined;
        if (price === 'free') isFree = true;
        if (price === 'paid') isFree = false;

        const courses = await CourseService.getAllCourses({
            publishedOnly: true,
            categoryId: category ? String(category) : undefined,
            level: level ? String(level) : undefined,
            isFree,
            search: search ? String(search) : undefined
        });
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin list (all courses)
export const listAllCourses = async (req: Request, res: Response) => {
    try {
        const { category, level, price, search, published } = req.query;

        let isFree: boolean | undefined = undefined;
        if (price === 'free') isFree = true;
        if (price === 'paid') isFree = false;

        // If published param is provided, use it. Otherwise, show all (publishedOnly=false)
        const publishedOnly = published !== undefined ? published === 'true' : false;

        const courses = await CourseService.getAllCourses({
            publishedOnly,
            categoryId: category ? String(category) : undefined,
            level: level ? String(level) : undefined,
            isFree,
            search: search ? String(search) : undefined
        });
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourse = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params as { slug: string };
        const course = await CourseService.getCourseBySlug(slug);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // course id
        const course = await CourseService.getCourseById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        console.log('Create Course Request Body:', req.body);
        const { title, slug, description, price } = req.body;
        const course = await CourseService.createCourse({ title, slug, description, price });
        res.json(course);
    } catch (error: any) {
        console.error('Create Course Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const addLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // course id
        const { title, slug, videoUrl, position, isFree } = req.body;
        const lesson = await CourseService.addLesson(id, { title, slug, videoUrl, position, isFree });
        res.json(lesson);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const data = req.body;
        const course = await CourseService.updateCourse(id, data);
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        await CourseService.deleteCourse(id);
        res.json({ message: 'Course deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // lesson id
        const data = req.body;
        const lesson = await CourseService.updateLesson(id, data);
        res.json(lesson);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // lesson id
        await CourseService.deleteLesson(id);
        res.json({ message: 'Lesson deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addAttachment = async (req: Request, res: Response) => {
    try {
        const { lessonId } = req.params as { lessonId: string };
        const { title, url, type } = req.body;

        if (!title || !url) {
            return res.status(400).json({ message: 'Title and URL are required' });
        }

        const attachment = await CourseService.addAttachment(lessonId, { name: title, url, type: type || 'FILE' });
        res.status(201).json(attachment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLessonContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // lesson id
        const user = (req as AuthRequest).user;

        // user may be undefined if guest
        const lesson = await CourseService.getLessonContent(id, user?.id, user?.role);
        res.json(lesson);
    } catch (error: any) {
        if (error.message.includes('Access denied')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Mark lesson as complete
export const markLessonComplete = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // lessonId
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const progress = await CourseService.markLessonComplete(id, userId);
        res.json({ success: true, progress });
    } catch (error: any) {
        if (error.message.includes('Access denied') || error.message.includes('not found')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Get user's progress for a course
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // courseId
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const progress = await CourseService.getUserCourseProgress(id, userId);
        res.json(progress);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Mark lesson as uncomplete (toggle off)
export const markLessonUncomplete = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as { id: string }; // lessonId
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const result = await CourseService.markLessonUncomplete(id, userId);
        res.json({ success: true, result });
    } catch (error: any) {
        if (error.message.includes('Access denied') || error.message.includes('not found')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};
