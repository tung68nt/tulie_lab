import { PrismaClient, Whiteboard, Artboard, WhiteboardStatus } from '@prisma/client';
import { IWhiteboardRepository } from '../interfaces/whiteboard.repository.interface';

const prisma = new PrismaClient();

export class PrismaWhiteboardRepository implements IWhiteboardRepository {
    async create(data: { creatorId: string; title?: string; description?: string }): Promise<Whiteboard> {
        return prisma.whiteboard.create({
            data: {
                ...data,
                artboards: {
                    create: {
                        order: 0,
                        name: 'Artboard 1',
                    }
                }
            }
        });
    }

    async findById(id: string): Promise<Whiteboard | null> {
        return prisma.whiteboard.findUnique({
            where: { id },
            include: {
                artboards: {
                    orderBy: { order: 'asc' }
                },
                creator: {
                    select: { id: true, email: true }
                }
            }
        });
    }

    async findByCreatorId(creatorId: string): Promise<Whiteboard[]> {
        return prisma.whiteboard.findMany({
            where: { creatorId, deletedAt: null },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async update(id: string, data: { title?: string; description?: string; status?: WhiteboardStatus; thumbnail?: string }): Promise<Whiteboard> {
        return prisma.whiteboard.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Whiteboard> {
        return prisma.whiteboard.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    async createArtboard(whiteboardId: string, data: { name?: string; order: number }): Promise<Artboard> {
        return prisma.artboard.create({
            data: {
                whiteboardId,
                ...data
            }
        });
    }

    async updateArtboard(id: string, elements: any): Promise<any> {
        // Validation: Prevent corrupted data from being saved
        if (elements === '[object Object]') {
            console.error('CRITICAL: Attempted to save [object Object] to artboard', id);
            throw new Error('Invalid data payload (serialization error)');
        }

        // Defensive Serialization: Ensure we store a valid JSON string
        // This prevents implicit .toString() issues if the DB column type is mismatched/text
        const payload = typeof elements === 'string' ? elements : JSON.stringify(elements);

        return prisma.artboard.update({
            where: { id },
            data: { elements: payload }
        });
    }

    async getArtboards(whiteboardId: string): Promise<any[]> {
        return prisma.artboard.findMany({
            where: { whiteboardId },
            orderBy: { order: 'asc' }
        });
    }

    async createHistory(data: any): Promise<any> {
        return (prisma as any).whiteboardHistory.create({ data });
    }
}
