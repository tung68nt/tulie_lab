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
                                {/* List rendering remains same */}
                                {addOns.map((addOn) => (
                                    <div key={addOn.id} className="group flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-neutral-900">{addOn.name}</span>
                                                <span className="text-[10px] uppercase bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200 font-medium">
                                                    {addOn.type || 'OTHER'}
                                                </span>
                                                {!addOn.isActive && (
                                                    <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded border border-red-100 font-medium">Ẩn</span>
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
                                            <Input
                                                type="number"
                                                value={currentAddOn.priceAddon || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, priceAddon: Number(e.target.value) })}
                                                placeholder="500000"
                                                className="h-10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Giá gốc để gạch</label>
                                            <Input
                                                type="number"
                                                value={currentAddOn.compareAtAddon || ''}
                                                onChange={e => setCurrentAddOn({ ...currentAddOn, compareAtAddon: Number(e.target.value) })}
                                                placeholder="800000"
                                                className="h-10"
                                            />
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
