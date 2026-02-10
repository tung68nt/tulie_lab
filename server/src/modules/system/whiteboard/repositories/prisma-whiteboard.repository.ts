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
        const boards = await prisma.whiteboard.findMany({
            where: { creatorId, deletedAt: null },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { artboards: true }
                }
            }
        });
        console.log(`[PrismaWhiteboardRepository] findByCreatorId(${creatorId}): found ${boards.length} boards`);
        return boards;
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
        // Validation: Prevent corrupted data from being saved (simple check)
        if (!elements) {
            throw new Error('Invalid data payload: elements are missing');
        }

        // Prisma handles JSON serialization automatically for Json types
        // We pass the object/array directly

        // CRITICAL: We also need to update the parent Whiteboard's updatedAt field
        // so that it moves to the top of the list.
        const artboard = await prisma.artboard.update({
            where: { id },
            data: {
                elements,
                whiteboard: {
                    update: {
                        updatedAt: new Date()
                    }
                }
            }
        });

        return artboard;
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
