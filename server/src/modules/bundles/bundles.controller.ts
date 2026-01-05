import { Request, Response } from 'express';
import * as BundleService from './bundles.service';

export const list = async (req: Request, res: Response) => {
    try {
        // userId from optional auth (if user logged in to see upsell prices)
        const userId = (req as any).user?.id;
        const bundles = await BundleService.listBundles(false, userId);
        res.json(bundles);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const listAdmin = async (req: Request, res: Response) => {
    try {
        const bundles = await BundleService.listBundles(true);
        res.json(bundles);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const bundle = await BundleService.getBundle(id);
        if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
        res.json(bundle);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        console.log('Create Bundle:', req.body);
        const bundle = await BundleService.createBundle(req.body);
        res.status(201).json(bundle);
    } catch (error: any) {
        console.error('Create Bundle Error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const bundle = await BundleService.updateBundle(id, req.body);
        res.json(bundle);
    } catch (error: any) {
        console.error('Update Bundle Error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await BundleService.deleteBundle(id);
        res.json({ message: 'Bundle deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
