import { Event } from '@prisma/client';
import prisma from '../../../config/prisma';

export class EventRepository {
    async create(data: any): Promise<Event> {
        return prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                time: data.time,
                type: data.type,
                link: data.link,
                isActive: data.isActive ?? true
            }
        });
    }

    async update(id: string, data: any): Promise<Event> {
        return prisma.event.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.date !== undefined && { date: new Date(data.date) }),
                ...(data.time !== undefined && { time: data.time }),
                ...(data.type !== undefined && { type: data.type }),
                ...(data.link !== undefined && { link: data.link }),
                ...(data.isActive !== undefined && { isActive: data.isActive })
            }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.event.delete({ where: { id } });
    }

    async findById(id: string): Promise<Event | null> {
        return prisma.event.findUnique({ where: { id } });
    }

    async findAll(options?: { includeInactive?: boolean }): Promise<Event[]> {
        return prisma.event.findMany({
            where: options?.includeInactive ? {} : { isActive: true },
            orderBy: { date: 'asc' }
        });
    }

    async findUpcoming(limit?: number): Promise<Event[]> {
        const now = new Date();
        return prisma.event.findMany({
            where: {
                isActive: true,
                date: { gte: now }
            },
            orderBy: { date: 'asc' },
            ...(limit && { take: limit })
        });
    }
}
