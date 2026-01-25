import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { ContactService } from './contact.service';

export class ContactController {
    private get contactService(): ContactService {
        return container.resolve<ContactService>('ContactService');
    }

    async create(req: Request, res: Response) {
        try {
            const submission = await this.contactService.createSubmission(req.body);
            res.status(201).json(submission);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async subscribeNewsletter(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: 'Email is required' });

            await this.contactService.subscribeNewsletter(email);
            res.json({ message: 'Subscribed successfully' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const search = req.query.search as string;
            const result = await this.contactService.getSubmissions(page, limit, search);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const submission = await this.contactService.updateStatus(req.params.id as string, req.body.status);
            res.json(submission);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.contactService.deleteSubmission(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export const contactController = new ContactController();
