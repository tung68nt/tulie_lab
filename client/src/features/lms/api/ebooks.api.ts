import { request } from '@/lib/api-client';

export const ebooksApi = {
    // Admin methods
    listAdmin: (params?: { keyword?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return request<any>(`/ebooks/admin?${query}`);
    },
    getAdmin: (id: string) => request<any>(`/ebooks/admin/${id}`),
    create: (data: any) => request<any>('/ebooks/admin', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/ebooks/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/ebooks/admin/${id}`, { method: 'DELETE' }),

    // Public/User methods
    list: (params?: { keyword?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return request<any>(`/ebooks?${query}`);
    },
    getBySlug: (slug: string) => request<any>(`/ebooks/${slug}`),
    checkAccess: (id: string) => request<{ hasAccess: boolean; presignedUrl?: string }>(`/ebooks/${id}/access`),
};
