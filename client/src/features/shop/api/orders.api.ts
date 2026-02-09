import { request } from '@/lib/api-client';
import { Order, SearchParams } from '@/types/api';

export const ordersApi = {
    list: (params?: SearchParams) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    searchParams.append(key, String(params[key]));
                }
            });
        }
        return request<{ data: Order[], meta: any }>(`/payments/orders?${searchParams.toString()}`);
    },
    get: (id: string) => request<Order>(`/payments/orders/${id}`),
    updateStatus: (id: string, status: string) => request<Order>(`/payments/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    export: (startDate?: string, endDate?: string) => {
        const searchParams = new URLSearchParams();
        if (startDate) searchParams.append('startDate', startDate);
        if (endDate) searchParams.append('endDate', endDate);
        return request<Blob>(`/payments/orders/export?${searchParams.toString()}`);
    },
    sendReminder: (orderId: string, customMessage?: string) => request<void>(`/payments/orders/${orderId}/send-reminder`, {
        method: 'POST',
        body: JSON.stringify({ customMessage })
    }),
};

export const checkoutApi = {
    checkout: (data: unknown) => request<{ url: string }>('/payments/checkout', { method: 'POST', body: JSON.stringify(data) }),
    getOrder: (code: string) => request<Order>(`/payments/${code}`),
    deleteOrder: (id: string) => request<void>(`/payments/orders/${id}`, { method: 'DELETE' }),
};
