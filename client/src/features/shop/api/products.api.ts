import { request } from '@/lib/api-client';
import { Product } from '@/types/api';

export const productsApi = {
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
    updateVersion: (versionId: string, data: unknown) => request<unknown>(`/products/versions/${versionId}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteVersion: (versionId: string) => request<void>(`/products/versions/${versionId}`, { method: 'DELETE' }),
    getUpsells: (id: string) => request<any>(`/products/${id}/upsells`),
    addUpsell: (id: string, data: { productId?: string; courseId?: string; position?: number }) => request<any>(`/products/${id}/upsells`, { method: 'POST', body: JSON.stringify(data) }),
    removeUpsell: (id: string, upsellId: string) => request<void>(`/products/${id}/upsells/${upsellId}`, { method: 'DELETE' }),
    // Classification Management
    listClassifications: (type?: string) => {
        const query = type ? `?type=${type}` : '';
        return request<any[]>(`/products/classifications/list${query}`);
    },
    createClassification: (data: any) => request<any>('/products/classifications', { method: 'POST', body: JSON.stringify(data) }),
    updateClassification: (id: string, data: any) => request<any>(`/products/classifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteClassification: (id: string) => request<void>(`/products/classifications/${id}`, { method: 'DELETE' }),
};
