import { request, BASE_URL } from '@/lib/api-client';

export const uploadApi = {
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
};

export const mediaApi = {
    list: () => request<{ success: boolean, data: any[], meta: { total: number } }>('/uploads'),
    delete: (key: string) => request<void>(`/uploads?key=${encodeURIComponent(key)}`, { method: 'DELETE' }),
};
