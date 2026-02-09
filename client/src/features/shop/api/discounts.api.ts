import { request } from '@/lib/api-client';

export const promosApi = {
    validate: (code: string) => request<{ valid: boolean, discount?: number }>('/promo-codes/validate', { method: 'POST', body: JSON.stringify({ code }) }),
    list: () => request<unknown[]>('/promo-codes'),
    create: (data: unknown) => request<unknown>('/promo-codes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<unknown>(`/promo-codes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/promo-codes/${id}`, { method: 'DELETE' }),
};

export const couponsApi = {
    list: () => request<unknown[]>('/coupons/manage'),
    get: (id: string) => request<unknown>(`/coupons/${id}`),
    create: (data: unknown) => request<unknown>('/coupons', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<unknown>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/coupons/${id}`, { method: 'DELETE' }),
    validate: (code: string, amount: number) => request<{ valid: boolean, discount?: number }>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, amount }) }),
};
