import { Request, Response, NextFunction } from 'express';

/**
 * Simple CSRF protection middleware.
 * Since the app uses SameSite=None cookies for cross-domain support,
 * we enforce a custom header check for all sensitive mutation requests (POST, PUT, DELETE, PATCH).
 * 
 * Standard browsers do not allow cross-origin requests to send custom headers 
 * without a CORS preflight. Verification of this header ensures the request 
 * originated from our own frontend.
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
    // Methods that don't change state are generally safe from CSRF
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }

    // Exempt webhooks from CSRF (they use API keys instead)
    if (req.path.includes('/webhook') || req.path.includes('/callback')) {
        return next();
    }

    const csrfHeader = req.headers['x-requested-with'] || req.headers['x-csrf-token'];

    if (!csrfHeader) {
        console.warn(`[Security] CSRF attempt blocked: ${req.method} ${req.path} - Missing custom header`);
        return res.status(403).json({
            message: 'Security violation: CSRF protection triggered. Missing required headers.',
            error: 'CSRF_PROTECTION'
        });
    }

    next();
};
