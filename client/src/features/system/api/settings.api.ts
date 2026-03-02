import { request } from '@/lib/api-client';

export const settingsApi = {
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
    testEmail: (email?: string) => request<{ success: boolean; message: string }>('/settings/email/test', {
        method: 'POST',
        body: JSON.stringify({ email })
    }),
    getPublic: () => request<unknown>('/settings/public'),
};

export const securityApi = {
    log: (data: { action: string, details?: string }) => request<void>('/security/log', { method: 'POST', body: JSON.stringify(data) }),
    list: (limit = 100) => request<unknown[]>(`/security/list?limit=${limit}`)
};

export const activityApi = {
    log: (action: string, data: unknown) => request<void>('/activity/log', { method: 'POST', body: JSON.stringify({ action, ...(data as object || {}) }) }),
    list: (limit = 50) => request<unknown[]>(`/activity/list?limit=${limit}`)
};

export const systemApi = {
    getStats: () => request<unknown>('/system/stats'),
};
