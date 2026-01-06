import { Request, Response } from 'express';
import * as SettingsService from './settings.service';

// Public endpoints (restricted keys)
export const getPublicSettings = async (req: Request, res: Response) => {
    try {
        // Only return safe public keys
        const publicKeys = [
            'contact_hotline', 'contact_zalo', 'contact_email_public',
            'site_logo', 'site_name', 'site_favicon', 'show_site_name',
            'bank_name', 'bank_account_no', 'bank_account_name', 'payment_transfer_syntax'
        ];
        const settings = await SettingsService.getSettings(publicKeys);
        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin endpoints
export const list = async (req: Request, res: Response) => {
    try {
        const settings = await SettingsService.getSettings();
        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const settings = req.body; // { key: value, key2: value2 }
        await SettingsService.updateSettings(settings);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const regenerateApiKey = async (req: Request, res: Response) => {
    try {
        const apiKey = await SettingsService.generateApiKey();
        res.json({ success: true, apiKey });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getApiKey = async (req: Request, res: Response) => {
    try {
        const apiKey = await SettingsService.getApiKey();
        res.json({ apiKey: apiKey || null });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
