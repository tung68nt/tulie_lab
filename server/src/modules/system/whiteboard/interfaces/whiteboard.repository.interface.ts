import { Whiteboard, Artboard, WhiteboardStatus } from '@prisma/client';

export interface IWhiteboardRepository {
    create(data: { creatorId: string; title?: string; description?: string }): Promise<Whiteboard>;
    findById(id: string): Promise<Whiteboard | null>;
    findByCreatorId(creatorId: string): Promise<Whiteboard[]>;
    update(id: string, data: { title?: string; description?: string; status?: WhiteboardStatus; thumbnail?: string }): Promise<Whiteboard>;
    delete(id: string): Promise<Whiteboard>;

    // Artboard operations
    createArtboard(whiteboardId: string, data: { name?: string; order: number }): Promise<Artboard>;
    updateArtboard(id: string, elements: any): Promise<any>;
    getArtboards(whiteboardId: string): Promise<any[]>;
    createHistory(data: { whiteboardId: string; artboardId: string; elements: any; createdById: string }): Promise<any>;
}
