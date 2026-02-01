import { Request, Response } from 'express';
import * as PricingAddOnService from './pricing-addons.service';

export const list = async (req: Request, res: Response) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const addOns = await PricingAddOnService.listPricingAddOns(includeInactive);
        res.json(addOns);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const addOn = await PricingAddOnService.getPricingAddOn(id);
        if (!addOn) return res.status(404).json({ message: 'Add-on not found' });
        res.json(addOn);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const addOn = await PricingAddOnService.createPricingAddOn(req.body);
        res.status(201).json(addOn);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const addOn = await PricingAddOnService.updatePricingAddOn(id, req.body);
        res.json(addOn);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await PricingAddOnService.deletePricingAddOn(id);
        res.json({ message: 'Add-on deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const reorder = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: 'ids must be an array' });
        }
        await PricingAddOnService.reorderPricingAddOns(ids);
        res.json({ message: 'Reordered successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
