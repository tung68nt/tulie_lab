import { request } from '@/lib/api-client';
import { User } from '@/types/api';

export const authApi = {
    register: (data: unknown) => request<{ user: User, token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: unknown) => request<{ user: User, token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request<void>('/auth/logout', { method: 'POST' }),
    getMe: () => request<User>('/auth/me'),
    getGoogleUrl: () => request<{ url: string }>('/auth/google'),
    verifyGoogleToken: (token: string) => request<{ user: User, token: string }>('/auth/google/verify', { method: 'POST', body: JSON.stringify({ token }) }),
};
