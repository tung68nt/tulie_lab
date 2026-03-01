/* eslint-disable @typescript-eslint/no-explicit-any */
const isServer = typeof window === 'undefined';
const envUrl = (isServer && process.env.INTERNAL_API_URL) || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// If we are on the client, we want to use the Next.js rewrite proxy (relative path)
// to avoid CORS issues. If on server, we use the full URL.
// Strip trailing slash first
const cleanEnvUrl = envUrl.replace(/\/$/, '').replace(/\/api$/, '');

// Use relative path for client, full URL for server
export const BASE_URL = isServer ? cleanEnvUrl : '';

console.log('Using BASE_URL for API:', BASE_URL);

export const getMediaUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) {
        // Auto-fix legacy domain if present
        if (url.includes('pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev')) {
            return url.replace('pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev', 'pub-84306d90a5714d098ed77c04f4c85df2.r2.dev');
        }
        return url;
    }
    // Prefix relative paths with the API BASE_URL (not just BASE_URL because it's empty on client)
    // Actually BASE_URL is empty on client to use proxy.
    // If we use proxy, /api/uploads will work.
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return isServer ? `${cleanEnvUrl}${cleanUrl}` : cleanUrl;
};

export class ApiError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const url = `${BASE_URL}/api${path}`;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    try {
        console.log(`[API] ${options.method || 'GET'} ${url}`);
        const response = await fetch(url, { ...options, headers, credentials: 'include', cache: 'no-store' });

        if (!response.ok) {
            if (response.status === 401 && typeof window !== 'undefined') {
                const hadToken = !!token; // User had a token before this request

                // Clear stale auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Only redirect to login if:
                // 1. User HAD a token (session expired) AND
                // 2. NOT on auth endpoints AND
                // 3. NOT already on login page
                if (hadToken && !endpoint.includes('/auth/') && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login?expired=true';
                }
            }

            const text = await response.text();
            let errorObj;
            try {
                errorObj = JSON.parse(text);
            } catch {
                console.error('API Error (Non-JSON response):', text.substring(0, 200));
                errorObj = { message: `Server Error (${response.status}): ${text.substring(0, 100)}` };
            }

            // Extract message from various possible keys
            const message = errorObj.message || errorObj.error || (typeof errorObj === 'string' ? errorObj : 'Unknown Server Error');
            throw new ApiError(response.status, message);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    } catch (error: unknown) {
        if (error instanceof ApiError) throw error;
        // console.error(`API Request Failed: ${endpoint}`, error); // Switched to warn to reduce noise
        console.warn(`API Request Failed: ${endpoint} - Is the backend server running?`);
        throw new ApiError(0, 'Network Error: Failed to connect to server');
    }
}
