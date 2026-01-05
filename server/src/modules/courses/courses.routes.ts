import { Router } from 'express';
import * as CourseController from './courses.controller';
import { authenticate, authorize, authenticateOptional } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// ==========================================
// ADMIN ROUTES FIRST (specific paths before dynamic :slug)
// ==========================================
router.get('/all', authenticate, authorize([Role.ADMIN]), CourseController.listAllCourses);

// Lesson routes (specific paths)
router.get('/lessons/:id/content', authenticateOptional, CourseController.getLessonContent);
router.post('/lessons/:id/complete', authenticate, CourseController.markLessonComplete);
router.post('/lessons/:id/uncomplete', authenticate, CourseController.markLessonUncomplete);
router.put('/lessons/:id', authenticate, authorize([Role.ADMIN]), CourseController.updateLesson);
router.delete('/lessons/:id', authenticate, authorize([Role.ADMIN]), CourseController.deleteLesson);
router.post('/lessons/:lessonId/attachments', authenticate, authorize([Role.ADMIN]), CourseController.addAttachment);

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/', CourseController.listCourses);

// ==========================================
// DYNAMIC ROUTES LAST (catches remaining patterns)
// ==========================================
router.get('/:id/full', authenticate, authorize([Role.ADMIN]), CourseController.getCourseDetails);
router.post('/:id/lessons', authenticate, authorize([Role.ADMIN]), CourseController.addLesson);
router.put('/:id', authenticate, authorize([Role.ADMIN]), CourseController.updateCourse);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), CourseController.deleteCourse);

// User progress route
router.get('/:id/progress', authenticate, CourseController.getCourseProgress);

// Course creation (no dynamic param)
router.post('/', authenticate, authorize([Role.ADMIN]), CourseController.createCourse);

// Public course by slug - MUST BE LAST
router.get('/:slug', CourseController.getCourse);

export default router;
