import { request } from '@/lib/api-client';
import { Course } from '@/types/api';

export const coursesApi = {
    list: (params?: Record<string, unknown>) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    searchParams.append(key, String(params[key]));
                }
            });
        }
        return request<Course[]>(`/courses?${searchParams.toString()}`);
    },
    get: (slug: string) => request<Course>(`/courses/${slug}`),
    getById: (id: string) => request<Course>(`/courses/by-id/${id}`),
    getContent: (lessonId: string) => request<unknown>(`/courses/lessons/${lessonId}/content`),
    getProgress: (courseId: string) => request<unknown>(`/courses/${courseId}/progress`),
    markComplete: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}/complete`, { method: 'POST' }),
    markUncomplete: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}/uncomplete`, { method: 'POST' }),
};

export const adminCoursesApi = {
    list: () => request<{ data: Course[], meta: any }>('/courses/admin/list'),
    get: (id: string) => request<Course>(`/courses/admin/${id}`),
    create: (data: unknown) => request<Course>('/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/courses/${id}`, { method: 'DELETE' }),
    addLesson: (courseId: string, data: unknown) => request<unknown>(`/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (lessonId: string, data: unknown) => request<unknown>(`/courses/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLesson: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}`, { method: 'DELETE' }),
    addAttachment: (lessonId: string, data: unknown) => request<unknown>(`/courses/lessons/${lessonId}/attachments`, { method: 'POST', body: JSON.stringify(data) }),
};

