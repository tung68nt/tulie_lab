import { Request, Response } from 'express';
import * as journeyService from './journey.service';

// ============== JOURNEY CRUD ==============

export async function listJourneys(req: Request, res: Response) {
    try {
        const isPublished = req.query.isPublished as string | undefined;
        const courseId = req.query.courseId as string | undefined;
        const journeys = await journeyService.listJourneys({
            isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined,
            courseId,
        });
        res.json(journeys);
    } catch (error: any) {
        console.error('List journeys error:', error);
        res.status(500).json({ error: 'Failed to list journeys' });
    }
}

export async function getJourney(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const journey = await journeyService.getJourneyById(id);
        if (!journey) {
            return res.status(404).json({ error: 'Journey not found' });
        }
        res.json(journey);
    } catch (error: any) {
        console.error('Get journey error:', error);
        res.status(500).json({ error: 'Failed to get journey' });
    }
}

export async function createJourney(req: Request, res: Response) {
    try {
        const journey = await journeyService.createJourney(req.body);
        res.status(201).json(journey);
    } catch (error: any) {
        console.error('Create journey error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create journey' });
    }
}

export async function updateJourney(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const journey = await journeyService.updateJourney(id, req.body);
        res.json(journey);
    } catch (error: any) {
        console.error('Update journey error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Journey not found' });
        }
        res.status(500).json({ error: 'Failed to update journey' });
    }
}

export async function deleteJourney(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        await journeyService.deleteJourney(id);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Delete journey error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Journey not found' });
        }
        res.status(500).json({ error: 'Failed to delete journey' });
    }
}

// ============== STEP CRUD ==============

export async function createStep(req: Request, res: Response) {
    try {
        const journeyId = req.params.id as string;
        const step = await journeyService.createStep({ ...req.body, journeyId });
        res.status(201).json(step);
    } catch (error: any) {
        console.error('Create step error:', error);
        res.status(500).json({ error: 'Failed to create step' });
    }
}

export async function updateStep(req: Request, res: Response) {
    try {
        const stepId = req.params.stepId as string;
        const step = await journeyService.updateStep(stepId, req.body);
        res.json(step);
    } catch (error: any) {
        console.error('Update step error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Step not found' });
        }
        res.status(500).json({ error: 'Failed to update step' });
    }
}

export async function deleteStep(req: Request, res: Response) {
    try {
        const stepId = req.params.stepId as string;
        await journeyService.deleteStep(stepId);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Delete step error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Step not found' });
        }
        res.status(500).json({ error: 'Failed to delete step' });
    }
}

export async function reorderSteps(req: Request, res: Response) {
    try {
        const journeyId = req.params.id as string;
        const { stepIds } = req.body;
        if (!Array.isArray(stepIds)) {
            return res.status(400).json({ error: 'stepIds must be an array' });
        }
        await journeyService.reorderSteps(journeyId, stepIds);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Reorder steps error:', error);
        res.status(500).json({ error: 'Failed to reorder steps' });
    }
}

// ============== ENROLLMENT QUERIES ==============

export async function getJourneyEnrollments(req: Request, res: Response) {
    try {
        const journeyId = req.params.id as string;
        const enrollments = await journeyService.getJourneyEnrollments(journeyId);
        res.json(enrollments);
    } catch (error: any) {
        console.error('Get enrollments error:', error);
        res.status(500).json({ error: 'Failed to get enrollments' });
    }
}

export async function getEnrollmentStats(req: Request, res: Response) {
    try {
        const journeyId = req.params.id as string;
        const stats = await journeyService.getEnrollmentStats(journeyId);
        res.json(stats);
    } catch (error: any) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
}
