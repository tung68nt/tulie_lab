import { IInstructorRepository } from './interfaces/instructor.repository.interface';
import { Request, Response } from 'express'; // Added import for Request and Response

export class InstructorService {
    constructor(private instructorRepository: IInstructorRepository) { }

    async getAllInstructors() {
        return this.instructorRepository.findAll();
    }

    async getInstructorById(id: string) {
        return this.instructorRepository.findById(id);
    }

    // The following methods are typically found in a controller, not a service.
    // They are added here as per the user's instruction, but note that `this.instructorService`
    // would refer to the current instance of InstructorService, leading to a circular call
    // or an undefined property if not handled correctly in a controller context.
    // Also, `Request` and `Response` types are imported from 'express'.

    async getById(req: Request, res: Response) {
        try {
            // This line assumes 'this' refers to a controller instance that has an 'instructorService' property.
            // In the context of InstructorService, 'this.instructorService' is incorrect.
            // Assuming the intent was to call the service's own method:
            const instructor = await this.getInstructorById(req.params.id as string);
            if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
            res.json(instructor);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // Assuming the intent was to call the service's own method:
            const instructor = await this.createInstructor(req.body);
            res.status(201).json(instructor);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            // Assuming the intent was to call the service's own method:
            const instructor = await this.updateInstructor(req.params.id as string, req.body);
            res.json(instructor);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            // Assuming the intent was to call the service's own method:
            await this.deleteInstructor(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async createInstructor(data: any) {
        return (this.instructorRepository as any).create(data);
    }

    async updateInstructor(id: string, data: any) {
        return (this.instructorRepository as any).update(id, data);
    }

    async deleteInstructor(id: string) {
        return (this.instructorRepository as any).delete(id);
    }
}
