import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export interface CrmRequest extends Request {
    apiKeyName?: string;
}

export const crmAuthMiddleware = async (req: CrmRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-crm-api-key'] as string;

    if (!apiKey) {
        return res.status(401).json({ message: 'Missing API Key' });
    }

    try {
        const keyRecord = await prisma.apiKey.findUnique({
            where: { key: apiKey }
        });

        if (!keyRecord || !keyRecord.isActive) {
            return res.status(401).json({ message: 'Invalid or inactive API Key' });
        }

        // Update last used at
        await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { lastUsedAt: new Date() }
        });

        req.apiKeyName = keyRecord.name;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Authentication error' });
    }
};
