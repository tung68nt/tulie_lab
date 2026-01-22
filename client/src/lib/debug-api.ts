/**
 * Debug helper to check API configuration in browser
 * Usage: Open browser console and check window.__API_DEBUG__
 */

if (typeof window !== 'undefined') {
    (window as any).__API_DEBUG__ = {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        computed_BASE_URL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/$/, '').replace(/\/api$/, ''),
        location: window.location.href,
        timestamp: new Date().toISOString()
    };
    console.log('[DEBUG] API Configuration:', (window as any).__API_DEBUG__);
}

export {};
