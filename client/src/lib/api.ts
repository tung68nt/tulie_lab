// Remove /api suffix if present to get clean base URL
const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BASE_URL = envUrl.endsWith('/api') ? envUrl.slice(0, -4) : envUrl; // Strip /api suffix if exists

console.log('Using BASE_URL for API:', BASE_URL);

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
    const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

    const headers: any = {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers, credentials: 'include' });
        // ... (rest of request function same until catch)

        // ...

        if (!response.ok) {
            if (response.status === 401 && !endpoint.includes('/auth/login') && typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.includes('/login')) {
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
    } catch (error: any) {
        if (error instanceof ApiError) throw error;
        // console.error(`API Request Failed: ${endpoint}`, error); // Switched to warn to reduce noise
        console.warn(`API Request Failed: ${endpoint} - Is the backend server running?`);
        throw new ApiError(0, 'Network Error: Failed to connect to server');
    }
}

export const api = {
    auth: {
        register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        logout: () => request('/auth/logout', { method: 'POST' }),
        getMe: () => request('/auth/me'),
    },
    courses: {
        list: (params?: any) => {
            const searchParams = new URLSearchParams();
            if (params) {
                Object.keys(params).forEach(key => {
                    if (params[key] !== undefined && params[key] !== null) {
                        searchParams.append(key, String(params[key]));
                    }
                });
            }
            return request(`/courses?${searchParams.toString()}`);
        },
        get: (slug: string) => request(`/courses/${slug}`),
        getContent: (lessonId: string) => request(`/courses/lessons/${lessonId}/content`),
        getProgress: (courseId: string) => request(`/courses/${courseId}/progress`),
        markComplete: (lessonId: string) => request(`/courses/lessons/${lessonId}/complete`, { method: 'POST' }),
        markUncomplete: (lessonId: string) => request(`/courses/lessons/${lessonId}/uncomplete`, { method: 'POST' }),
    },
    users: {
        getProfile: () => request('/users/profile'),
        updateProfile: (data: any) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
        getOrders: () => request('/users/orders'),
    },
    instructors: {
        list: () => request('/instructors'),
        get: (id: string) => request(`/instructors/${id}`),
    },
    admin: {
        listUsers: () => request('/users'),
        getUser: (id: string) => request(`/users/${id}`),
        enrollUser: (userId: string, courseId: string) => request('/users/enroll', { method: 'POST', body: JSON.stringify({ userId, courseId }) }),
        unenrollUser: (userId: string, courseId: string) => request('/users/unenroll', { method: 'POST', body: JSON.stringify({ userId, courseId }) }),
        getInactiveUsers: (days?: number) => request(`/users/inactive${days ? `?days=${days}` : ''}`),
        courses: {
            list: () => request('/courses/all'),
            get: (id: string) => request(`/courses/${id}/full`),
            create: (data: any) => request('/courses', { method: 'POST', body: JSON.stringify(data) }),
            update: (id: string, data: any) => request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id: string) => request(`/courses/${id}`, { method: 'DELETE' }),
            addLesson: (courseId: string, data: any) => request(`/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
            updateLesson: (lessonId: string, data: any) => request(`/courses/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }),
            deleteLesson: (lessonId: string) => request(`/courses/lessons/${lessonId}`, { method: 'DELETE' }),
            addAttachment: (lessonId: string, data: any) => request(`/courses/lessons/${lessonId}/attachments`, { method: 'POST', body: JSON.stringify(data) }),
        },
        users: {
            list: () => request('/users'),
            get: (id: string) => request(`/users/${id}`),
        },
        orders: {
            list: (params?: any) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null) {
                            searchParams.append(key, String(params[key]));
                        }
                    });
                }
                return request(`/payments/orders?${searchParams.toString()}`);
            },
            updateStatus: (id: string, status: string) => request(`/payments/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            }),
            export: (startDate?: string, endDate?: string) => {
                const searchParams = new URLSearchParams();
                if (startDate) searchParams.append('startDate', startDate);
                if (endDate) searchParams.append('endDate', endDate);
                return request(`/payments/orders/export?${searchParams.toString()}`);
            },
        },
        contact: {
            list: (params?: any) => {
                const searchParams = new URLSearchParams();
                if (params) {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null) {
                            searchParams.append(key, String(params[key]));
                        }
                    });
                }
                return request(`/contact/admin?${searchParams.toString()}`);
            },
            updateStatus: (id: string, status: string) => request(`/contact/admin/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            }),
            delete: (id: string) => request(`/contact/admin/${id}`, {
                method: 'DELETE'
            }),
        },
        settings: {
            get: () => request('/settings'),
            update: (data: any) => request('/settings', {
                method: 'PUT',
                body: JSON.stringify(data)
            }),
            getApiKey: () => request('/settings/api-key'),
            regenerateApiKey: () => request('/settings/api-key/regenerate', {
                method: 'POST'
            }),
        },
        blog: {
            create: (data: any) => request('/blog', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            update: (id: string, data: any) => request(`/blog/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
            delete: (id: string) => request(`/blog/${id}`, {
                method: 'DELETE',
            }),
        },
        payments: {
            listTransactions: () => request('/payments/transactions'),
            sendReminder: (orderId: string, customMessage?: string) => request(`/payments/orders/${orderId}/send-reminder`, {
                method: 'POST',
                body: JSON.stringify({ customMessage })
            }),
        },
        cms: {
            update: (data: { key: string, value: string, type?: string }) => request('/cms', { method: 'POST', body: JSON.stringify(data) }),
        },
        instructors: {
            list: () => request('/instructors'),
            get: (id: string) => request(`/instructors/${id}`),
            create: (data: any) => request('/instructors', { method: 'POST', body: JSON.stringify(data) }),
            update: (id: string, data: any) => request(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id: string) => request(`/instructors/${id}`, { method: 'DELETE' }),
        }
    },
    cms: {
        get: (keys?: string[]) => {
            const query = keys ? `?keys=${keys.join(',')}` : '';
            return request(`/cms${query}`);
        }
    },
    payments: {
        checkout: (data: { courseId: string, promoCodeId?: string }) => request('/payments/checkout', { method: 'POST', body: JSON.stringify(data) }),
        getOrder: (code: string) => request(`/payments/${code}`),
    },
    promos: {
        validate: (code: string) => request('/promo-codes/validate', { method: 'POST', body: JSON.stringify({ code }) }),
        list: () => request('/promo-codes'),
        create: (data: any) => request('/promo-codes', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request(`/promo-codes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request(`/promo-codes/${id}`, { method: 'DELETE' }),
    },
    notifications: {
        list: () => request('/notifications'),
        listAll: () => request('/notifications/all'),
        create: (data: any) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request(`/notifications/${id}`, { method: 'DELETE' }),
        markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
        markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
        getUnreadCount: () => request('/notifications/unread-count'),
    },
    contact: {
        submit: (data: any) => request('/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    },
    settings: {
        getPublic: () => request('/settings/public'),
    },
    categories: {
        list: () => request('/categories'),
        get: (id: string) => request(`/categories/${id}`),
        create: (data: any) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request(`/categories/${id}`, { method: 'DELETE' }),
    },
    bundles: {
        list: () => request('/bundles'),
        listAdmin: () => request('/bundles/manage/all'),
        get: (id: string) => request(`/bundles/${id}`),
        create: (data: any) => request('/bundles', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request(`/bundles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request(`/bundles/${id}`, { method: 'DELETE' }),
    },
    coupons: {
        list: () => request('/coupons/manage'),
        get: (id: string) => request(`/coupons/${id}`),
        create: (data: any) => request('/coupons', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request(`/coupons/${id}`, { method: 'DELETE' }),
        validate: (code: string, amount: number) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, amount }) }),
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
    post: (endpoint: string, data: any) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    security: {
        log: (data: { action: string, details?: string }) => request('/security/log', { method: 'POST', body: JSON.stringify(data) }),
        list: (limit = 100) => request(`/security/list?limit=${limit}`)
    },
    activity: {
        log: (action: string, data: any) => request('/activity/log', { method: 'POST', body: JSON.stringify({ action, ...data }) }),
        list: (limit = 50) => request(`/activity/list?limit=${limit}`)
    }
};
