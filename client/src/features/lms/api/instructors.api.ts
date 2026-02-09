import { request } from '@/lib/api-client';
import { Instructor } from '@/types/api';

export const instructorsApi = {
    list: () => request<{ data: Instructor[], meta: any }>('/instructors'),
    get: (id: string) => request<Instructor>(`/instructors/${id}`),
    getBySlug: (slug: string) => request<Instructor>(`/instructors/slug/${slug}`),

    // Admin methods (also in original api.instructors.admin... oh checking api.ts again)
    // api.ts has `api.instructors` for public and `api.admin.instructors` for admin.
    // Ideally we merge them or keep them separate?
    // Let's keep them separate to follow SoC, but maybe put admin methods here too?
    // For now, let's extract ONLY what was in `api.instructors`.
    // Wait, `api.admin.instructors` is different.
    // I will put `api.admin.instructors` into `features/system/api/admin-instructors.api.ts` or similar?
    // Actually, `system` feature usually handles admin.
    // But `instructors` is LMS core.
    // Managing instructors is an Admin function of LMS.

    // Decision: Put ALL instructor logic here (public + admin) but separate by object key if needed.
    // Or keep `admin` separate in `system`.
    // Given the request to group by FEATURE, I should put admin-lms things in LMS.
    // So `api.admin.instructors` -> `lms/api/instructors.api.ts` (export admin object).
};

export const adminInstructorsApi = {
    list: () => request<{ data: Instructor[], meta: any }>('/instructors'),
    get: (id: string) => request<Instructor>(`/instructors/${id}`),
    create: (data: unknown) => request<Instructor>('/instructors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request<Instructor>(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/instructors/${id}`, { method: 'DELETE' }),
};
