import { request } from '@/lib/api-client';

export const paymentsApi = {
    getTransactions: (params?: { page?: number; limit?: number; search?: string; startDate?: string; endDate?: string }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) searchParams.append(key, String(value));
            });
        }
        return request<{ data: any[], total: number }>(`/payments/transactions?${searchParams.toString()}`);
    },
    syncTransactions: (params?: { accountNumber?: string; limit?: number; dateMin?: string; dateMax?: string }) => request<{ message: string, result: any }>('/payments/sync', {
        method: 'POST',
        body: JSON.stringify(params || {})
    }),
};
