import { Router } from 'express';
import { courseController } from './courses.controller';
import { authenticate, authenticateOptional, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// ==========================================
// ADMIN ROUTES (specific paths first)
// ==========================================
router.get('/admin/list', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.listAllCourses(req, res));
router.get('/admin/:id', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.getCourseDetails(req, res));
router.get('/:id/full', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.getCourseDetails(req, res));

// ==========================================
// LESSONS & ATTACHMENTS
// ==========================================
router.get('/lessons/:id/content', authenticateOptional, (req, res) => courseController.getLessonContent(req, res));
router.post('/lessons/:id/complete', authenticate, (req, res) => courseController.markLessonComplete(req, res));
router.post('/lessons/:id/uncomplete', authenticate, (req, res) => courseController.markLessonUncomplete(req, res));
router.put('/lessons/:id', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.updateLesson(req, res));
router.delete('/lessons/:id', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.deleteLesson(req, res));
router.post('/lessons/:lessonId/attachments', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.addAttachment(req, res));

// ==========================================
// PUBLIC & GENERAL
// ==========================================
router.get('/by-id/:id', (req, res) => courseController.getCourseById(req, res)); // For checkout validation
router.get('/', (req, res) => courseController.listCourses(req, res));
router.post('/', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.create(req, res));
router.get('/:id/progress', authenticate, (req, res) => courseController.getCourseProgress(req, res));
router.post('/:courseId/register-interest', (req, res) => courseController.handleRegisterInterest(req, res));

// ==========================================
// DYNAMIC ROUTES (dynamic params last)
// ==========================================
router.put('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.update(req, res));
router.delete('/:id', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.delete(req, res));
router.post('/:id/lessons', authenticate, authorize([Role.ADMIN]), (req, res) => courseController.addLesson(req, res));
/**
 * @openapi
 * /api/courses/{slug}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get course details by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details retrieved
 */
router.get('/:slug', (req, res) => courseController.getCourse(req, res));

export default router;
