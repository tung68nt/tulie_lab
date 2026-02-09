import { IWhiteboardRepository } from './interfaces/whiteboard.repository.interface';
import { WhiteboardStatus } from '@prisma/client';
import prisma from '../../../config/prisma';

export class WhiteboardService {
    constructor(private whiteboardRepository: IWhiteboardRepository) { }

    async createWhiteboard(creatorId: string, title?: string, description?: string) {
        const data: { creatorId: string; title?: string; description?: string } = { creatorId };
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        return this.whiteboardRepository.create(data);
    }

    async getWhiteboard(id: string, requesterId: string) {
        const whiteboard = await this.whiteboardRepository.findById(id);
        if (whiteboard && whiteboard.creatorId !== requesterId) {
            throw new Error('Access denied: You do not own this whiteboard.');
        }
        return whiteboard;
    }

    async getMyWhiteboards(creatorId: string) {
        return this.whiteboardRepository.findByCreatorId(creatorId);
    }

    async updateWhiteboard(id: string, requesterId: string, data: { title?: string | undefined; description?: string | undefined; status?: WhiteboardStatus | undefined; thumbnail?: string | undefined }) {
        const whiteboard = await this.whiteboardRepository.findById(id);
        if (!whiteboard || whiteboard.creatorId !== requesterId) {
            throw new Error('Access denied: You do not own this whiteboard.');
        }

        // Filter out undefined values to satisfy exactOptionalPropertyTypes
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;

        return this.whiteboardRepository.update(id, updateData);
    }

    async deleteWhiteboard(id: string, requesterId: string) {
        const whiteboard = await this.whiteboardRepository.findById(id);
        if (!whiteboard || whiteboard.creatorId !== requesterId) {
            throw new Error('Access denied: You do not own this whiteboard.');
        }
        return this.whiteboardRepository.delete(id);
    }

    async saveArtboardState(artboardId: string, elements: any, requesterId: string) {
        const artboard = await (prisma as any).artboard.findUnique({
            where: { id: artboardId },
            include: { whiteboard: true }
        });

        if (!artboard || artboard.whiteboard.creatorId !== requesterId) {
            throw new Error('Access denied: You do not own this whiteboard.');
        }

        return this.whiteboardRepository.updateArtboard(artboardId, elements);
    }

    async addArtboard(whiteboardId: string, requesterId: string, name?: string) {
        const whiteboard = await this.whiteboardRepository.findById(whiteboardId);
        if (!whiteboard || whiteboard.creatorId !== requesterId) {
            throw new Error('Access denied: You do not own this whiteboard.');
        }

        const artboards = await this.whiteboardRepository.getArtboards(whiteboardId);
        const nextOrder = artboards.length;
        const data: { name?: string; order: number } = { order: nextOrder };
        if (name !== undefined) data.name = name;
        return this.whiteboardRepository.createArtboard(whiteboardId, data);
    }

    async saveSnapshot(whiteboardId: string, artboardId: string, elements: any, userId: string) {
        const whiteboard = await this.whiteboardRepository.findById(whiteboardId);
        if (!whiteboard || whiteboard.creatorId !== userId) {
            throw new Error('Access denied: You do not own this whiteboard.');
        }

        return this.whiteboardRepository.createHistory({
            whiteboardId,
            artboardId,
            elements,
            createdById: userId
        });
    }

    async getAdminStats() {
        const [totalBoards, totalArtboards, usersWithBoards] = await Promise.all([
            prisma.whiteboard.count({ where: { deletedAt: null } }),
            prisma.artboard.count(),
            prisma.whiteboard.groupBy({
                by: ['creatorId'],
                _count: { id: true },
            })
        ]);

        // Optimized Storage Calculation using Database Sum
        // This avoids loading all elements into memory, which would crash the server
        const storageUsage = await prisma.$queryRaw<{ total_size: number }[]>`
            SELECT COALESCE(SUM(LENGTH(elements::text)), 0) as total_size 
            FROM artboards 
            WHERE elements IS NOT NULL
        `;

        const totalSize = Number(storageUsage[0]?.total_size || 0);

        const topUsers = await Promise.all(
            usersWithBoards
                .sort((a: any, b: any) => (b._count?.id || 0) - (a._count?.id || 0))
                .slice(0, 10)
                .map(async (u: any) => {
                    const user = await prisma.user.findUnique({
                        where: { id: u.creatorId },
                        select: {
                            email: true,
                            profile: {
                                select: { name: true }
                            }
                        }
                    });
                    return {
                        id: u.creatorId,
                        name: user?.profile?.name || 'Unknown',
                        email: user?.email || 'N/A',
                        boardCount: u._count.id
                    };
                })
        );

        return {
            totalBoards,
            totalArtboards,
            totalUsers: usersWithBoards.length,
            totalStorageBytes: totalSize,
            topUsers,
            updatedAt: new Date().toISOString()
        };
    }
}
