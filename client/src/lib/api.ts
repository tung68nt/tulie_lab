/* eslint-disable @typescript-eslint/no-explicit-any */
const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
// If we are on the client, we want to use the Next.js rewrite proxy (relative path)
// to avoid CORS issues. If on server, we use the full URL.
const isServer = typeof window === 'undefined';
// Strip trailing slash first
const cleanEnvUrl = envUrl.replace(/\/$/, '').replace(/\/api$/, '');

// Use relative path for client, full URL for server
const BASE_URL = isServer ? cleanEnvUrl : '';
console.log('Using BASE_URL for API:', BASE_URL);
// Build trigger: 2026-01-24 - Standardizing max-width and fixing connectivity

// Hardcoded R2 legacy domain correction
// Hardcoded R2 legacy domain correction
// const LEGACY_R2_DOMAIN = 'https://pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev';
// Current correct domain (from user)
// const CURRENT_R2_DOMAIN = 'https://pub-84306d90a5714d098ed77c04f4c85df2.r2.dev';

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

import { User, Course, Instructor, Order, Product, SearchParams } from '@/types/api';

export class ApiError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

export const api: any = {
    auth: {
        register: (data: unknown) => request<{ user: User, token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data: unknown) => request<{ user: User, token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        logout: () => request<void>('/auth/logout', { method: 'POST' }),
        getMe: () => request<User>('/auth/me'),
        getGoogleUrl: () => request<{ url: string }>('/auth/google'),
        verifyGoogleToken: (token: string) => request<{ user: User, token: string }>('/auth/google/verify', { method: 'POST', body: JSON.stringify({ token }) }),
    },
    courses: {
        list: (params?: Record<string, unknown>) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.keys(params).forEach(key => {
                    if (params[key] !== undefined && params[key] !== null) {
                        searchParams.append(key, String(params[key]));
                    }
                });
            }
            return request<Course[]>(`/courses?${searchParams.toString()}`);
        },
        get: (slug: string) => request<Course>(`/courses/${slug}`),
        getById: (id: string) => request<Course>(`/courses/by-id/${id}`),
        getContent: (lessonId: string) => request<unknown>(`/courses/lessons/${lessonId}/content`),
        getProgress: (courseId: string) => request<unknown>(`/courses/${courseId}/progress`),
        markComplete: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}/complete`, { method: 'POST' }),
        markUncomplete: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}/uncomplete`, { method: 'POST' }),
    },
    users: {
        getProfile: () => request<User>('/users/profile'),
        updateProfile: (data: Partial<User>) => request<User>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
        getMyOrders: () => request<Order[]>('/users/my-orders'),
    },
    instructors: {
        list: () => request<{ data: Instructor[], meta: any }>('/instructors'),
        get: (id: string) => request<Instructor>(`/instructors/${id}`),
        getBySlug: (slug: string) => request<Instructor>(`/instructors/slug/${slug}`),
    },
    admin: {
        listUsers: (params?: SearchParams) => {
            const searchParams = new URLSearchParams();
            if (params) {
                if (params.page) searchParams.append('page', String(params.page));
                if (params.limit) searchParams.append('limit', String(params.limit));
                if (params.search) searchParams.append('search', params.search);
            }
            return request<{ data: User[], pagination: any, stats: any }>(`/users?${searchParams.toString()}`);
        },
        getUser: (id: string) => request<User>(`/users/${id}`),
        enrollUser: (userId: string, courseId: string) => request<void>('/users/enroll', { method: 'POST', body: JSON.stringify({ userId, courseId }) }),
        unenrollUser: (userId: string, courseId: string) => request<void>('/users/unenroll', { method: 'POST', body: JSON.stringify({ userId, courseId }) }),
        grantMembership: (userId: string, days: number = 365, tier?: string) => request<void>('/users/grant-membership', { method: 'POST', body: JSON.stringify({ userId, days, tier }) }),
        getInactiveUsers: (days?: number) => request<User[]>(`/users/inactive${days ? `?days=${days}` : ''}`),
        blockUser: (id: string) => request<void>(`/users/${id}/block`, { method: 'POST' }),
        unblockUser: (id: string) => request<void>(`/users/${id}/unblock`, { method: 'POST' }),
        deleteUser: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
        notes: {
            list: (userId: string) => request<any[]>(`/users/${userId}/notes`),
            add: (userId: string, content: string) => request<any>('/users/notes', { method: 'POST', body: JSON.stringify({ userId, content }) }),
        },
        invoices: {
            listProfiles: (userId: string) => request<any[]>(`/users/${userId}/invoice-profiles`),
            createProfile: (userId: string, data: any) => request<any>(`/users/${userId}/invoice-profiles`, { method: 'POST', body: JSON.stringify(data) }),
        },
        courses: {
            list: () => request<{ data: Course[], meta: any }>('/courses/admin/list'),
            get: (id: string) => request<Course>(`/courses/admin/${id}`),
            create: (data: unknown) => request<Course>('/courses', { method: 'POST', body: JSON.stringify(data) }),
            update: (id: string, data: unknown) => request<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id: string) => request<void>(`/courses/${id}`, { method: 'DELETE' }),
            addLesson: (courseId: string, data: unknown) => request<unknown>(`/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
            updateLesson: (lessonId: string, data: unknown) => request<unknown>(`/courses/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }),
            deleteLesson: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}`, { method: 'DELETE' }),
            addAttachment: (lessonId: string, data: unknown) => request<unknown>(`/courses/lessons/${lessonId}/attachments`, { method: 'POST', body: JSON.stringify(data) }),
        },
        lms: {
            getAnalytics: () => request<any>('/admin/lms/analytics'),
        },
        users: {
            list: () => request<{ data: User[], pagination: any, stats: any }>('/users'),
            get: (id: string) => request<User>(`/users/${id}`),
        },
        orders: {
            list: (params?: SearchParams) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null) {
                            searchParams.append(key, String(params[key]));
                        }
                    });
                }
                return request<{ data: Order[], meta: any }>(`/payments/orders?${searchParams.toString()}`);
            },
            get: (id: string) => request<Order>(`/payments/orders/${id}`),
            updateStatus: (id: string, status: string) => request<Order>(`/payments/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            }),
            export: (startDate?: string, endDate?: string) => {
                const searchParams = new URLSearchParams();
                if (startDate) searchParams.append('startDate', startDate);
                if (endDate) searchParams.append('endDate', endDate);
                return request<Blob>(`/payments/orders/export?${searchParams.toString()}`);
            },
        },
        contact: {
            list: (params?: SearchParams) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null) {
                            searchParams.append(key, String(params[key]));
                        }
                    });
                }
                return request<{ data: any[], meta: any }>(`/contact/admin?${searchParams.toString()}`);
            },
            updateStatus: (id: string, status: string) => request<unknown>(`/contact/admin/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            }),
            delete: (id: string) => request<void>(`/contact/admin/${id}`, {
                method: 'DELETE'
            }),
        },
        settings: {
            get: () => request<unknown>('/settings'),
            update: (data: unknown) => request<unknown>('/settings', {
                method: 'PUT',
                body: JSON.stringify(data)
            }),
            getApiKey: () => request<{ apiKey: string }>('/settings/api-key'),
            regenerateApiKey: () => request<{ apiKey: string }>('/settings/api-key/regenerate', {
                method: 'POST'
            }),
            getEmailLogs: () => request<unknown[]>('/settings/email-logs'),
            testTelegram: () => request<{ message: string }>('/settings/telegram/test', { method: 'POST' }),
        },
        blog: {
            list: () => request<{ success: boolean, data: any[], meta: { total: number } }>('/blog/admin/list'),
            create: (data: unknown) => request<{ success: boolean, data: any }>('/blog/admin/create', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            update: (id: string, data: unknown) => request<{ success: boolean, data: any }>(`/blog/admin/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
            delete: (id: string) => request<void>(`/blog/admin/${id}`, {
                method: 'DELETE',
            }),
        },
        payments: {
            getTransactions: (params?: { page?: number; limit?: number; search?: string; startDate?: string; endDate?: string }) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (value) searchParams.append(key, String(value));
                    });
                }
                return request<{ data: any[], total: number }>(`/payments/transactions?${searchParams.toString()}`);
            },
            syncTransactions: (params?: { accountNumber?: string; limit?: number; dateMin?: string; dateMax?: string }) => request<{ message: string, result: any }>('/payments/sync', {
                method: 'POST',
                body: JSON.stringify(params || {})
            }),
            sendReminder: (orderId: string, customMessage?: string) => request<void>(`/payments/orders/${orderId}/send-reminder`, {
                method: 'POST',
                body: JSON.stringify({ customMessage })
            }),
        },
        cms: {
            update: (data: { key: string, value: string, type?: string }) => request<unknown>('/cms', { method: 'POST', body: JSON.stringify(data) }),
        },
        instructors: {
            list: () => request<{ data: Instructor[], meta: any }>('/instructors'),
            get: (id: string) => request<Instructor>(`/instructors/${id}`),
            create: (data: unknown) => request<Instructor>('/instructors', { method: 'POST', body: JSON.stringify(data) }),
            update: (id: string, data: unknown) => request<Instructor>(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id: string) => request<void>(`/instructors/${id}`, { method: 'DELETE' }),
        },
        media: {
            list: () => request<{ success: boolean, data: any[], meta: { total: number } }>('/uploads'),
            delete: (key: string) => request<void>(`/uploads?key=${encodeURIComponent(key)}`, { method: 'DELETE' }),
        }
    },
    cms: {
        get: (keys?: string[]) => {
            const query = keys ? `?keys=${keys.join(',')}` : '';
            return request<Record<string, unknown>>(`/cms${query}`);
        }
    },
    blog: {
        list: (page: number = 1, limit: number = 20, categoryId?: string) => {
            const query = `?page=${page}&limit=${limit}${categoryId && categoryId !== 'all' ? `&categoryId=${categoryId}` : ''}`;
            return request<{ success: boolean, data: any[], meta: { total: number } }>(`/blog${query}`);
        },
        get: (slug: string) => request<{ success: boolean, data: any }>(`/blog/${slug}`),
    },
    payments: {
        checkout: (data: unknown) => request<{ url: string }>('/payments/checkout', { method: 'POST', body: JSON.stringify(data) }),
        getOrder: (code: string) => request<Order>(`/payments/${code}`),
        deleteOrder: (id: string) => request<void>(`/payments/orders/${id}`, { method: 'DELETE' }),
    },
    promos: {
        validate: (code: string) => request<{ valid: boolean, discount?: number }>('/promo-codes/validate', { method: 'POST', body: JSON.stringify({ code }) }),
        list: () => request<unknown[]>('/promo-codes'),
        create: (data: unknown) => request<unknown>('/promo-codes', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/promo-codes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/promo-codes/${id}`, { method: 'DELETE' }),
    },
    notifications: {
        list: () => request<unknown[]>('/notifications'),
        listAll: () => request<unknown[]>('/notifications/all'),
        create: (data: unknown) => request<unknown>('/notifications', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/notifications/${id}`, { method: 'DELETE' }),
        markRead: (id: string) => request<void>(`/notifications/${id}/read`, { method: 'PUT' }),
        markAllRead: () => request<void>('/notifications/read-all', { method: 'PUT' }),
        getUnreadCount: () => request<{ count: number }>('/notifications/unread-count'),
    },
    contact: {
        submit: (data: unknown) => request<void>('/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    },
    settings: {
        getPublic: () => request<unknown>('/settings/public'),
    },
    categories: {
        list: () => request<{ data: any[], meta: any }>('/categories'),
        get: (id: string) => request<unknown>(`/categories/${id}`),
        create: (data: unknown) => request<unknown>('/categories', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/categories/${id}`, { method: 'DELETE' }),
    },
    bundles: {
        list: () => request<unknown[]>('/bundles'),
        listAdmin: () => request<unknown[]>('/bundles/manage/all'),
        get: (id: string) => request<unknown>(`/bundles/${id}`),
        create: (data: unknown) => request<unknown>('/bundles', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/bundles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/bundles/${id}`, { method: 'DELETE' }),
    },
    coupons: {
        list: () => request<unknown[]>('/coupons/manage'),
        get: (id: string) => request<unknown>(`/coupons/${id}`),
        create: (data: unknown) => request<unknown>('/coupons', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/coupons/${id}`, { method: 'DELETE' }),
        validate: (code: string, amount: number) => request<{ valid: boolean, discount?: number }>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, amount }) }),
    },
    pricingAddOns: {
        list: (includeInactive?: boolean) => {
            const query = includeInactive ? '?includeInactive=true' : '';
            return request<unknown[]>(`/pricing-addons${query}`);
        },
        get: (id: string) => request<unknown>(`/pricing-addons/${id}`),
        create: (data: unknown) => request<unknown>('/pricing-addons', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/pricing-addons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/pricing-addons/${id}`, { method: 'DELETE' }),
        reorder: (ids: string[]) => request<void>('/pricing-addons/reorder', { method: 'POST', body: JSON.stringify({ ids }) }),
    },
    uploads: {
        single: async (file: File): Promise<{ success: boolean, data: { url: string, originalName: string } }> => {
            const formData = new FormData();
            formData.append('file', file);
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await fetch(`${BASE_URL}/api/uploads`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Upload failed');
            }
            const res = await response.json();
            return res;
        },
        multiple: async (files: File[]): Promise<{ success: boolean, data: any[], meta: any }> => {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await fetch(`${BASE_URL}/api/uploads/multiple`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Upload failed');
            }
            return response.json();
        },
        importUrl: (data: { url: string, name?: string }) => request<{ success: boolean, data: any }>('/uploads/import-url', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    },
    post: (endpoint: string, data: unknown) => request<unknown>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    security: {
        log: (data: { action: string, details?: string }) => request<void>('/security/log', { method: 'POST', body: JSON.stringify(data) }),
        list: (limit = 100) => request<unknown[]>(`/security/list?limit=${limit}`)
    },
    activity: {
        log: (action: string, data: unknown) => request<void>('/activity/log', { method: 'POST', body: JSON.stringify({ action, ...(data as object || {}) }) }),
        list: (limit = 50) => request<unknown[]>(`/activity/list?limit=${limit}`)
    },
    system: {
        getStats: () => request<unknown>('/system/stats'),
    },
    landingPages: {
        list: (type?: string) => {
            const query = type ? `?type=${type}` : '';
            return request<{ data: any[], meta: any }>(`/landing-pages${query}`);
        },
        get: (id: string) => request<unknown>(`/landing-pages/id/${id}`),
        create: (data: unknown) => request<unknown>('/landing-pages', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/landing-pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/landing-pages/${id}`, { method: 'DELETE' }),
        duplicate: (id: string) => request<unknown>(`/landing-pages/${id}/duplicate`, { method: 'POST' }),
        setHomepage: (id: string) => request<void>(`/landing-pages/${id}/set-homepage`, { method: 'POST' }),
    },
    events: {
        list: (includeInactive?: boolean) => {
            const query = includeInactive ? '?includeInactive=true' : '';
            return request<{ data: any[], meta: any }>(`/events${query}`);
        },
        getUpcoming: (limit?: number) => {
            const query = limit ? `?limit=${limit}` : '';
            return request<{ data: any[], meta: any }>(`/events/upcoming${query}`);
        },
        get: (id: string) => request<unknown>(`/events/${id}`),
        create: (data: unknown) => request<unknown>('/events', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<unknown>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/events/${id}`, { method: 'DELETE' }),
    },
    products: {
        list: (params?: { page?: number; limit?: number; search?: string; type?: string; isPublished?: boolean }) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.keys(params).forEach(key => {
                    // @ts-expect-error - params key check
                    if (params[key] !== undefined) searchParams.append(key, String(params[key]));
                });
            }
            return request<{ data: Product[], meta: any }>(`/products?${searchParams.toString()}`);
        },
        get: (slug: string) => request<Product>(`/products/${slug}`),
        create: (data: unknown) => request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: unknown) => request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/products/${id}`, { method: 'DELETE' }),
        addVersion: (id: string, data: unknown) => request<unknown>(`/products/${id}/versions`, { method: 'POST', body: JSON.stringify(data) }),
        updateVersion: (versionId: string, data: unknown) => request<unknown>(`/products/versions/${versionId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteVersion: (versionId: string) => request<void>(`/products/versions/${versionId}`, { method: 'DELETE' }),
        getUpsells: (id: string) => request<any>(`/products/${id}/upsells`),
        addUpsell: (id: string, data: { productId?: string; courseId?: string; position?: number }) => request<any>(`/products/${id}/upsells`, { method: 'POST', body: JSON.stringify(data) }),
        removeUpsell: (id: string, upsellId: string) => request<void>(`/products/${id}/upsells/${upsellId}`, { method: 'DELETE' }),
        // Classification Management
        listClassifications: (type?: string) => {
            const query = type ? `?type=${type}` : '';
            return request<any[]>(`/products/classifications/list${query}`);
        },
        createClassification: (data: any) => request<any>('/products/classifications', { method: 'POST', body: JSON.stringify(data) }),
        updateClassification: (id: string, data: any) => request<any>(`/products/classifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteClassification: (id: string) => request<void>(`/products/classifications/${id}`, { method: 'DELETE' }),
    },
    activationCodes: {
        list: () => request<{ data: any[], meta: any }>('/activation-codes/admin/list'),
        create: (courseId: string | null, count: number, productId?: string) => request<unknown[]>('/activation-codes/admin/create', { method: 'POST', body: JSON.stringify({ courseId, count, productId }) }),
        delete: (id: string) => request<void>(`/activation-codes/admin/${id}`, { method: 'DELETE' }),
        redeem: (code: string) => request<void>('/activation-codes/redeem', { method: 'POST', body: JSON.stringify({ code }) }),
    },
    newsletter: {
        subscribe: (email: string) => request<void>('/contact/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
    },

    // ============== LEARNING JOURNEY ==============
    journeys: {
        // Public/Student APIs
        list: () => request<any[]>('/journeys'),
        get: (slug: string) => request<any>(`/journeys/${slug}`),
        enroll: (journeyId: string) => request<any>(`/journeys/${journeyId}/enroll`, { method: 'POST' }),
        getProgress: (journeyId: string) => request<any>(`/journeys/${journeyId}/progress`),
        myJourneys: () => request<any[]>('/my-journeys'),
        submitStep: (journeyId: string, stepId: string, data: { submissionType: string; content: string; fileName?: string }) =>
            request<any>(`/journeys/${journeyId}/steps/${stepId}/submit`, { method: 'POST', body: JSON.stringify(data) }),

        // Admin APIs
        admin: {
            list: (params?: { isPublished?: boolean; courseId?: string }) => {
                const searchParams = new URLSearchParams();
                if (params?.isPublished !== undefined) searchParams.append('isPublished', String(params.isPublished));
                if (params?.courseId) searchParams.append('courseId', params.courseId);
                return request<any[]>(`/admin/journeys?${searchParams.toString()}`);
            },
            get: (id: string) => request<any>(`/admin/journeys/${id}`),
            create: (data: any) => request<any>('/admin/journeys', { method: 'POST', body: JSON.stringify(data) }),
            update: (id: string, data: any) => request<any>(`/admin/journeys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id: string) => request<void>(`/admin/journeys/${id}`, { method: 'DELETE' }),

            // Step management
            createStep: (journeyId: string, data: any) => request<any>(`/admin/journeys/${journeyId}/steps`, { method: 'POST', body: JSON.stringify(data) }),
            updateStep: (journeyId: string, stepId: string, data: any) => request<any>(`/admin/journeys/${journeyId}/steps/${stepId}`, { method: 'PUT', body: JSON.stringify(data) }),
            deleteStep: (journeyId: string, stepId: string) => request<void>(`/admin/journeys/${journeyId}/steps/${stepId}`, { method: 'DELETE' }),
            reorderSteps: (journeyId: string, stepIds: string[]) => request<void>(`/admin/journeys/${journeyId}/steps/reorder`, { method: 'PUT', body: JSON.stringify({ stepIds }) }),

            // Enrollment & Progress
            getEnrollments: (journeyId: string) => request<any[]>(`/admin/journeys/${journeyId}/enrollments`),
            getStats: (journeyId: string) => request<any>(`/admin/journeys/${journeyId}/stats`),
            getDashboard: (journeyId: string) => request<any>(`/admin/journeys/${journeyId}/dashboard`),

            // Submissions
            listSubmissions: (params?: { journeyId?: string; status?: string; limit?: number }) => {
                const searchParams = new URLSearchParams();
                if (params?.journeyId) searchParams.append('journeyId', params.journeyId);
                if (params?.status) searchParams.append('status', params.status);
                if (params?.limit) searchParams.append('limit', String(params.limit));
                return request<any[]>(`/admin/submissions?${searchParams.toString()}`);
            },
            getSubmission: (id: string) => request<any>(`/admin/submissions/${id}`),
            reviewSubmission: (id: string, data: { status: string; feedback?: string }) =>
                request<any>(`/admin/submissions/${id}/review`, { method: 'PUT', body: JSON.stringify(data) }),
        },
    },
    mentoring: {
        getSchedule: (start: string, end: string) => request<any[]>(`/mentoring/schedule?start=${start}&end=${end}`),
        book: (data: any) => request<any>('/mentoring/book', { method: 'POST', body: JSON.stringify(data) }),
        mySessions: () => request<any[]>('/mentoring/my-sessions'),
    },
    whiteboards: {
        list: () => request<any[]>('/whiteboards/my'),
        get: (id: string) => request<any>(`/whiteboards/${id}`),
        create: (data: { title?: string; description?: string }) => request<any>('/whiteboards', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/whiteboards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/whiteboards/${id}`, { method: 'DELETE' }),
        saveArtboard: (artboardId: string, data: any) => request<any>(`/whiteboards/artboards/${artboardId}/state`, { method: 'PUT', body: JSON.stringify(data) }),
        addArtboard: (id: string, name?: string) => request<any>(`/whiteboards/${id}/artboards`, { method: 'POST', body: JSON.stringify({ name }) }),
        saveSnapshot: (id: string, artboardId: string, elements: any) => request<any>(`/whiteboards/${id}/snapshots`, { method: 'POST', body: JSON.stringify({ artboardId, elements }) }),
        getAdminStats: () => request<any>('/whiteboards/admin/stats'),
    },
    shortLinks: {
        list: () => request<any[]>('/short-links'),
        create: (data: { code?: string, originalUrl: string, title?: string }) => request<any>('/short-links', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: { originalUrl?: string, title?: string }) => request<any>(`/short-links/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/short-links/${id}`, { method: 'DELETE' }),
        resolve: (code: string) => request<any>(`/short-links/${code}`),
    }
};
