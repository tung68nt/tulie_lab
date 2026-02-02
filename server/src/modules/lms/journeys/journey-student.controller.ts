import { Request, Response } from 'express';
import * as studentService from './journey-student.service';

// ============== PUBLIC JOURNEY ROUTES ==============

export async function listAvailableJourneys(req: Request, res: Response) {
    try {
        const journeys = await studentService.listAvailableJourneys();
        res.json(journeys);
    } catch (error: any) {
        console.error('List journeys error:', error);
        res.status(500).json({ error: 'Failed to list journeys' });
    }
}

export async function getJourneyDetail(req: Request, res: Response) {
    try {
        const slug = req.params.slug as string;
        const userId = (req as any).user?.id as string | undefined;
        const result = await studentService.getJourneyDetailForStudent(slug, userId);

        if (!result) {
            return res.status(404).json({ error: 'Journey not found' });
        }

        res.json(result);
    } catch (error: any) {
        console.error('Get journey detail error:', error);
        res.status(500).json({ error: 'Failed to get journey' });
    }
}

// ============== AUTHENTICATED ROUTES ==============

export async function enrollInJourney(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id as string;
        const journeyId = req.params.id as string;

        const result = await studentService.enrollInJourney(userId, journeyId);

        if (result.alreadyEnrolled) {
            return res.json({ message: 'Already enrolled', enrollment: result.enrollment });
        }

        res.status(201).json({ message: 'Enrolled successfully', enrollment: result.enrollment });
    } catch (error: any) {
        console.error('Enroll error:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to enroll' });
    }
}

export async function getMyProgress(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id as string;
        const journeyId = req.params.id as string;

        const progress = await studentService.getMyProgress(userId, journeyId);

        if (!progress) {
            return res.status(404).json({ error: 'Not enrolled in this journey' });
        }

        res.json(progress);
    } catch (error: any) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Failed to get progress' });
    }
}

export async function listMyJourneys(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id as string;
        const journeys = await studentService.listMyJourneys(userId);
        res.json(journeys);
    } catch (error: any) {
        console.error('List my journeys error:', error);
        res.status(500).json({ error: 'Failed to list journeys' });
    }
}

export async function submitStep(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id as string;
        const journeyId = req.params.id as string;
        const stepId = req.params.stepId as string;
        const { submissionType, content, fileName } = req.body;

        if (!submissionType || !content) {
            return res.status(400).json({ error: 'submissionType and content are required' });
        }

        const submission = await studentService.submitStep(userId, journeyId, stepId, {
            submissionType,
            content,
            fileName,
        });

        res.status(201).json(submission);
    } catch (error: any) {
        console.error('Submit step error:', error);
        if (error.message.includes('Not enrolled') || error.message.includes('not found') || error.message.includes('locked')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to submit' });
    }
}
