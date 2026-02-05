import { Request, Response } from 'express';
import { ShortLinkService } from './short-link.service';

export class ShortLinkController {
    constructor(private shortLinkService: ShortLinkService) { }

    createShortLink = async (req: Request, res: Response) => {
        try {
            const { code, originalUrl, title } = req.body;
            const userId = (req as any).user?.id;

            if (!originalUrl) {
                return res.status(400).json({ message: 'URL gốc là bắt buộc' });
            }

            const shortLink = await this.shortLinkService.createShortLink({
                code,
                originalUrl,
                title,
                userId
            });

            res.status(201).json(shortLink);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    resolveCode = async (req: Request, res: Response) => {
        try {
            const { code } = req.params;
            if (!code) {
                return res.status(400).json({ message: 'Mã rút gọn là bắt buộc' });
            }
            const shortLink = await this.shortLinkService.resolveCode(code as string);

            if (!shortLink) {
                return res.status(404).json({ message: 'Liên kết không tồn tại' });
            }

            res.json(shortLink);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getAllLinks = async (req: Request, res: Response) => {
        try {
            const links = await this.shortLinkService.getAllLinks();
            res.json(links);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    updateLink = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { originalUrl, title } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID là bắt buộc' });
            }

            const link = await this.shortLinkService.updateLink(id as string, { originalUrl, title });
            res.json(link);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteLink = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'ID là bắt buộc' });
            }
            await this.shortLinkService.deleteLink(id as string);
            res.json({ message: 'Xóa liên kết thành công' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };
}
