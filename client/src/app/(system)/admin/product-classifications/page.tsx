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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs';

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
    const [activeTab, setActiveTab] = useState<'PRODUCT_TYPE' | 'PRODUCT_FIELD'>('PRODUCT_TYPE');
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

    const handleCreate = () => {
        setCurrentClassification({ type: activeTab, isActive: true });
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

    const filteredList = classifications.filter(c => c.type === activeTab);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Phân loại Sản phẩm"
                subtitle="Quản lý các Loại sản phẩm (Product Types) và Lĩnh vực (Product Fields) của kho tài nguyên."
            >
                <Button onClick={handleCreate} disabled={isEditing}>Thêm phân loại</Button>
            </AdminPageHeader>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                <TabsList>
                    <TabsTrigger value="PRODUCT_TYPE">Loại sản phẩm (Type)</TabsTrigger>
                    <TabsTrigger value="PRODUCT_FIELD">Lĩnh vực (Field)</TabsTrigger>
                </TabsList>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* List Column */}
                    <div className={`col-span-1 ${isEditing ? 'md:col-span-2' : 'md:col-span-3'}`}>
                        <Card>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-8 w-full flex items-center justify-center text-muted-foreground">Đang tải...</div>
                                ) : filteredList.length === 0 ? (
                                    <div className="p-8 w-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px] h-full text-center">
                                        Chưa có phân loại nào cho mục này
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/50">
                                        {filteredList.map((item) => (
                                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {item.name}
                                                        {!item.isActive && <span className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 uppercase font-bold tracking-wider">Ẩn</span>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
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
                    </div>

                    {/* Form Column */}
                    {isEditing && (
                        <div className="col-span-1 md:col-span-1">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                        {currentClassification.id ? 'Cập nhật' : 'Thêm mới'} {activeTab === 'PRODUCT_TYPE' ? 'Loại' : 'Lĩnh vực'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Tên hiển thị</label>
                                            <Input
                                                value={currentClassification.name || ''}
                                                onChange={e => setCurrentClassification({ ...currentClassification, name: e.target.value })}
                                                required
                                                placeholder="Ví dụ: Landing Page, Marketing..."
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <Switch
                                                    checked={currentClassification.isActive || false}
                                                    onChange={(checked) => setCurrentClassification({ ...currentClassification, isActive: checked })}
                                                />
                                                <span className="text-sm font-medium">Đang hoạt động</span>
                                            </label>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button type="submit" className="flex-1">Lưu lại</Button>
                                            <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setCurrentClassification({}); }}>Hủy</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
