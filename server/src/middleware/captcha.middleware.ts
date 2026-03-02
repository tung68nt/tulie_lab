import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

/**
 * Middleware to verify reCAPTCHA v2 token
 */
export const verifyCaptcha = async (req: Request, res: Response, next: NextFunction) => {
    // If we're in development and no secret is provided, skip validation
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (process.env.NODE_ENV !== 'production' && !secretKey) {
        return next();
    }

    if (!secretKey) {
        console.error('RECAPTCHA_SECRET_KEY is missing in environment variables');
        return res.status(500).json({ message: 'Security configuration error' });
    }

    const captchaToken = req.body.captchaToken;

    if (!captchaToken) {
        return res.status(400).json({
            message: 'Captcha verification required',
            code: 'CAPTCHA_REQUIRED'
        });
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                }
            }
        );

        if (response.data.success) {
            return next();
        } else {
            return res.status(400).json({
                message: 'Captcha verification failed',
                code: 'CAPTCHA_FAILED',
                errors: response.data['error-codes']
            });
        }
    } catch (error: any) {
        console.error('reCAPTCHA verification error:', error.message);
        return res.status(500).json({ message: 'Error verifying captcha' });
    }
};
