'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { useConfirm } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Switch } from '@/components/Switch';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Classification {
    id: string;
    name: string;
    type: 'PRODUCT_TYPE' | 'PRODUCT_FIELD';
    isActive: boolean;
}

export default function AdminProductClassificationsPage() {
    const [classifications, setClassifications] = useState<Classification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClassification, setCurrentClassification] = useState<Partial<Classification>>({});
    const { addToast } = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        fetchClassifications();
    }, []);

    const fetchClassifications = async () => {
        try {
            setLoading(true);
            const res: any = await api.products.listClassifications();
            setClassifications(res || []);
        } catch (error) {
            console.error(error);
            addToast('Lỗi tải danh sách phân loại', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa phân loại?',
            message: 'Bạn có chắc chắn muốn xóa phân loại này? Điều này có thể ảnh hưởng đến các sản phẩm đang sử dụng nó.',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });

        if (!confirmed) return;

        try {
            await api.products.deleteClassification(id);
            addToast('Đã xóa phân loại', 'success');
            setClassifications(prev => prev.filter(c => c.id !== id));
            if (currentClassification.id === id) {
                setIsEditing(false);
                setCurrentClassification({});
            }
        } catch (error) {
            addToast('Lỗi xóa phân loại', 'error');
        }
    };

    const handleEdit = (classification: Classification) => {
        setCurrentClassification(classification);
        setIsEditing(true);
    };

    const handleCreate = (type: 'PRODUCT_TYPE' | 'PRODUCT_FIELD') => {
        setCurrentClassification({ type, isActive: true });
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentClassification.id) {
                const res: any = await api.products.updateClassification(currentClassification.id, currentClassification);
                setClassifications(prev => prev.map(c => c.id === res.id ? res : c));
                addToast('Đã cập nhật phân loại', 'success');
            } else {
                const res: any = await api.products.createClassification(currentClassification);
                setClassifications(prev => [...prev, res]);
                addToast('Đã tạo phân loại mới', 'success');
            }
            setIsEditing(false);
            setCurrentClassification({});
        } catch (error) {
            addToast('Lỗi lưu phân loại', 'error');
        }
    };

    const types = classifications.filter(c => c.type === 'PRODUCT_TYPE');
    const fields = classifications.filter(c => c.type === 'PRODUCT_FIELD');

    const renderList = (title: string, list: Classification[], type: 'PRODUCT_TYPE' | 'PRODUCT_FIELD') => (
        <Card className="h-full border-neutral-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-100 px-6 pt-6">
                <CardTitle className="text-lg font-semibold text-neutral-900">{title}</CardTitle>
                <Button
                    onClick={() => handleCreate(type)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100"
                    title="Thêm mới"
                >
                    <Plus size={18} className="text-neutral-900" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {list.length === 0 && !loading ? (
                    <div className="p-8 text-center text-neutral-400 text-sm">Chưa có dữ liệu</div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {list.map((item) => (
                            <div key={item.id} className="group flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-neutral-900">{item.name}</span>
                                    {!item.isActive && (
                                        <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200 font-medium">Ẩn</span>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TableActions
                                        onEdit={() => handleEdit(item)}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Phân loại Sản phẩm"
                subtitle="Quản lý các danh mục và thuộc tính phân loại."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Product Types Column */}
                <div className={isEditing ? 'opacity-50 pointer-events-none' : ''}>
                    {renderList('Loại sản phẩm', types, 'PRODUCT_TYPE')}
                </div>

                {/* Product Fields Column */}
                <div className={isEditing ? 'opacity-50 pointer-events-none' : ''}>
                    {renderList('Lĩnh vực', fields, 'PRODUCT_FIELD')}
                </div>

                {/* Edit Modal / Form Overlay */}
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <Card className="w-full max-w-md shadow-2xl border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
                            <CardHeader className="border-b border-neutral-100 pb-4">
                                <CardTitle className="text-lg font-bold text-neutral-900">
                                    {currentClassification.id ? 'Cập nhật' : 'Thêm mới'}
                                    {currentClassification.type === 'PRODUCT_TYPE' ? ' Loại sản phẩm' : ' Lĩnh vực'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSave} className="space-y-5">
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 block">Tên hiển thị</label>
                                        <Input
                                            value={currentClassification.name || ''}
                                            onChange={e => setCurrentClassification({ ...currentClassification, name: e.target.value })}
                                            required
                                            placeholder="Ví dụ: Landing Page, Marketing..."
                                            className="h-10 border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-neutral-700">Trạng thái hoạt động</span>
                                        <Switch
                                            checked={currentClassification.isActive || false}
                                            onChange={(checked) => setCurrentClassification({ ...currentClassification, isActive: checked })}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => { setIsEditing(false); setCurrentClassification({}); }}
                                            className="flex-1 border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white shadow-none"
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
