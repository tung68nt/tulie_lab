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
import { DynamicIcon } from '@/components/DynamicIcon';
import { Plus, Calculator, Users, TrendingUp, Briefcase, Palette, Folder, Layout, Code, Key, Zap, Package, Layers, FileText, Image, Video, Music, Globe, Smartphone, Database, Settings, Star, Heart, ShoppingCart, Tag, Bookmark, Award, Gift, Target, Lightbulb, Rocket } from 'lucide-react';

// Available icons for selection
const AVAILABLE_ICONS = [
    { name: 'Calculator', icon: Calculator, label: 'Calculator' },
    { name: 'Users', icon: Users, label: 'Users' },
    { name: 'TrendingUp', icon: TrendingUp, label: 'Trending Up' },
    { name: 'Briefcase', icon: Briefcase, label: 'Briefcase' },
    { name: 'Palette', icon: Palette, label: 'Palette' },
    { name: 'Folder', icon: Folder, label: 'Folder' },
    { name: 'Layout', icon: Layout, label: 'Layout' },
    { name: 'Code', icon: Code, label: 'Code' },
    { name: 'Key', icon: Key, label: 'Key' },
    { name: 'Zap', icon: Zap, label: 'Zap' },
    { name: 'Package', icon: Package, label: 'Package' },
    { name: 'Layers', icon: Layers, label: 'Layers' },
    { name: 'FileText', icon: FileText, label: 'File Text' },
    { name: 'Image', icon: Image, label: 'Image' },
    { name: 'Video', icon: Video, label: 'Video' },
    { name: 'Music', icon: Music, label: 'Music' },
    { name: 'Globe', icon: Globe, label: 'Globe' },
    { name: 'Smartphone', icon: Smartphone, label: 'Smartphone' },
    { name: 'Database', icon: Database, label: 'Database' },
    { name: 'Settings', icon: Settings, label: 'Settings' },
    { name: 'Star', icon: Star, label: 'Star' },
    { name: 'Heart', icon: Heart, label: 'Heart' },
    { name: 'ShoppingCart', icon: ShoppingCart, label: 'Shopping Cart' },
    { name: 'Tag', icon: Tag, label: 'Tag' },
    { name: 'Bookmark', icon: Bookmark, label: 'Bookmark' },
    { name: 'Award', icon: Award, label: 'Award' },
    { name: 'Gift', icon: Gift, label: 'Gift' },
    { name: 'Target', icon: Target, label: 'Target' },
    { name: 'Lightbulb', icon: Lightbulb, label: 'Lightbulb' },
    { name: 'Rocket', icon: Rocket, label: 'Rocket' },
];

interface Classification {
    id: string;
    name: string;
    type: 'PRODUCT_TYPE' | 'PRODUCT_FIELD';
    icon?: string;
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
        setCurrentClassification({ type, isActive: true, icon: 'Folder' });
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

    const getIconComponent = (iconName: string | undefined) => {
        const found = AVAILABLE_ICONS.find(i => i.name === iconName);
        if (found) {
            const IconComp = found.icon;
            return <IconComp className="w-4 h-4" />;
        }
        return <Folder className="w-4 h-4" />;
    };

    const types = classifications.filter(c => c.type === 'PRODUCT_TYPE');
    const fields = classifications.filter(c => c.type === 'PRODUCT_FIELD');

    const renderList = (title: string, list: Classification[], type: 'PRODUCT_TYPE' | 'PRODUCT_FIELD') => (
        <Card className="h-full border border-border shadow-none bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border bg-muted/20 py-4 px-6">
                <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
                <Button
                    onClick={() => handleCreate(type)}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    title="Thêm mới"
                >
                    <Plus size={18} />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {list.length === 0 && !loading ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">Chưa có dữ liệu</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="text-left font-bold text-muted-foreground py-3 px-6 pl-[68px]">Tên phân loại</th>
                                    <th className="text-center font-bold text-muted-foreground py-3 px-4 w-[100px]">Trạng thái</th>
                                    <th className="text-right font-bold text-muted-foreground py-3 px-6 w-[100px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="group border-b border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 shrink-0 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-muted-foreground">
                                                    {getIconComponent(item.icon)}
                                                </div>
                                                <span className="font-medium text-foreground">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {!item.isActive ? (
                                                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border font-bold">Ẩn</span>
                                            ) : (
                                                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold">Hiện</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <TableActions
                                                    onEdit={() => handleEdit(item)}
                                                    onDelete={() => handleDelete(item.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Phân loại Sản phẩm"
                subtitle="Quản lý các nhóm phân loại sản phẩm (VD: Template, Ebook...)"
                icon={<Tag className="w-8 h-8" />}
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
                                        <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Tên hiển thị</label>
                                        <Input
                                            value={currentClassification.name || ''}
                                            onChange={e => setCurrentClassification({ ...currentClassification, name: e.target.value })}
                                            required
                                            placeholder="Ví dụ: Landing Page, Marketing..."
                                            className="h-10 border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Icon Picker */}
                                    <div>
                                        <label className="text-xs font-semibold tracking-wider text-neutral-500 mb-2 block">Biểu tượng</label>
                                        <div className="grid grid-cols-6 gap-2 p-3 border border-neutral-200 rounded-lg max-h-40 overflow-y-auto">
                                            {AVAILABLE_ICONS.map((iconItem) => {
                                                const IconComp = iconItem.icon;
                                                const isSelected = currentClassification.icon === iconItem.name;
                                                return (
                                                    <button
                                                        key={iconItem.name}
                                                        type="button"
                                                        onClick={() => setCurrentClassification({ ...currentClassification, icon: iconItem.name })}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isSelected
                                                            ? 'bg-neutral-900 text-white'
                                                            : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                                                            }`}
                                                        title={iconItem.label}
                                                    >
                                                        <IconComp className="w-4 h-4" />
                                                    </button>
                                                );
                                            })}
                                        </div>
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
