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

    async getWhiteboard(id: string) {
        return this.whiteboardRepository.findById(id);
    }

    async getMyWhiteboards(creatorId: string) {
        return this.whiteboardRepository.findByCreatorId(creatorId);
    }

    async updateWhiteboard(id: string, data: { title?: string; description?: string; status?: WhiteboardStatus; thumbnail?: string }) {
        return this.whiteboardRepository.update(id, data);
    }

    async deleteWhiteboard(id: string) {
        return this.whiteboardRepository.delete(id);
    }

    async saveArtboardState(artboardId: string, elements: any) {
        return this.whiteboardRepository.updateArtboard(artboardId, elements);
    }

    async addArtboard(whiteboardId: string, name?: string) {
        const artboards = await this.whiteboardRepository.getArtboards(whiteboardId);
        const nextOrder = artboards.length;
        const data: { name?: string; order: number } = { order: nextOrder };
        if (name !== undefined) data.name = name;
        return this.whiteboardRepository.createArtboard(whiteboardId, data);
    }

    async saveSnapshot(whiteboardId: string, artboardId: string, elements: any, userId: string) {
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

        // Get storage estimation (elements size)
        const storageUsage = await prisma.artboard.findMany({
            select: { elements: true }
        });

        const totalSize = storageUsage.reduce((acc, art) => {
            if (!art.elements) return acc;
            return acc + JSON.stringify(art.elements).length;
        }, 0);

        const topUsers = await Promise.all(
            usersWithBoards
                .sort((a, b) => b._count.id - a._count.id)
                .slice(0, 10)
                .map(async (u) => {
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
