import { Request, Response } from 'express';
import * as MentoringService from './mentoring.service';
import { AuthRequest } from '../../../middleware/auth.middleware';

export const book = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const session = await MentoringService.bookSession(userId, req.body);
        res.status(201).json(session);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getSchedule = async (req: Request, res: Response) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ message: 'Start and end dates required' });

        const sessions = await MentoringService.getAdminSchedule(String(start), String(end));
        res.json(sessions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const mySessions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const sessions = await MentoringService.getUserSessions(userId);
        res.json(sessions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const session = await MentoringService.updateSession(req.params.id as string, req.body);
        res.json(session);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
