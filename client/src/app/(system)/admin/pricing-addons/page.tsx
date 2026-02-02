'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { Switch } from '@/components/Switch';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';
import { Plus, Search, Edit, Trash, Tags } from 'lucide-react';

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
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddOn, setCurrentAddOn] = useState<Partial<PricingAddOn>>({});

    const fetchAddOns = async () => {
        try {
            setLoading(true);
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

    const handleCreate = () => {
        setCurrentAddOn({ isActive: true, features: [] });
        setIsEditing(true);
    };

    const handleEdit = (addOn: PricingAddOn) => {
        setCurrentAddOn({
            ...addOn,
            priceAddon: Number(addOn.priceAddon),
            compareAtAddon: Number(addOn.compareAtAddon) || undefined
        });
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentAddOn.name?.trim()) {
            addToast('Vui lòng nhập tên gói', 'error');
            return;
        }

        const payload = {
            name: currentAddOn.name.trim(),
            description: currentAddOn.description?.trim() || null,
            priceAddon: Number(currentAddOn.priceAddon) || 0,
            compareAtAddon: Number(currentAddOn.compareAtAddon) || null,
            features: currentAddOn.features || [],
            isActive: currentAddOn.isActive ?? true
        };

        try {
            if (currentAddOn.id) {
                const res: any = await api.pricingAddOns.update(currentAddOn.id, payload);
                setAddOns(prev => prev.map(a => a.id === res.id ? res : a));
                addToast('Đã cập nhật gói giá', 'success');
            } else {
                const res: any = await api.pricingAddOns.create(payload);
                setAddOns(prev => [...prev, res]);
                addToast('Đã tạo gói giá mới', 'success');
            }
            setIsEditing(false);
            setCurrentAddOn({});
        } catch (error) {
            console.error(error);
            addToast('Lưu thất bại', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const addOn = addOns.find(a => a.id === id);
        const confirmed = await confirm({
            title: 'Xóa gói giá?',
            message: `Bạn có chắc muốn xóa gói "${addOn?.name}"?`,
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;

        try {
            await api.pricingAddOns.delete(id);
            addToast('Đã xóa gói giá', 'success');
            setAddOns(addOns.filter(a => a.id !== id));
            if (currentAddOn.id === id) {
                setIsEditing(false);
                setCurrentAddOn({});
            }
        } catch (error) {
            console.error(error);
            addToast('Xóa thất bại', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Gói Add-on"
                subtitle="Quản lý các gói bổ trợ và dịch vụ đi kèm"
                icon={<Tags className="w-8 h-8" />}
            />

            <div className="relative">
                <Card className={`border-neutral-200 shadow-none ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-100 px-6 pt-6">
                        <CardTitle className="text-lg font-semibold text-neutral-900">Danh sách gói Add-on</CardTitle>
                        <Button
                            onClick={handleCreate}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100"
                            title="Thêm mới"
                        >
                            <Plus size={18} className="text-neutral-900" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {addOns.length === 0 && !loading ? (
                            <div className="p-8 text-center text-neutral-400 text-sm">Chưa có gói giá nào</div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {addOns.map((addOn) => (
                                    <div key={addOn.id} className="group flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-neutral-900">{addOn.name}</span>
                                                {!addOn.isActive && (
                                                    <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200 font-medium">Ẩn</span>
                                                )}
                                            </div>
                                            {addOn.description && (
                                                <p className="text-xs text-neutral-500 mt-0.5">{addOn.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-neutral-900">
                                                    +{Number(addOn.priceAddon).toLocaleString()}đ
                                                </div>
                                                {addOn.compareAtAddon && Number(addOn.compareAtAddon) > 0 && (
                                                    <div className="text-xs text-neutral-400 line-through">
                                                        +{Number(addOn.compareAtAddon).toLocaleString()}đ
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TableActions
                                                    onEdit={() => handleEdit(addOn)}
                                                    onDelete={() => handleDelete(addOn.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <Card className="w-full max-w-lg shadow-2xl border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
                            <CardHeader className="border-b border-neutral-100 pb-4">
                                <CardTitle className="text-lg font-bold text-neutral-900">
                                    {currentAddOn.id ? 'Cập nhật gói Add-on' : 'Thêm gói Add-on mới'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSave} className="space-y-5">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Tên gói *</label>
                                            <Input
                                                value={currentAddOn.name || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, name: e.target.value })}
                                                required
                                                placeholder="VD: E-learning + 1:1 Support"
                                                className="h-10 border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Mô tả ngắn</label>
                                            <Input
                                                value={currentAddOn.description || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, description: e.target.value })}
                                                placeholder="VD: Hỗ trợ 1-1 qua Zoom"
                                                className="h-10 border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Giá cộng thêm (VND)</label>
                                            <Input
                                                type="number"
                                                value={currentAddOn.priceAddon || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, priceAddon: Number(e.target.value) })}
                                                placeholder="500000"
                                                className="h-10 border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Giá gốc để gạch</label>
                                            <Input
                                                type="number"
                                                value={currentAddOn.compareAtAddon || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, compareAtAddon: Number(e.target.value) })}
                                                placeholder="800000"
                                                className="h-10 border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Quyền lợi (mỗi dòng 1 item)</label>
                                        <textarea
                                            value={(currentAddOn.features || []).join('\n')}
                                            onChange={e => setCurrentAddOn({ ...currentAddOn, features: e.target.value.split('\n').filter(Boolean) })}
                                            placeholder="2 buổi 1:1 mỗi tuần&#10;Hỗ trợ qua Telegram&#10;Review code trực tiếp"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-background focus:border-neutral-900 focus:ring-neutral-900/10 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-neutral-700">Hiển thị trên trang khóa học</span>
                                        <Switch
                                            checked={currentAddOn.isActive || false}
                                            onChange={(checked) => setCurrentAddOn({ ...currentAddOn, isActive: checked })}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => { setIsEditing(false); setCurrentAddOn({}); }}
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
