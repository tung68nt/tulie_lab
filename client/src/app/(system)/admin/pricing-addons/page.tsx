'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { Plus, GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';

interface PricingAddOn {
    id: string;
    name: string;
    description?: string;
    priceAddon: number;
    compareAtAddon?: number;
    features: string[];
    position: number;
    isActive: boolean;
}

export default function PricingAddOnsPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [addOns, setAddOns] = useState<PricingAddOn[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        priceAddon: 0,
        compareAtAddon: 0,
        features: '',
        isActive: true
    });

    const fetchAddOns = async () => {
        try {
            const data: any = await api.pricingAddOns.list(true);
            setAddOns(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            addToast('Không thể tải danh sách gói giá', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddOns();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            priceAddon: 0,
            compareAtAddon: 0,
            features: '',
            isActive: true
        });
        setEditingId(null);
        setIsCreating(false);
    };

    const handleEdit = (addOn: PricingAddOn) => {
        setFormData({
            name: addOn.name,
            description: addOn.description || '',
            priceAddon: Number(addOn.priceAddon),
            compareAtAddon: Number(addOn.compareAtAddon) || 0,
            features: (addOn.features || []).join('\n'),
            isActive: addOn.isActive
        });
        setEditingId(addOn.id);
        setIsCreating(false);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            addToast('Vui lòng nhập tên gói', 'error');
            return;
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            priceAddon: Number(formData.priceAddon) || 0,
            compareAtAddon: Number(formData.compareAtAddon) || null,
            features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
            isActive: formData.isActive
        };

        try {
            if (editingId) {
                await api.pricingAddOns.update(editingId, payload);
                addToast('Đã cập nhật gói giá', 'success');
            } else {
                await api.pricingAddOns.create(payload);
                addToast('Đã tạo gói giá mới', 'success');
            }
            resetForm();
            fetchAddOns();
        } catch (error) {
            console.error(error);
            addToast('Lưu thất bại', 'error');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Xác nhận xóa',
            message: `Bạn có chắc muốn xóa gói "${name}"?`,
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;

        try {
            await api.pricingAddOns.delete(id);
            addToast('Đã xóa gói giá', 'success');
            setAddOns(addOns.filter(a => a.id !== id));
        } catch (error) {
            console.error(error);
            addToast('Xóa thất bại', 'error');
        }
    };

    const handleToggleActive = async (addOn: PricingAddOn) => {
        try {
            await api.pricingAddOns.update(addOn.id, { isActive: !addOn.isActive });
            setAddOns(addOns.map(a => a.id === addOn.id ? { ...a, isActive: !a.isActive } : a));
            addToast(`Đã ${addOn.isActive ? 'ẩn' : 'hiện'} gói giá`, 'success');
        } catch (error) {
            console.error(error);
            addToast('Cập nhật thất bại', 'error');
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý gói giá Add-on"
                subtitle="Tạo các gói quyền lợi bổ sung cho khóa học (1:1 support, video call, ...)"
            >
                {!isCreating && !editingId && (
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo gói mới
                    </Button>
                )}
            </AdminPageHeader>

            {/* Create/Edit Form */}
            {(isCreating || editingId) && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingId ? 'Chỉnh sửa gói giá' : 'Tạo gói giá mới'}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Tên gói *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: E-learning + 1:1 Support"
                                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Mô tả ngắn</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="VD: Hỗ trợ 1-1 qua Zoom"
                                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Giá cộng thêm (VND)</label>
                                <input
                                    type="number"
                                    value={formData.priceAddon}
                                    onChange={(e) => setFormData({ ...formData, priceAddon: Number(e.target.value) })}
                                    placeholder="500000"
                                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Giá gốc để gạch (nếu có)</label>
                                <input
                                    type="number"
                                    value={formData.compareAtAddon}
                                    onChange={(e) => setFormData({ ...formData, compareAtAddon: Number(e.target.value) })}
                                    placeholder="800000"
                                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">Danh sách quyền lợi (mỗi dòng 1 item)</label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    placeholder="2 buổi 1:1 mỗi tuần&#10;Hỗ trợ qua Telegram&#10;Review code trực tiếp"
                                    rows={4}
                                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-sm">Hiển thị trên trang khóa học</label>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <Button onClick={handleSave}>
                                <Check className="w-4 h-4 mr-2" />
                                Lưu
                            </Button>
                            <Button variant="ghost" onClick={resetForm}>
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* List */}
            <div className="space-y-3">
                {addOns.length === 0 ? (
                    <Card>
                        <CardContent className="min-h-[200px] flex items-center justify-center text-muted-foreground">
                            Chưa có gói giá nào. Hãy tạo gói đầu tiên!
                        </CardContent>
                    </Card>
                ) : (
                    addOns.map((addOn) => (
                        <Card key={addOn.id} className={`${!addOn.isActive ? 'opacity-50' : ''}`}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="text-muted-foreground cursor-move">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{addOn.name}</h3>
                                            {!addOn.isActive && (
                                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Ẩn</span>
                                            )}
                                        </div>
                                        {addOn.description && (
                                            <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
                                        )}
                                        {addOn.features?.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {addOn.features.map((f, i) => (
                                                    <li key={i} className="text-xs text-muted-foreground">• {f}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-bold">
                                            +{Number(addOn.priceAddon).toLocaleString()}đ
                                        </div>
                                        {addOn.compareAtAddon && Number(addOn.compareAtAddon) > 0 && (
                                            <div className="text-xs text-muted-foreground line-through">
                                                +{Number(addOn.compareAtAddon).toLocaleString()}đ
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(addOn)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleActive(addOn)}
                                        >
                                            {addOn.isActive ? 'Ẩn' : 'Hiện'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(addOn.id, addOn.name)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
