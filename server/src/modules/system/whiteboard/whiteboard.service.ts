import { IWhiteboardRepository } from './interfaces/whiteboard.repository.interface';
import { WhiteboardStatus } from '@prisma/client';

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

    async updateWhiteboard(id: string, data: { title?: string; description?: string; status?: WhiteboardStatus }) {
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
}
