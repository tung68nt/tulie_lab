import { request } from '@/lib/api-client';
import { SearchParams } from '@/types/api';

export const notificationsApi = {
    list: () => request<unknown[]>('/notifications'),
    listAll: () => request<unknown[]>('/notifications/all'),
    create: (data: unknown) => request<unknown>('/notifications', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<unknown>(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/notifications/${id}`, { method: 'DELETE' }),
    markRead: (id: string) => request<void>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request<void>('/notifications/read-all', { method: 'PUT' }),
    getUnreadCount: () => request<{ count: number }>('/notifications/unread-count'),
};

export const contactApi = {
    submit: (data: unknown) => request<void>('/contact', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    // Admin
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
};

export const newsletterApi = {
    subscribe: (email: string) => request<void>('/contact/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};
