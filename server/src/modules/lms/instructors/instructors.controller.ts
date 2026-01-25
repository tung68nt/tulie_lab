import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { InstructorService } from './instructors.service';

export class InstructorController {
    private get instructorService(): InstructorService {
        return container.resolve<InstructorService>('InstructorService');
    }

    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 100;
            const instructors = await this.instructorService.getAllInstructors(page, limit);
            res.json({
                data: instructors.data,
                meta: instructors.meta
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const instructor = await this.instructorService.getInstructorById(req.params.id as string);
            if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
            res.json(instructor);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const instructor = await this.instructorService.createInstructor(req.body);
            res.status(201).json(instructor);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const instructor = await this.instructorService.updateInstructor(req.params.id as string, req.body);
            res.json(instructor);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.instructorService.deleteInstructor(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export const instructorController = new InstructorController();
