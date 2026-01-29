/**
 * Server-side API helper for Server Components
 * Does NOT use localStorage (unavailable on server)
 * Used for fetching public data during SSR
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE = BASE_URL.replace(/\/$/, '').replace(/\/api$/, '') + '/api';

export interface ServerApiOptions {
    cache?: RequestCache;
    revalidate?: number;
}

/**
 * Fetch data from backend API (server-side only)
 * For public endpoints that don't require authentication
 */
export async function serverFetch<T>(
    endpoint: string,
    options: ServerApiOptions = {}
): Promise<T | null> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE}${path}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: options.cache ?? 'no-store',
            next: options.revalidate ? { revalidate: options.revalidate } : undefined,
        });

        if (!response.ok) {
            console.warn(`[Server API] ${url} returned ${response.status}`);
            return null;
        }

        return response.json();
    } catch (error) {
        console.error(`[Server API] Failed to fetch ${url}:`, error);
        return null;
    }
}

/**
 * Pre-defined server API methods for common data fetching
 */
export const serverApi = {
    courses: {
        /**
         * Get course by slug (public metadata only)
         * Does NOT include secure video URLs
         */
        get: (slug: string) => serverFetch<any>(`/courses/${slug}`),
    },
};
