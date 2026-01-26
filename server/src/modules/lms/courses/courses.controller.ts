import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { CourseService } from './courses.service';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class CourseController {
    private get courseService(): CourseService {
        return container.resolve<CourseService>('CourseService');
    }

    async listCourses(req: Request, res: Response) {
        try {
            res.set('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds
            const { category, level, price, search } = req.query;
            let isFree: boolean | undefined = undefined;
            if (price === 'free') isFree = true;
            if (price === 'paid') isFree = false;

            const courses = await this.courseService.getCourseListing({
                publishedOnly: true,
                categoryId: category ? String(category) : undefined,
                level: level ? String(level) : undefined,
                isFree,
                search: search ? String(search) : undefined
            });
            res.json({
                data: courses,
                meta: {
                    total: courses.length
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async listAllCourses(req: Request, res: Response) {
        try {
            // No cache for admin list or internal use list usually, but strict args here suggest public usage??
            // usually listAllCourses is for admin. Let's check route usage.
            // If it accepts 'published' query param, it might be admin.
            // PROCEED with caution: only cache listCourses (public) and getCourse (public).
            const { category, level, price, search, published } = req.query;
            let isFree: boolean | undefined = undefined;
            if (price === 'free') isFree = true;
            if (price === 'paid') isFree = false;
            const publishedOnly = published !== undefined ? published === 'true' : false;

            const courses = await this.courseService.getAllCourses({
                publishedOnly,
                categoryId: category ? String(category) : undefined,
                level: level ? String(level) : undefined,
                isFree,
                search: search ? String(search) : undefined
            });
            res.json({
                data: courses,
                meta: {
                    total: courses.length
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCourse(req: Request, res: Response) {
        try {
            res.set('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds
            const { slug } = req.params as { slug: string };
            const course = await this.courseService.getCourseBySlug(slug);
            if (!course) return res.status(404).json({ message: 'Course not found' });
            res.json(course);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCourseById(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        try {
            const course = await this.courseService.getCourseById(id);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json(course);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCourseDetails(req: Request, res: Response) {
        const { id } = req.params as { id: string };
        try {
            console.log(`[Admin] Fetching course details for ID: ${id}`);
            const course = await this.courseService.getCourseById(id);
            if (!course) {
                console.warn(`[Admin] Course not found for ID: ${id}`);
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json(course);
        } catch (error: any) {
            console.error(`[Admin] Error fetching course ${id}:`, error);
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const course = await this.courseService.createCourse(req.body);
            res.json(course);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const course = await this.courseService.updateCourse(req.params.id as string, req.body);
            res.json(course);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.courseService.deleteCourse(req.params.id as string);
            res.json({ message: 'Course deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async addLesson(req: Request, res: Response) {
        try {
            const lesson = await this.courseService.addLesson(req.params.id as string, req.body);
            res.json(lesson);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateLesson(req: Request, res: Response) {
        try {
            const lesson = await this.courseService.updateLesson(req.params.id as string, req.body);
            res.json(lesson);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteLesson(req: Request, res: Response) {
        try {
            await this.courseService.deleteLesson(req.params.id as string);
            res.json({ message: 'Lesson deleted' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async addAttachment(req: Request, res: Response) {
        try {
            const { title, url, type } = req.body;
            if (!title || !url) return res.status(400).json({ message: 'Title and URL are required' });
            const attachment = await this.courseService.addAttachment(req.params.lessonId as string, { name: title, url, type: type || 'FILE' });
            res.status(201).json(attachment);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getLessonContent(req: Request, res: Response) {
        try {
            const user = (req as AuthRequest).user;
            const lesson = await this.courseService.getLessonContent(req.params.id as string, user?.id, user?.role);
            res.json(lesson);
        } catch (error: any) {
            if (error.message.includes('Access denied')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    }

    async markLessonComplete(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Authentication required' });
            const progress = await this.courseService.markLessonComplete(req.params.id as string, userId);
            res.json({ success: true, progress });
        } catch (error: any) {
            if (error.message.includes('Access denied') || error.message.includes('not found')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    }

    async markLessonUncomplete(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Authentication required' });
            const result = await this.courseService.markLessonUncomplete(req.params.id as string, userId);
            res.json({ success: true, result });
        } catch (error: any) {
            if (error.message.includes('Access denied') || error.message.includes('not found')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    }

    async getCourseProgress(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'Authentication required' });
            const progress = await this.courseService.getUserCourseProgress(req.params.id as string, userId);
            res.json(progress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleRegisterInterest(req: Request, res: Response) {
        try {
            const { email, name, phone, message } = req.body;
            if (!email || !name) return res.status(400).json({ message: 'Email and Name are required' });
            await this.courseService.registerInterest({ courseId: req.params.courseId as string, email, name, phone, message });
            res.status(201).json({ success: true, message: 'Registration successful' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const courseController = new CourseController();
