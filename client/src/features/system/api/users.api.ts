import { request } from '@/lib/api-client';
import { User, Order, SearchParams } from '@/types/api';

export const usersApi = {
    getProfile: () => request<User>('/users/profile'),
    updateProfile: (data: Partial<User>) => request<User>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getMyOrders: () => request<Order[]>('/users/my-orders'),
};

export const adminUsersApi = {
    listUsers: (params?: SearchParams) => {
        const searchParams = new URLSearchParams();
        if (params) {
            if (params.page) searchParams.append('page', String(params.page));
            if (params.limit) searchParams.append('limit', String(params.limit));
            if (params.search) searchParams.append('search', params.search);
        }
        return request<{ data: User[], pagination: any, stats: any }>(`/users?${searchParams.toString()}`);
    },
    getUser: (id: string) => request<User>(`/users/${id}`),
    // Enroll/Unenroll could be here or in LMS? Usually User Management in Admin Dashboard.
    enrollUser: (userId: string, courseId: string) => request<void>('/users/enroll', { method: 'POST', body: JSON.stringify({ userId, courseId }) }),
    unenrollUser: (userId: string, courseId: string) => request<void>('/users/unenroll', { method: 'POST', body: JSON.stringify({ userId, courseId }) }),
    grantMembership: (userId: string, days: number = 365, tier?: string) => request<void>('/users/grant-membership', { method: 'POST', body: JSON.stringify({ userId, days, tier }) }),
    getInactiveUsers: (days?: number) => request<User[]>(`/users/inactive${days ? `?days=${days}` : ''}`),
    blockUser: (id: string) => request<void>(`/users/${id}/block`, { method: 'POST' }),
    unblockUser: (id: string) => request<void>(`/users/${id}/unblock`, { method: 'POST' }),
    deleteUser: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
    notes: {
        list: (userId: string) => request<any[]>(`/users/${userId}/notes`),
        add: (userId: string, content: string) => request<any>('/users/notes', { method: 'POST', body: JSON.stringify({ userId, content }) }),
    },
    invoices: {
        listProfiles: (userId: string) => request<any[]>(`/users/${userId}/invoice-profiles`),
        createProfile: (userId: string, data: any) => request<any>(`/users/${userId}/invoice-profiles`, { method: 'POST', body: JSON.stringify(data) }),
    },
    // api.admin.users.list seems redundant with listUsers above, but was in original file.
    list: () => request<{ data: User[], pagination: any, stats: any }>('/users'),
    get: (id: string) => request<User>(`/users/${id}`),
};
