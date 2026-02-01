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
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ targetType: 'COURSE', courseId: '', productId: '', count: 1 });

    const fetchData = async () => {
        try {
            const [codesData, coursesData, productsData]: any = await Promise.all([
                api.activationCodes.list(),
                api.admin.courses.list(),
                api.products.list({ limit: 100 })
            ]);
            setCodes(Array.isArray(codesData) ? codesData : codesData.data || []);
            setCourses(Array.isArray(coursesData) ? coursesData : coursesData.data || []);
            setProducts(Array.isArray(productsData) ? productsData : productsData.data || []);
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
            const courseId = formData.targetType === 'COURSE' ? formData.courseId : null;
            const productId = formData.targetType === 'PRODUCT' ? formData.productId : undefined;
            await api.activationCodes.create(courseId, formData.count, productId);
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

    const currentTargetId = formData.targetType === 'COURSE' ? formData.courseId : formData.productId;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý Mã kích hoạt"
                subtitle="Tạo và quản lý mã kích hoạt khóa học & sản phẩm thủ công."
            />

            <div className="bg-muted/30 p-6 rounded-xl border">
                <h3 className="text-lg font-bold mb-4">Tạo mã kích hoạt thủ công</h3>
                <form onSubmit={handleCreate} className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Loại sản phẩm</label>
                        <select
                            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-40"
                            value={formData.targetType}
                            onChange={e => setFormData({ ...formData, targetType: e.target.value, courseId: '', productId: '' })}
                        >
                            <option value="COURSE">Khóa học</option>
                            <option value="PRODUCT">Sản phẩm (Shop)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {formData.targetType === 'COURSE' ? 'Chọn khoá học' : 'Chọn sản phẩm'}
                        </label>
                        <select
                            required
                            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[300px]"
                            value={currentTargetId}
                            onChange={e => {
                                if (formData.targetType === 'COURSE') setFormData({ ...formData, courseId: e.target.value });
                                else setFormData({ ...formData, productId: e.target.value });
                            }}
                        >
                            <option value="">Chọn một...</option>
                            {formData.targetType === 'COURSE'
                                ? courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                                : products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)
                            }
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium opacity-0">Thao tác</label>
                        <Button type="submit" disabled={isCreating || !currentTargetId} className="h-10 w-full">
                            {isCreating ? 'Đang tạo...' : '+ Tạo mã'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="border rounded-lg overflow-hidden bg-background shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b text-muted-foreground">
                        <tr>
                            <th className="px-4 py-4 text-left font-medium">Mã kích hoạt</th>
                            <th className="px-4 py-4 text-left font-medium">Sản phẩm / Khoá học</th>
                            <th className="px-4 py-4 text-left font-medium">Loại</th>
                            <th className="px-4 py-4 text-left font-medium">Ngày tạo</th>
                            <th className="px-4 py-4 text-left font-medium">Người mua</th>
                            <th className="px-4 py-4 text-left font-medium">Trạng thái</th>
                            <th className="px-4 py-4 text-left font-medium">Người sử dụng</th>
                            <th className="px-4 py-4 text-right font-medium">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {codes.map((code) => (
                            <tr key={code.id} className="hover:bg-muted/5 transition-colors">
                                <td className="px-4 py-4 font-mono font-bold text-primary select-all">{code.code}</td>
                                <td className="px-4 py-4 max-w-[200px] truncate font-medium">
                                    {code.course?.title || code.product?.title || 'Unknown'}
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[10px] border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded">
                                        {code.courseId ? 'Course' : 'Product'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-col text-xs">
                                        <span className="text-neutral-900">{new Date(code.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="text-neutral-400">{new Date(code.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    {code.buyer ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium text-xs truncate max-w-[120px]">{code.buyer.profile?.name || 'User'}</span>
                                            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{code.buyer.email}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Admin</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded border",
                                        code.status === 'ACTIVE' ? "border-neutral-300 text-neutral-700" : "border-neutral-200 text-neutral-400"
                                    )}>
                                        {code.status === 'ACTIVE' ? 'Active' : 'Used'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {code.redeemedBy ? (
                                        <div className="flex flex-col whitespace-nowrap">
                                            <span className="font-medium text-xs">{code.redeemedBy.profile?.name || 'Học viên'}</span>
                                            <span className="text-[10px] text-muted-foreground">{code.redeemedBy.email}</span>
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
                                <td colSpan={8} className="px-4 py-20 text-center text-muted-foreground">
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
