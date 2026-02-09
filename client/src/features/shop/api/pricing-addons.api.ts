import { request } from '@/lib/api-client';

export const pricingAddOnsApi = {
    list: (includeInactive?: boolean) => {
        const query = includeInactive ? '?includeInactive=true' : '';
        return request<unknown[]>(`/pricing-addons${query}`);
    },
    get: (id: string) => request<unknown>(`/pricing-addons/${id}`),
    create: (data: unknown) => request<unknown>('/pricing-addons', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<unknown>(`/pricing-addons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/pricing-addons/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) => request<void>('/pricing-addons/reorder', { method: 'POST', body: JSON.stringify({ ids }) }),
};
