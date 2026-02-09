import { request } from '@/lib/api-client';

export const categoriesApi = {
    list: () => request<{ data: any[], meta: any }>('/categories'),
    get: (id: string) => request<unknown>(`/categories/${id}`),
    create: (data: unknown) => request<unknown>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<unknown>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/categories/${id}`, { method: 'DELETE' }),
};
