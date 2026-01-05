import { Request, Response } from 'express';
import * as ContactService from './contact.service';

// Public
export const submit = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await ContactService.createSubmission({ name, email, phone, message });
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin
export const list = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;

        const result = await ContactService.getSubmissions(page, limit, search);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) return res.status(400).json({ message: 'Missing ID' });

        const result = await ContactService.updateStatus(id, status);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing ID' });

        await ContactService.deleteSubmission(id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
