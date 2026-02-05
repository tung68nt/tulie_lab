import { Request, Response } from 'express';
import { WhiteboardService } from './whiteboard.service';

export class WhiteboardController {
    constructor(private whiteboardService: WhiteboardService) { }

    create = async (req: Request, res: Response) => {
        try {
            const { title, description } = req.body;
            const creatorId = (req as any).user.id;
            const whiteboard = await this.whiteboardService.createWhiteboard(creatorId, title, description);
            res.status(201).json(whiteboard);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const whiteboard = await this.whiteboardService.getWhiteboard(id);
            if (!whiteboard) return res.status(404).json({ message: 'Whiteboard not found' });
            res.json(whiteboard);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getMyWhiteboards = async (req: Request, res: Response) => {
        try {
            const creatorId = (req as any).user.id;
            const whiteboards = await this.whiteboardService.getMyWhiteboards(creatorId);
            res.json(whiteboards);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const whiteboard = await this.whiteboardService.updateWhiteboard(id, req.body);
            res.json(whiteboard);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.whiteboardService.deleteWhiteboard(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    saveArtboardState = async (req: Request, res: Response) => {
        try {
            const artboardId = req.params.artboardId as string;
            const { elements } = req.body;
            const result = await this.whiteboardService.saveArtboardState(artboardId, elements);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    saveSnapshot = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { artboardId, elements } = req.body;
            const userId = (req as any).user.id;
            const result = await this.whiteboardService.saveSnapshot(id, artboardId, elements, userId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    addArtboard = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { name } = req.body;
            const artboard = await this.whiteboardService.addArtboard(id, name);
            res.status(201).json(artboard);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
