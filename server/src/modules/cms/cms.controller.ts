import { Request, Response } from 'express';
import * as CMSService from './cms.service';

export const getSettings = async (req: Request, res: Response) => {
    try {
        const keys = req.query.keys ? (req.query.keys as string).split(',') : undefined;
        const settings = await CMSService.getSettings(keys);
        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSetting = async (req: Request, res: Response) => {
    try {
        const { key, value, type } = req.body;
        if (!key || value === undefined) {
            return res.status(400).json({ message: 'Key and value are required' });
        }

        const setting = await CMSService.updateSetting(key, value, type);
        res.json(setting);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
