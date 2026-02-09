import { request } from '@/lib/api-client';

export const whiteboardApi = {
    list: () => request<any[]>('/whiteboards/my'),
    get: (id: string) => request<any>(`/whiteboards/${id}`),
    create: (data: { title?: string; description?: string }) => request<any>('/whiteboards', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/whiteboards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/whiteboards/${id}`, { method: 'DELETE' }),
    saveArtboard: (artboardId: string, data: any) => request<any>(`/whiteboards/artboards/${artboardId}/state`, { method: 'PUT', body: JSON.stringify(data) }),
    addArtboard: (id: string, name?: string) => request<any>(`/whiteboards/${id}/artboards`, { method: 'POST', body: JSON.stringify({ name }) }),
    saveSnapshot: (id: string, artboardId: string, elements: any) => request<any>(`/whiteboards/${id}/snapshots`, { method: 'POST', body: JSON.stringify({ artboardId, elements }) }),
    getAdminStats: () => request<any>('/whiteboards/admin/stats'),
};
