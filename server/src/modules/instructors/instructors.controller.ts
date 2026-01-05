import { Request, Response } from 'express';
import * as InstructorService from './instructors.service';

export const list = async (req: Request, res: Response) => {
    try {
        const instructors = await InstructorService.listInstructors();
        res.json(instructors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing instructor ID' });
        const instructor = await InstructorService.getInstructor(id);
        if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
        res.json(instructor);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const instructor = await InstructorService.createInstructor(req.body);
        res.status(201).json(instructor);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing instructor ID' });
        const instructor = await InstructorService.updateInstructor(id, req.body);
        res.json(instructor);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Missing instructor ID' });
        await InstructorService.deleteInstructor(id);
        res.json({ message: 'Instructor deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
