'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { addToast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'SYSTEM',
        isActive: true,
        targetAll: true,
        targetBirthday: false,
        startDate: '',
        endDate: ''
    });

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            type: 'SYSTEM',
            isActive: true,
            targetAll: true,
            targetBirthday: false,
            startDate: '',
            endDate: ''
        });
        setEditingId(null);
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res: any = await api.notifications.listAll();
            setNotifications(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
            addToast('Lỗi khi tải danh sách thông báo', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentNotifications = notifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleEdit = (n: any) => {
        setEditingId(n.id);
        setFormData({
            title: n.title || '',
            content: n.content || '',
            type: n.type || 'SYSTEM',
            isActive: n.isActive ?? true,
            targetAll: n.targetAll ?? true,
            targetBirthday: n.targetBirthday ?? false,
            startDate: n.startDate ? n.startDate.split('T')[0] : '',
            endDate: n.endDate ? n.endDate.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = { ...formData };
            if (!payload.startDate) delete payload.startDate;
            if (!payload.endDate) delete payload.endDate;

            if (editingId) {
                // Update existing
                await api.notifications.update(editingId, payload);
                addToast('Cập nhật thông báo thành công', 'success');
            } else {
                // Create new
                await api.notifications.create(payload);
                addToast('Tạo thông báo thành công', 'success');
            }

            setShowModal(false);
            resetForm();
            fetchNotifications();
        } catch (error) {
            console.error(error);
            addToast(editingId ? 'Lỗi khi cập nhật thông báo' : 'Lỗi khi tạo thông báo', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
        try {
            await api.notifications.delete(id);
            addToast('Đã xóa thông báo', 'success');
            fetchNotifications();
        } catch (error: any) {
            addToast('Không thể xóa thông báo', 'error');
        }
    };

    const handleToggleActive = async (n: any) => {
        try {
            await api.notifications.update(n.id, { isActive: !n.isActive });
            setNotifications(prev => prev.map(item =>
                item.id === n.id ? { ...item, isActive: !item.isActive } : item
            ));
            addToast(n.isActive ? 'Đã tắt thông báo' : 'Đã kích hoạt thông báo', 'success');
        } catch (error) {
            addToast('Không thể thay đổi trạng thái', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý Thông báo</h1>
                <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Tạo thông báo mới</Button>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-1/4">Tiêu đề</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Loại</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Mục tiêu</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Trạng thái</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Ngày tạo</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {currentNotifications.map((n) => (
                                <tr key={n.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="space-y-1">
                                            <div className="font-medium">{n.title}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-2 max-w-[300px]">
                                                {n.content}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold capitalize">
                                            {n.type.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {n.targetAll ? 'Tất cả' : n.targetBirthday ? 'Sinh nhật' : 'Tùy chọn'}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {n.isActive ? (
                                            <span className="bg-foreground text-background px-2 py-0.5 rounded-full font-bold text-[10px] capitalize">Active</span>
                                        ) : (
                                            <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold text-[10px] capitalize">Draft</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(n)}
                                                className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-muted transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(n.id)}
                                                className="text-muted-foreground hover:text-red-600 p-1.5 rounded hover:bg-muted transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {notifications.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Chưa có thông báo nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, notifications.length)} trong số {notifications.length} bản ghi
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Trước
                        </Button>
                        <div className="text-sm font-medium">
                            Trang {currentPage} / {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-background rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {editingId ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tiêu đề</label>
                                <input
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nội dung</label>
                                <textarea
                                    required
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Loại thông báo</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="SYSTEM">Hệ thống</option>
                                        <option value="BIRTHDAY">Sinh nhật</option>
                                        <option value="PROMOTION">Khuyến mãi</option>
                                        <option value="MAINTENANCE">Bảo trì</option>
                                        <option value="HOLIDAY">Lễ tết</option>
                                        <option value="COURSE_UPDATE">Cập nhật khóa học</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-7">
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                                        id="isActive"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Kích hoạt</label>
                                </div>
                            </div>

                            <div className="space-y-4 border p-4 rounded-md">
                                <h4 className="text-sm font-semibold">Đối tượng gửi</h4>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="targetAll" className="text-sm cursor-pointer">Tất cả người dùng</label>
                                    <Switch
                                        checked={formData.targetAll}
                                        onChange={(checked: boolean) => setFormData({
                                            ...formData,
                                            targetAll: checked,
                                            targetBirthday: checked ? false : formData.targetBirthday
                                        })}
                                        id="targetAll"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="targetBirthday" className="text-sm cursor-pointer">Người dùng có sinh nhật hôm nay</label>
                                    <Switch
                                        checked={formData.targetBirthday}
                                        onChange={(checked: boolean) => setFormData({
                                            ...formData,
                                            targetBirthday: checked,
                                            targetAll: checked ? false : formData.targetAll
                                        })}
                                        id="targetBirthday"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ngày bắt đầu (Optional)</label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ngày kết thúc (Optional)</label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="ghost" onClick={() => { setShowModal(false); resetForm(); }}>Hủy</Button>
                                <Button type="submit">{editingId ? 'Cập nhật' : 'Lưu thông báo'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
