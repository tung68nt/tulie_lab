import { request } from '@/lib/api-client';

export const bundlesApi = {
    list: () => request<unknown[]>('/bundles'),
    listAdmin: () => request<unknown[]>('/bundles/manage/all'),
    get: (id: string) => request<unknown>(`/bundles/${id}`),
    create: (data: unknown) => request<unknown>('/bundles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<unknown>(`/bundles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/bundles/${id}`, { method: 'DELETE' }),
};
