import { request } from '@/lib/api-client';

export const mentoringApi = {
    getSchedule: (start: string, end: string) => request<any[]>(`/mentoring/schedule?start=${start}&end=${end}`),
    book: (data: any) => request<any>('/mentoring/book', { method: 'POST', body: JSON.stringify(data) }),
    mySessions: () => request<any[]>('/mentoring/my-sessions'),
};
