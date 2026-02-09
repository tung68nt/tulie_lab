import { request } from '@/lib/api-client';

export const journeysApi = {
    // Public/Student APIs
    list: () => request<any[]>('/journeys'),
    get: (slug: string) => request<any>(`/journeys/${slug}`),
    enroll: (journeyId: string) => request<any>(`/journeys/${journeyId}/enroll`, { method: 'POST' }),
    getProgress: (journeyId: string) => request<any>(`/journeys/${journeyId}/progress`),
    myJourneys: () => request<any[]>('/my-journeys'),
    submitStep: (journeyId: string, stepId: string, data: { submissionType: string; content: string; fileName?: string }) =>
        request<any>(`/journeys/${journeyId}/steps/${stepId}/submit`, { method: 'POST', body: JSON.stringify(data) }),

    // Admin APIs
    admin: {
        list: (params?: { isPublished?: boolean; courseId?: string }) => {
            const searchParams = new URLSearchParams();
            if (params?.isPublished !== undefined) searchParams.append('isPublished', String(params.isPublished));
            if (params?.courseId) searchParams.append('courseId', params.courseId);
            return request<any[]>(`/admin/journeys?${searchParams.toString()}`);
        },
        get: (id: string) => request<any>(`/admin/journeys/${id}`),
        create: (data: any) => request<any>('/admin/journeys', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any) => request<any>(`/admin/journeys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/admin/journeys/${id}`, { method: 'DELETE' }),

        // Step management
        createStep: (journeyId: string, data: any) => request<any>(`/admin/journeys/${journeyId}/steps`, { method: 'POST', body: JSON.stringify(data) }),
        updateStep: (journeyId: string, stepId: string, data: any) => request<any>(`/admin/journeys/${journeyId}/steps/${stepId}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteStep: (journeyId: string, stepId: string) => request<void>(`/admin/journeys/${journeyId}/steps/${stepId}`, { method: 'DELETE' }),
        reorderSteps: (journeyId: string, stepIds: string[]) => request<void>(`/admin/journeys/${journeyId}/steps/reorder`, { method: 'PUT', body: JSON.stringify({ stepIds }) }),

        // Enrollment & Progress
        getEnrollments: (journeyId: string) => request<any[]>(`/admin/journeys/${journeyId}/enrollments`),
        getStats: (journeyId: string) => request<any>(`/admin/journeys/${journeyId}/stats`),
        getDashboard: (journeyId: string) => request<any>(`/admin/journeys/${journeyId}/dashboard`),

        // Submissions
        listSubmissions: (params?: { journeyId?: string; status?: string; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.journeyId) searchParams.append('journeyId', params.journeyId);
            if (params?.status) searchParams.append('status', params.status);
            if (params?.limit) searchParams.append('limit', String(params.limit));
            return request<any[]>(`/admin/submissions?${searchParams.toString()}`);
        },
        getSubmission: (id: string) => request<any>(`/admin/submissions/${id}`),
        reviewSubmission: (id: string, data: { status: string; feedback?: string }) =>
            request<any>(`/admin/submissions/${id}/review`, { method: 'PUT', body: JSON.stringify(data) }),
    },
};
