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
    type?: 'VIDEO' | 'CHAT' | 'REVIEW' | 'OTHER';
    sessionCount?: number;
    sessionDuration?: number; // minutes
    curriculum?: string[]; // Simplified for UI editing as list of strings
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
        setCurrentAddOn({ isActive: true, features: [], type: 'OTHER', sessionCount: 0, sessionDuration: 60, curriculum: [] });
        setIsEditing(true);
    };

    const handleEdit = (addOn: PricingAddOn) => {
        setCurrentAddOn({
            ...addOn,
            priceAddon: Number(addOn.priceAddon),
            compareAtAddon: Number(addOn.compareAtAddon) || undefined,
            // Ensure curriculum is array
            curriculum: Array.isArray(addOn.curriculum) ? addOn.curriculum : []
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
            isActive: currentAddOn.isActive ?? true,
            type: currentAddOn.type || 'OTHER',
            sessionCount: Number(currentAddOn.sessionCount) || 0,
            sessionDuration: Number(currentAddOn.sessionDuration) || 60,
            curriculum: currentAddOn.curriculum || [],
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
            >
                <Button onClick={handleCreate} className="gap-2">
                    <Plus size={18} />
                    Thêm gói mới
                </Button>
            </AdminPageHeader>

            <div className="relative">
                <Card className={`border-neutral-200 shadow-sm ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
                    <CardContent className="p-0">
                        {addOns.length === 0 && !loading ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-neutral-500">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                    <Tags className="w-8 h-8 text-neutral-400" />
                                </div>
                                <p className="text-sm font-medium text-neutral-900">Chưa có gói giá nào</p>
                                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">Tạo gói giá mới để cung cấp thêm dịch vụ cho học viên</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {addOns.map((addOn) => (
                                    <div key={addOn.id} className="group flex items-center justify-between p-5 hover:bg-neutral-50/80 transition-all">
                                        <div className="flex-1 min-w-0 pr-8">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-base font-semibold text-neutral-900">{addOn.name}</span>
                                                <span className="text-[10px] uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full border border-neutral-200 font-bold tracking-wider">
                                                    {addOn.type || 'OTHER'}
                                                </span>
                                                {!addOn.isActive && (
                                                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 font-bold">Ẩn</span>
                                                )}
                                            </div>
                                            {addOn.description && (
                                                <p className="text-sm text-neutral-500 line-clamp-1">{addOn.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-base font-bold text-neutral-900 tracking-tight">
                                                    +{Number(addOn.priceAddon).toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 overflow-y-auto">
                        <Card className="w-full max-w-2xl shadow-2xl border-neutral-200 animate-in fade-in zoom-in-95 duration-200 my-8">
                            <CardHeader className="border-b border-neutral-100 pb-4">
                                <CardTitle className="text-lg font-bold text-neutral-900">
                                    {currentAddOn.id ? 'Cập nhật gói Add-on' : 'Thêm gói Add-on mới'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSave} className="space-y-5">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Tên gói *</label>
                                            <Input
                                                value={currentAddOn.name || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, name: e.target.value })}
                                                required
                                                placeholder="VD: E-learning + 1:1 Support"
                                                className="h-10"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Mô tả ngắn</label>
                                            <Input
                                                value={currentAddOn.description || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, description: e.target.value })}
                                                placeholder="VD: Hỗ trợ 1-1 qua Zoom"
                                                className="h-10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Loại hình</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={currentAddOn.type || 'OTHER'}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, type: e.target.value as any })}
                                            >
                                                <option value="OTHER">Khác (Tài liệu/Source code)</option>
                                                <option value="VIDEO">Video Call 1:1</option>
                                                <option value="CHAT">Chat Support (Zalo/Tele)</option>
                                                <option value="REVIEW">Code Review</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Hiển thị</label>
                                            <div className="flex items-center h-10">
                                                <Switch
                                                    checked={currentAddOn.isActive || false}
                                                    onChange={(checked) => setCurrentAddOn({ ...currentAddOn, isActive: checked })}
                                                />
                                                <span className="ml-2 text-sm">{currentAddOn.isActive ? 'Đang hiện' : 'Đang ẩn'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Giá cộng thêm (VND)</label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    value={currentAddOn.priceAddon ? Number(currentAddOn.priceAddon).toLocaleString('vi-VN') : ''}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setCurrentAddOn({ ...currentAddOn, priceAddon: val ? Number(val) : 0 });
                                                    }}
                                                    placeholder="500.000"
                                                    className="h-10 pr-8"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-medium">đ</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Giá gốc để gạch</label>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    value={currentAddOn.compareAtAddon ? Number(currentAddOn.compareAtAddon).toLocaleString('vi-VN') : ''}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setCurrentAddOn({ ...currentAddOn, compareAtAddon: val ? Number(val) : 0 });
                                                    }}
                                                    placeholder="800.000"
                                                    className="h-10 pr-8"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-medium">đ</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mentoring Specific Fields */}
                                    {(currentAddOn.type === 'VIDEO' || currentAddOn.type === 'CHAT' || currentAddOn.type === 'REVIEW') && (
                                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                            <h4 className="text-sm font-bold text-primary mb-3">Cấu hình Mentoring</h4>
                                            <div className="grid gap-4 md:grid-cols-2 mb-4">
                                                <div>
                                                    <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Số buổi/lượt</label>
                                                    <Input
                                                        type="number"
                                                        value={currentAddOn.sessionCount || ''}
                                                        onChange={e => setCurrentAddOn({ ...currentAddOn, sessionCount: Number(e.target.value) })}
                                                        placeholder="VD: 15"
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Thời lượng (phút/buổi)</label>
                                                    <Input
                                                        type="number"
                                                        value={currentAddOn.sessionDuration || ''}
                                                        onChange={e => setCurrentAddOn({ ...currentAddOn, sessionDuration: Number(e.target.value) })}
                                                        placeholder="VD: 60"
                                                        className="h-10"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Nội dung chi tiết từng buổi (mỗi dòng 1 buổi)</label>
                                                <textarea
                                                    value={(currentAddOn.curriculum || []).join('\n')}
                                                    onChange={e => setCurrentAddOn({ ...currentAddOn, curriculum: e.target.value.split('\n') })}
                                                    placeholder="Buổi 1: Định hướng lộ trình&#10;Buổi 2: Review kiến thức nền tảng&#10;Buổi 3: Thực hành Project..."
                                                    rows={5}
                                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-background focus:border-neutral-900 focus:ring-neutral-900/10 focus:outline-none text-sm"
                                                />
                                                <p className="text-[10px] text-muted-foreground mt-1">* Nhập nội dung cho từng buổi để học viên dễ theo dõi tiến độ</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Các đặc quyền khác (Hiển thị trang bán hàng)</label>
                                        <textarea
                                            value={(currentAddOn.features || []).join('\n')}
                                            onChange={e => setCurrentAddOn({ ...currentAddOn, features: e.target.value.split('\n').filter(Boolean) })}
                                            placeholder="Hỗ trợ trọn đời&#10;Cam kết việc làm..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-background focus:border-neutral-900 focus:ring-neutral-900/10 focus:outline-none text-sm"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => { setIsEditing(false); setCurrentAddOn({}); }}
                                            className="flex-1"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1"
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
