'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Calendar, Plus, Edit, Trash, MapPin, Clock, Users } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';

import { Switch } from '@/components/Switch';

interface Event {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    type: 'WEBINAR' | 'WORKSHOP' | 'COURSE' | 'MEETUP' | 'OTHER';
    link?: string;
    isActive: boolean;
}

const EVENT_TYPES = [
    { value: 'WEBINAR', label: 'Webinar' },
    { value: 'COURSE', label: 'Khóa học' },
    { value: 'MEETUP', label: 'Meetup' },
    { value: 'OTHER', label: 'Khác' },
];

export default function AdminEventsPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'WEBINAR' as Event['type'],
        link: '',
        isActive: true,
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res: any = await api.events.list(true);
            setEvents(res.data || []);
        } catch (error) {
            console.error('Failed to load events', error);
            addToast('Lỗi tải danh sách sự kiện', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await api.events.update(editingEvent.id, formData);
                addToast('Cập nhật sự kiện thành công', 'success');
            } else {
                await api.events.create(formData);
                addToast('Tạo sự kiện mới thành công', 'success');
            }
            resetForm();
            loadEvents();
        } catch (error: any) {
            addToast(`Lỗi: ${error?.message || 'Unknown error'}`, 'error');
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            date: event.date.split('T')[0],
            time: event.time || '',
            type: event.type,
            link: event.link || '',
            isActive: event.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa sự kiện?',
            message: 'Bạn có chắc chắn muốn xóa sự kiện này?',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;
        try {
            await api.events.delete(id);
            addToast('Xóa sự kiện thành công', 'success');
            loadEvents();
        } catch (error) {
            addToast('Xóa sự kiện thất bại', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            type: 'WEBINAR',
            link: '',
            isActive: true,
        });
        setEditingEvent(null);
        setShowForm(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Sự kiện"
                subtitle="Quản lý sự kiện, hội thảo và lịch đào tạo"
                icon={<Calendar className="w-8 h-8" />}
            >
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                    <Plus size={16} /> {showForm ? 'Hủy' : 'Tạo sự kiện mới'}
                </Button>
            </AdminPageHeader>

            {showForm && (
                <Card>
                    <CardContent className="p-6 pt-8">
                        <h3 className="font-bold text-lg mb-4">
                            {editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên sự kiện *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giờ</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Loại sự kiện *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        {EVENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Link</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                    />
                                    <span className="text-sm font-medium select-none">Hiển thị sự kiện</span>
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">
                                    {editingEvent ? 'Cập nhật' : 'Tạo sự kiện'}
                                </Button>
                                <Button type="button" onClick={resetForm} variant="outline">
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardContent className="p-6 pt-6 flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    {!event.isActive && (
                                        <span className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">
                                            Đã ẩn
                                        </span>
                                    )}
                                </div>
                                {event.description && (
                                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{formatDate(event.date)}</span>
                                    {event.time && (
                                        <>
                                            <span>•</span>
                                            <span>{event.time}</span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs">
                                        {EVENT_TYPES.find(t => t.value === event.type)?.label}
                                    </span>
                                    {event.link && (
                                        <>
                                            <span>•</span>
                                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                Link
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                            <TableActions
                                onEdit={() => handleEdit(event)}
                                onDelete={() => handleDelete(event.id)}
                            />
                        </CardContent>
                    </Card>
                ))}

                {events.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                        Chưa có sự kiện nào. Hãy tạo sự kiện đầu tiên!
                    </div>
                )}
            </div>
        </div>
    );
}
