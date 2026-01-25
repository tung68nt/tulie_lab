import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { LandingPageService } from './landing-pages.service';

export class LandingPageController {
    private get landingPageService(): LandingPageService {
        return container.resolve<LandingPageService>('LandingPageService');
    }

    async create(req: Request, res: Response) {
        try {
            const page = await this.landingPageService.createLandingPage(req.body);
            res.status(201).json(page);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const page = await this.landingPageService.updateLandingPage(req.params.id as string, req.body);
            res.json(page);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBySlug(req: Request, res: Response) {
        try {
            const page = await this.landingPageService.getLandingPageBySlug(req.params.slug as string);
            if (!page) return res.status(404).json({ error: 'Landing page not found' });
            res.json(page);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const page = await this.landingPageService.getLandingPageById(req.params.id as string);
            if (!page) return res.status(404).json({ error: 'Landing page not found' });
            res.json(page);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { type } = req.query;
            const pages = await this.landingPageService.findAll({ type: type as string });
            res.json(pages.data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.landingPageService.deleteLandingPage(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async duplicate(req: Request, res: Response) {
        try {
            const page = await this.landingPageService.duplicateLandingPage(req.params.id as string);
            res.status(201).json(page);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async setHomepage(req: Request, res: Response) {
        try {
            const page = await this.landingPageService.setAsHomepage(req.params.id as string);
            res.json(page);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const landingPageController = new LandingPageController();
