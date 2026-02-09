import { request } from '@/lib/api-client';

export const cmsApi = {
    get: (keys?: string[]) => {
        const query = keys ? `?keys=${keys.join(',')}` : '';
        return request<Record<string, unknown>>(`/cms${query}`);
    },
    update: (data: { key: string, value: string, type?: string }) => request<unknown>('/cms', { method: 'POST', body: JSON.stringify(data) }),
};

export const blogApi = {
    list: (page: number = 1, limit: number = 20, categoryId?: string) => {
        const query = `?page=${page}&limit=${limit}${categoryId && categoryId !== 'all' ? `&categoryId=${categoryId}` : ''}`;
        return request<{ success: boolean, data: any[], meta: { total: number } }>(`/blog${query}`);
    },
    get: (slug: string) => request<{ success: boolean, data: any }>(`/blog/${slug}`),

    // Admin Blog
    admin: {
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
    }
};
