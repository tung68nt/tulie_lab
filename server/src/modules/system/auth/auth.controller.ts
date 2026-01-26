import { Request, Response } from 'express';
import { container } from '../../../core/container';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class AuthController {
    private get authService(): AuthService {
        return container.resolve<AuthService>('AuthService');
    }

    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Email, password, and name are required' });
            }
            const result = await this.authService.register(email, password, name);

            // Set Cookie
            this.setTokenCookie(res, result.token);

            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const result = await this.authService.login(email, password);

            // Set Cookie
            this.setTokenCookie(res, result.token);

            res.json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        const isProd = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax'
        });
        res.json({ message: 'Logged out successfully' });
    }

    private setTokenCookie(res: Response, token: string) {
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd, // true in production
            sameSite: isProd ? 'none' : 'lax', // 'none' for cross-domain (frontend on Vercel, backend on Cloud Run), 'lax' for same domain
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }

    async me(req: Request, res: Response) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) return res.status(401).json({ message: 'Not authenticated' });

            const userData = await this.authService.getUserById(user.id);
            if (!userData) return res.status(401).json({ message: 'User not found' });

            res.json(userData);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: 'Email is required' });
            await this.authService.sendPasswordResetEmail(email);
            res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(400).json({ message: 'Token and new password are required' });
            }
            await this.authService.resetPassword(token, newPassword);
            res.json({ message: 'Password has been reset successfully.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            const { url } = await this.authService.getGoogleAuthUrl();
            res.json({ url });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async verifyGoogleToken(req: Request, res: Response) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }
            const result = await this.authService.verifyGoogleToken(token);

            // Set Cookie
            this.setTokenCookie(res, result.token);

            res.json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}

export const authController = new AuthController();
