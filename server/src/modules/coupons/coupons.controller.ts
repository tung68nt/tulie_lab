import { Request, Response } from 'express';
import * as CouponService from './coupons.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const validate = async (req: Request, res: Response) => {
    try {
        const { code, amount } = req.body;
        const userId = (req as AuthRequest).user?.id;

        if (!code || amount === undefined) {
            return res.status(400).json({ message: 'Code and amount are required' });
        }

        const result = await CouponService.validateCoupon(code, amount, userId);
        res.json({
            valid: true,
            coupon: result,
            discountAmount: result.discountAmount
        });
    } catch (error: any) {
        res.status(400).json({ valid: false, message: error.message });
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        // Simple admin check based on route protection, or passed flag
        // The service takes 'isAdmin'. We can rely on middleware protection for the /manage route
        // and public route logic for public list (if any).
        // For now, let's assume this controller is used for Admin List.
        const coupons = await CouponService.listCoupons(true);
        res.json(coupons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const coupon = await CouponService.createCoupon(req.body);
        res.status(201).json(coupon);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const coupon = await CouponService.getCoupon(id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const coupon = await CouponService.updateCoupon(id, req.body);
        res.json(coupon);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await CouponService.deleteCoupon(id);
        res.json({ message: 'Coupon deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
