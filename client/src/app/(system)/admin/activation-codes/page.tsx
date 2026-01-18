'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { DynamicIcon } from '@/components/DynamicIcon';
import { cn } from '@/lib/utils';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

export default function ActivationCodesPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [codes, setCodes] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ courseId: '', count: 1 });

    const fetchData = async () => {
        try {
            const [codesData, coursesData]: any = await Promise.all([
                api.activationCodes.list(),
                api.admin.courses.list()
            ]);
            setCodes(codesData);
            setCourses(coursesData);
        } catch (error) {
            console.error(error);
            addToast('Không thể tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await api.activationCodes.create(formData.courseId, formData.count);
            addToast(`Đã tạo ${formData.count} mã kích hoạt`, 'success');
            setFormData({ ...formData, count: 1 });
            fetchData();
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string, code: string) => {
        const confirmed = await confirm({
            title: 'Xác nhận xóa',
            message: `Bạn có chắc muốn xóa mã "${code}"?`,
            variant: 'danger'
        });
        if (!confirmed) return;
        try {
            await api.activationCodes.delete(id);
            addToast('Đã xóa mã', 'success');
            setCodes(codes.filter(c => c.id !== id));
        } catch (error: any) {
            addToast(error.message, 'error');
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý Mã kích hoạt"
                subtitle="Tạo và quản lý mã kích hoạt khóa học thủ công."
            />

            <div className="bg-muted/30 p-6 rounded-xl border">
                <h3 className="text-lg font-bold mb-4">Tạo mã kích hoạt thủ công</h3>
                <form onSubmit={handleCreate} className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Chọn khoá học</label>
                        <select
                            required
                            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[300px]"
                            value={formData.courseId}
                            onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                        >
                            <option value="">Chọn một khoá học...</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Số lượng</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.count}
                            onChange={e => setFormData({ ...formData, count: parseInt(e.target.value) })}
                        />
                    </div>
                    <Button type="submit" disabled={isCreating || !formData.courseId}>
                        {isCreating ? 'Đang tạo...' : '+ Tạo mã'}
                    </Button>
                </form>
            </div>

            <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="px-4 py-4 text-left font-medium">Mã kích hoạt</th>
                            <th className="px-4 py-4 text-left font-medium">Khoá học</th>
                            <th className="px-4 py-4 text-left font-medium">Ngày tạo</th>
                            <th className="px-4 py-4 text-left font-medium">Người mua</th>
                            <th className="px-4 py-4 text-left font-medium">Trạng thái</th>
                            <th className="px-4 py-4 text-left font-medium">Người sử dụng</th>
                            <th className="px-4 py-4 text-right font-medium">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {codes.map((code) => (
                            <tr key={code.id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-4 py-4 font-mono font-bold text-primary">{code.code}</td>
                                <td className="px-4 py-4 max-w-[200px] truncate">{code.course.title}</td>
                                <td className="px-4 py-4 text-muted-foreground">
                                    {new Date(code.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-4 py-4">
                                    {code.buyer ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{code.buyer.profile?.name || 'Học viên'}</span>
                                            <span className="text-[10px] text-muted-foreground">{code.buyer.email}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">Admin tạo</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        code.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                    )}>
                                        {code.status === 'ACTIVE' ? 'Chưa dùng' : 'Đã dùng'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {code.redeemedBy ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{code.redeemedBy.profile?.name || 'Học viên'}</span>
                                            <span className="text-[10px] text-muted-foreground">{code.redeemedBy.email}</span>
                                            <span className="text-[10px] text-muted-foreground">Lúc: {new Date(code.redeemedAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    ) : '-'}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    {code.status === 'ACTIVE' && (
                                        <div className="flex justify-end">
                                            <TableActions
                                                onDelete={() => handleDelete(code.id, code.code)}
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {codes.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-20 text-center text-muted-foreground">
                                    Chưa có mã kích hoạt nào được tạo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
