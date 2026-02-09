import { request } from '@/lib/api-client';

export const lmsAnalyticsApi = {
    getAnalytics: () => request<any>('/admin/lms/analytics'),
};
