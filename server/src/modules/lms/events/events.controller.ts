import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { EventService } from './events.service';

export class EventController {
    private get eventService(): EventService {
        return container.resolve<EventService>('EventService');
    }

    async create(req: Request, res: Response) {
        try {
            const event = await this.eventService.createEvent(req.body);
            res.status(201).json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ error: 'Valid Event ID is required' });
            }
            const event = await this.eventService.updateEvent(id, req.body);
            res.json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ error: 'Valid Event ID is required' });
            }
            await this.eventService.deleteEvent(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ error: 'Valid Event ID is required' });
            }
            const event = await this.eventService.getEventById(id);
            if (!event) return res.status(404).json({ error: 'Event not found' });
            res.json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const includeInactive = req.query.includeInactive === 'true';
            const events = await this.eventService.getAllEvents(includeInactive);
            res.json(events);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async listUpcoming(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const events = await this.eventService.getUpcomingEvents(limit);
            res.json(events);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const eventController = new EventController();
