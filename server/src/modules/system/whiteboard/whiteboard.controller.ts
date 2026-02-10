import { Request, Response } from 'express';
import { WhiteboardService } from './whiteboard.service';
import {
    createWhiteboardSchema,
    updateWhiteboardSchema,
    addArtboardSchema,
    saveArtboardSchema
} from './whiteboard.validation';

export class WhiteboardController {
    constructor(private whiteboardService: WhiteboardService) { }

    create = async (req: Request, res: Response) => {
        try {
            console.log('[WhiteboardController] create called by user:', (req as any).user?.id);
            console.log('[WhiteboardController] payload:', req.body);
            const validation = createWhiteboardSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.format()
                });
            }

            const { title, description } = validation.data;
            const creatorId = req.user.id;
            console.log(`[WhiteboardController] CREATE Request - UserID: ${creatorId}, Title: ${title}`);

            const whiteboard = await this.whiteboardService.createWhiteboard(creatorId, title, description);

            console.log(`[WhiteboardController] CREATE Success - New Board ID: ${whiteboard.id}`);
            res.status(201).json(whiteboard);
        } catch (error: any) {
            console.error('[WhiteboardController] create error:', error);
            res.status(500).json({ message: error.message });
        }
    };

    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requesterId = req.user.id;
            const whiteboard = await this.whiteboardService.getWhiteboard(id, requesterId);
            if (!whiteboard) return res.status(404).json({ message: 'Whiteboard not found' });
            res.json(whiteboard);
        } catch (error: any) {
            if (error.message.includes('Access denied')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    };

    getMyWhiteboards = async (req: Request, res: Response) => {
        try {
            const creatorId = (req as any).user?.id;
            console.log(`[WhiteboardController] LIST Request - UserID: ${creatorId}`);

            const whiteboards = await this.whiteboardService.getMyWhiteboards(creatorId);

            console.log(`[WhiteboardController] LIST Success - Found ${whiteboards.length} boards for UserID: ${creatorId}`);
            res.json(whiteboards);
        } catch (error: any) {
            console.error('[WhiteboardController] getMyWhiteboards error:', error);
            res.status(500).json({ message: error.message });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requesterId = req.user.id;
            const validation = updateWhiteboardSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.format()
                });
            }

            const whiteboard = await this.whiteboardService.updateWhiteboard(id, requesterId, {
                title: validation.data.title || undefined,
                description: validation.data.description || undefined,
                status: validation.data.status || undefined,
                thumbnail: validation.data.thumbnail || undefined
            });
            res.json(whiteboard);
        } catch (error: any) {
            if (error.message.includes('Access denied')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requesterId = req.user.id;
            await this.whiteboardService.deleteWhiteboard(id, requesterId);
            res.status(204).send();
        } catch (error: any) {
            if (error.message.includes('Access denied')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    };

    saveArtboardState = async (req: Request, res: Response) => {
        try {
            const artboardId = req.params.artboardId as string;
            const requesterId = req.user.id;
            // console.log('[WhiteboardController] saveArtboardState:', artboardId); // Too noisy usually, but good for debug
            const validation = saveArtboardSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.format()
                });
            }

            // const { elements, appState } = validation.data; // Validation schema might need update if we want to extract
            // For now passing body directly or validation.data
            const result = await this.whiteboardService.saveArtboardState(artboardId, validation.data.elements, requesterId);
            res.json(result);
        } catch (error: any) {
            console.error('[WhiteboardController] saveArtboardState error:', error);
            if (error.message.includes('Access denied')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    };

    saveSnapshot = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { artboardId, elements } = req.body;
            const userId = (req as any).user?.id;
            if (!userId) return res.status(401).json({ message: 'Unauthorized' });

            const result = await this.whiteboardService.saveSnapshot(id, artboardId, elements, userId);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.message.includes('Access denied')) return res.status(403).json({ error: error.message });
            res.status(500).json({ error: error.message });
        }
    };

    addArtboard = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requesterId = (req as any).user?.id;
            if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });

            const validation = addArtboardSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.format()
                });
            }

            const { name } = validation.data;
            const artboard = await this.whiteboardService.addArtboard(id, requesterId, name);
            res.status(201).json(artboard);
        } catch (error: any) {
            if (error.message.includes('Access denied')) return res.status(403).json({ message: error.message });
            res.status(500).json({ message: error.message });
        }
    };

    getAdminStats = async (req: Request, res: Response) => {
        try {
            const stats = await this.whiteboardService.getAdminStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}

