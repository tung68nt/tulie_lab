import { Router } from 'express';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import * as journeyController from './journey.controller';
import * as studentController from './journey-student.controller';
import * as adminController from './journey-admin.controller';

const router = Router();

const requireAdmin = authorize([Role.ADMIN]);

// =============================================================================
// PUBLIC ROUTES (optional auth for enrollment check)
// =============================================================================

// List available journeys (public)
router.get('/journeys', studentController.listAvailableJourneys);

// Get journey detail by slug (public, but shows enrollment if authenticated)
router.get('/journeys/:slug', studentController.getJourneyDetail);

// =============================================================================
// AUTHENTICATED STUDENT ROUTES
// =============================================================================

// List my enrolled journeys
router.get('/my-journeys', authenticate, studentController.listMyJourneys);

// Enroll in a journey
router.post('/journeys/:id/enroll', authenticate, studentController.enrollInJourney);

// Get my progress in a journey
router.get('/journeys/:id/progress', authenticate, studentController.getMyProgress);

// Submit step work
router.post('/journeys/:id/steps/:stepId/submit', authenticate, studentController.submitStep);

// =============================================================================
// ADMIN ROUTES - Journey CRUD
// =============================================================================

// List all journeys (admin)
router.get('/admin/journeys', authenticate, requireAdmin, journeyController.listJourneys);

// Create journey
router.post('/admin/journeys', authenticate, requireAdmin, journeyController.createJourney);

// Get journey by ID
router.get('/admin/journeys/:id', authenticate, requireAdmin, journeyController.getJourney);

// Update journey
router.put('/admin/journeys/:id', authenticate, requireAdmin, journeyController.updateJourney);

// Delete journey
router.delete('/admin/journeys/:id', authenticate, requireAdmin, journeyController.deleteJourney);

// =============================================================================
// ADMIN ROUTES - Step CRUD
// =============================================================================

// Create step
router.post('/admin/journeys/:id/steps', authenticate, requireAdmin, journeyController.createStep);

// Update step
router.put('/admin/journeys/:id/steps/:stepId', authenticate, requireAdmin, journeyController.updateStep);

// Delete step
router.delete('/admin/journeys/:id/steps/:stepId', authenticate, requireAdmin, journeyController.deleteStep);

// Reorder steps
router.put('/admin/journeys/:id/steps/reorder', authenticate, requireAdmin, journeyController.reorderSteps);

// =============================================================================
// ADMIN ROUTES - Enrollments & Submissions
// =============================================================================

// Get journey enrollments
router.get('/admin/journeys/:id/enrollments', authenticate, requireAdmin, journeyController.getJourneyEnrollments);

// Get journey stats
router.get('/admin/journeys/:id/stats', authenticate, requireAdmin, journeyController.getEnrollmentStats);

// Get student progress dashboard
router.get('/admin/journeys/:id/dashboard', authenticate, requireAdmin, adminController.getStudentProgressDashboard);

// List pending submissions (all journeys or filtered)
router.get('/admin/submissions', authenticate, requireAdmin, adminController.listPendingSubmissions);

// Get submission detail
router.get('/admin/submissions/:id', authenticate, requireAdmin, adminController.getSubmissionDetail);

// Review submission (approve/reject)
router.put('/admin/submissions/:id/review', authenticate, requireAdmin, adminController.reviewSubmission);

export default router;
