import { request } from '@/lib/api-client';

export const landingPagesApi = {
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
};

export const eventsApi = {
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
};

export const shortLinksApi = {
    list: () => request<any[]>('/short-links'),
    create: (data: { code?: string, originalUrl: string, title?: string }) => request<any>('/short-links', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { originalUrl?: string, title?: string }) => request<any>(`/short-links/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/short-links/${id}`, { method: 'DELETE' }),
    resolve: (code: string) => request<any>(`/short-links/${code}`),
};

export const activationCodesApi = {
    list: () => request<{ data: any[], meta: any }>('/activation-codes/admin/list'),
    create: (courseId: string | null, count: number, productId?: string) => request<unknown[]>('/activation-codes/admin/create', { method: 'POST', body: JSON.stringify({ courseId, count, productId }) }),
    delete: (id: string) => request<void>(`/activation-codes/admin/${id}`, { method: 'DELETE' }),
    redeem: (code: string) => request<void>('/activation-codes/redeem', { method: 'POST', body: JSON.stringify({ code }) }),
};

export const adsApi = {
    getROI: (startDate?: string, endDate?: string) => {
        const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
        return request<any[]>(`/ads/roi${query}`);
    },
    syncInsights: (datePreset?: string) => request<any>('/ads/sync', { method: 'POST', body: JSON.stringify({ datePreset }) }),
    syncAudience: (audienceId: string, userEmails: string[]) => request<any>('/ads/sync-audience', { method: 'POST', body: JSON.stringify({ audienceId, userEmails }) }),
    classify: () => request<any>('/ads/classify', { method: 'POST' }),
};
