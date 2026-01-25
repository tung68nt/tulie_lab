const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
// If we are on the client, we want to use the Next.js rewrite proxy (relative path)
// to avoid CORS issues. If on server, we use the full URL.
const isServer = typeof window === 'undefined';
// Strip trailing slash first
const cleanEnvUrl = envUrl.replace(/\/$/, '').replace(/\/api$/, '');

// Use relative path for client, full URL for server
const BASE_URL = isServer ? cleanEnvUrl : '';
// Build trigger: 2026-01-24 - Standardizing max-width and fixing connectivity

console.log('Using BASE_URL for API:', BASE_URL);

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
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    try {
        console.log(`[API] ${options.method || 'GET'} ${url}`);
        const response = await fetch(url, { ...options, headers, credentials: 'include' });

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
            let error;
            try {
                error = JSON.parse(text);
            } catch {
                console.error('API Error (Non-JSON response):', text.substring(0, 200));
                error = { message: `Server Error (${response.status}): ${text.substring(0, 100)}` };
            }
            throw new ApiError(response.status, error.message);
        }

        return response.json();
    } catch (error: unknown) {
        if (error instanceof ApiError) throw error;
        // console.error(`API Request Failed: ${endpoint}`, error); // Switched to warn to reduce noise
        console.warn(`API Request Failed: ${endpoint} - Is the backend server running?`);
        throw new ApiError(0, 'Network Error: Failed to connect to server');
    }
}

export const api = {
    auth: {
        register: (data: unknown) => request<{ user: User, token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data: unknown) => request<{ user: User, token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        logout: () => request<void>('/auth/logout', { method: 'POST' }),
        getMe: () => request<User>('/auth/me'),
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
        grantMembership: (userId: string, days: number = 365) => request<void>('/users/grant-membership', { method: 'POST', body: JSON.stringify({ userId, days }) }),
        getInactiveUsers: (days?: number) => request<User[]>(`/users/inactive${days ? `?days=${days}` : ''}`),
        blockUser: (id: string) => request<void>(`/users/${id}/block`, { method: 'POST' }),
        unblockUser: (id: string) => request<void>(`/users/${id}/unblock`, { method: 'POST' }),
        deleteUser: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
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
            list: () => request<{ data: any[], meta: any }>('/blog/admin/list'),
            create: (data: unknown) => request<unknown>('/blog/admin/create', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            update: (id: string, data: unknown) => request<unknown>(`/blog/admin/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
            delete: (id: string) => request<void>(`/blog/admin/${id}`, {
                method: 'DELETE',
            }),
        },
        payments: {
            getTransactions: () => request<unknown[]>('/payments/transactions'),
            syncTransactions: (accountNumber?: string) => request<{ message: string, result: any }>('/payments/sync', {
                method: 'POST',
                body: JSON.stringify({ accountNumber })
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
            list: () => request<{ success: boolean, files: any[] }>('/uploads'),
            delete: (key: string) => request<void>(`/uploads/${encodeURIComponent(key)}`, { method: 'DELETE' }),
        }
    },
    cms: {
        get: (keys?: string[]) => {
            const query = keys ? `?keys=${keys.join(',')}` : '';
            return request<Record<string, unknown>>(`/cms${query}`);
        }
    },
    blog: {
        list: (page?: number, limit?: number, categoryId?: string) => {
            const query = (page || limit || categoryId)
                ? `?${page ? `page=${page}` : ''}${limit ? `&limit=${limit}` : ''}${categoryId ? `&categoryId=${categoryId}` : ''}`
                : '';
            return request<any>(`/blog${query}`);
        },
        get: (slug: string) => request<any>(`/blog/${slug}`)
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
    uploads: {
        single: async (file: File): Promise<{ success: boolean, file: { url: string, originalName: string } }> => {
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
            return response.json();
        },
        multiple: async (files: File[]): Promise<{ success: boolean, files: { url: string, originalName: string }[] }> => {
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
        }
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
        deleteVersion: (versionId: string) => request<void>(`/products/versions/${versionId}`, { method: 'DELETE' }),
        getUpsells: (id: string) => request<any>(`/products/${id}/upsells`),
        addUpsell: (id: string, data: { productId?: string; courseId?: string; position?: number }) => request<any>(`/products/${id}/upsells`, { method: 'POST', body: JSON.stringify(data) }),
        removeUpsell: (id: string, upsellId: string) => request<void>(`/products/${id}/upsells/${upsellId}`, { method: 'DELETE' }),
    },
    activationCodes: {
        list: () => request<{ data: any[], meta: any }>('/activation-codes/admin/list'),
        create: (courseId: string | null, count: number, productId?: string) => request<unknown[]>('/activation-codes/admin/create', { method: 'POST', body: JSON.stringify({ courseId, count, productId }) }),
        delete: (id: string) => request<void>(`/activation-codes/admin/${id}`, { method: 'DELETE' }),
        redeem: (code: string) => request<void>('/activation-codes/redeem', { method: 'POST', body: JSON.stringify({ code }) }),
    },
    newsletter: {
        subscribe: (email: string) => request<void>('/contact/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
    }
};
