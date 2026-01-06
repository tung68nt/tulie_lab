import type { Request, Response } from 'express';
import * as AuthService from './auth.service';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await AuthService.register(email, password, name);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Registration failed' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        // The user is attached to the request by the middleware (from token)
        const tokenUser = (req as any).user;
        if (!tokenUser || !tokenUser.id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Fetch fresh data from DB to get name, email, etc.
        const user = await AuthService.getUserById(tokenUser.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, hasPassword: !!password }); // DEBUG
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }
        const result = await AuthService.login(email, password);
        console.log('Login success for:', email); // DEBUG

        // Log the login activity
        try {
            const { logActivity } = await import('../activity/activity.service');
            await logActivity({
                userId: result.user.id,
                action: 'login',
                path: '/auth/login',
                ipAddress: req.ip || req.headers['x-forwarded-for']?.toString() || null,
                device: req.headers['user-agent'] || null
            });
        } catch (logErr) {
            console.error('Failed to log login activity:', logErr);
        }

        // Set cookie as well for convenience
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Allow cross-port in dev
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        if (result.user) {
            // Check for Birthday Coupon (Fire and forget, don't await/block login)
            import('../../modules/coupons/coupons.service').then(service => {
                service.checkAndIssueBirthdayCoupon(result.user.id)
                    .catch(err => console.error('Error checking birthday coupon:', err));
            });
        }

        res.json(result);
    } catch (error: any) {
        console.error('Login error:', error.message); // DEBUG
        res.status(401).json({ message: error.message || 'Login failed' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        await AuthService.sendPasswordResetEmail(email);

        // Always return success to prevent email enumeration
        res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        // Still return success to prevent email enumeration
        res.json({ message: 'If the email exists, a reset link has been sent' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        await AuthService.resetPassword(token, password);
        res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Password reset failed' });
    }
};
