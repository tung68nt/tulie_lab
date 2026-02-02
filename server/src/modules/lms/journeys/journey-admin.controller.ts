import { Request, Response } from 'express';
import * as adminService from './journey-admin.service';
import { SubmissionStatus } from '@prisma/client';

// ============== SUBMISSION REVIEW ==============

export async function listPendingSubmissions(req: Request, res: Response) {
    try {
        const journeyId = req.query.journeyId as string | undefined;
        const status = req.query.status as SubmissionStatus | undefined;
        const limitStr = req.query.limit as string | undefined;
        const limit = limitStr ? parseInt(limitStr) : undefined;

        const submissions = await adminService.listPendingSubmissions({
            journeyId,
            status,
            limit,
        });
        res.json(submissions);
    } catch (error: any) {
        console.error('List submissions error:', error);
        res.status(500).json({ error: 'Failed to list submissions' });
    }
}

export async function getSubmissionDetail(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        if (!id) {
            return res.status(400).json({ error: 'Submission ID is required' });
        }
        const submission = await adminService.getSubmissionDetail(id);

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json(submission);
    } catch (error: any) {
        console.error('Get submission error:', error);
        res.status(500).json({ error: 'Failed to get submission' });
    }
}

export async function reviewSubmission(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        if (!id) {
            return res.status(400).json({ error: 'Submission ID is required' });
        }
        const { status, feedback } = req.body;
        const reviewerId = (req as any).user.id;

        if (!status || !Object.values(SubmissionStatus).includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        const updated = await adminService.reviewSubmission(id, {
            status,
            feedback,
            reviewerId,
        });

        res.json(updated);
    } catch (error: any) {
        console.error('Review submission error:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to review submission' });
    }
}

// ============== STUDENT PROGRESS DASHBOARD ==============

export async function getStudentProgressDashboard(req: Request, res: Response) {
    try {
        const journeyId = req.params.id as string;
        if (!journeyId) {
            return res.status(400).json({ error: 'Journey ID is required' });
        }
        const dashboard = await adminService.getStudentProgressDashboard(journeyId);

        if (!dashboard) {
            return res.status(404).json({ error: 'Journey not found' });
        }

        res.json(dashboard);
    } catch (error: any) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ error: 'Failed to get dashboard' });
    }
}
