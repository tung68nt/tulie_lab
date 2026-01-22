import { Event } from '@prisma/client';
import { EventRepository } from './events.repository';

export class EventService {
    constructor(private eventRepository: EventRepository) {}

    async createEvent(data: any): Promise<Event> {
        return this.eventRepository.create(data);
    }

    async updateEvent(id: string, data: any): Promise<Event> {
        return this.eventRepository.update(id, data);
    }

    async deleteEvent(id: string): Promise<void> {
        await this.eventRepository.delete(id);
    }

    async getEventById(id: string): Promise<Event | null> {
        return this.eventRepository.findById(id);
    }

    async getAllEvents(includeInactive = false): Promise<Event[]> {
        return this.eventRepository.findAll({ includeInactive });
    }

    async getUpcomingEvents(limit?: number): Promise<Event[]> {
        return this.eventRepository.findUpcoming(limit);
    }
}
