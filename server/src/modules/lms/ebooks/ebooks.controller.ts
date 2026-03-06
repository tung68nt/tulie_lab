import { Request, Response, NextFunction } from "express";
import * as ebooksService from "./ebooks.service";

// ============================================
// ADMIN CONTROLLERS
// ============================================

export const getAdminEbooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { keyword, page = 1, limit = 20 } = req.query;
        const result = await ebooksService.getAdminEbooks({
            keyword: keyword as string,
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
        });
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

export const getAdminEbookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await ebooksService.getAdminEbookById(id);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const createEbook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ebookData = req.body;
        const result = await ebooksService.createEbook(ebookData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const updateEbook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const ebookData = req.body;
        const result = await ebooksService.updateEbook(id, ebookData);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const deleteEbook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await ebooksService.deleteEbook(id);
        res.json({ success: true, message: "Xóa Ebook thành công." });
    } catch (error) {
        next(error);
    }
};

// ============================================
// PUBLIC & USER CONTROLLERS
// ============================================

export const getEbookBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const result = await ebooksService.getEbookBySlug(slug);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const checkEbookAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId; // Assuming `isAuth` middleware sets `req.user.userId`

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const accessInfo = await ebooksService.checkAndGetPresignedUrl(id, userId);

        res.json({ success: true, data: accessInfo });
    } catch (error) {
        next(error);
    }
};
