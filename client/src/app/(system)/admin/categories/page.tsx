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
import { List } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    _count?: {
        courses: number;
    };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
    const { addToast } = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res: any = await api.categories.list();
            setCategories(res.data || []);
        } catch (error) {
            console.error(error);
            addToast('Lỗi tải danh sách danh mục', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, count: number) => {
        if (count > 0) {
            addToast(`Không thể xóa danh mục đang có ${count} khóa học`, 'error');
            return;
        }

        const confirmed = await confirm({
            title: 'Xóa danh mục?',
            message: 'Bạn có chắc chắn muốn xóa danh mục này?',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });

        if (!confirmed) return;

        try {
            await api.categories.delete(id);
            addToast('Đã xóa danh mục', 'success');
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            addToast('Lỗi xóa danh mục', 'error');
        }
    };

    const handleEdit = (category: Category) => {
        setCurrentCategory(category);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentCategory({ isActive: true });
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentCategory.id) {
                const res: any = await api.categories.update(currentCategory.id, currentCategory);
                setCategories(prev => prev.map(c => c.id === res.id ? { ...c, ...res, _count: c._count } : c)); // Preserve count
                addToast('Đã cập nhật danh mục', 'success');
            } else {
                const res: any = await api.categories.create(currentCategory);
                setCategories(prev => [res, ...prev]);
                addToast('Đã tạo danh mục mới', 'success');
            }
            setIsEditing(false);
            setCurrentCategory({});
        } catch (error) {
            addToast('Lỗi lưu danh mục', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Danh Mục / Chuyên Mục"
                subtitle="Quản lý phân loại khóa học và sản phẩm"
                icon={<List className="w-8 h-8" />}
            >
                <Button onClick={handleCreate} disabled={isEditing}>Thêm danh mục</Button>
            </AdminPageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List Column */}
                <div className={`col-span-1 ${isEditing ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <Card className="h-full border border-border shadow-none bg-card">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 w-full flex items-center justify-center text-muted-foreground">Đang tải...</div>
                            ) : categories.length === 0 ? (
                                <div className="p-8 w-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px] h-full text-center">Chưa có danh mục nào</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[13px] border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50 border-b border-border">
                                                <th className="text-left font-semibold text-muted-foreground py-3 px-6 pl-6 w-[250px]">Tên danh mục</th>
                                                <th className="text-left font-semibold text-muted-foreground py-3 px-4">Slug / Khóa học</th>
                                                <th className="text-center font-semibold text-muted-foreground py-3 px-4 w-[120px]">Trạng thái</th>
                                                <th className="text-right font-semibold text-muted-foreground py-3 px-6 w-[100px]"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((cat) => (
                                                <tr key={cat.id} className="group border-b border-border hover:bg-muted/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <span className="font-semibold text-foreground">{cat.name}</span>
                                                    </td>
                                                    <td className="py-4 px-4 align-top">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-muted-foreground">/{cat.slug}</span>
                                                            <span className="text-[11px] text-muted-foreground font-medium">{cat._count?.courses || 0} khóa học</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        {!cat.isActive ? (
                                                            <span className="text-[10px] bg-muted text-muted-foreground/60 px-2 py-0.5 rounded border border-border font-semibold">Ẩn</span>
                                                        ) : (
                                                            <span className="text-[10px] bg-foreground text-background px-2 py-0.5 rounded border border-transparent font-semibold">Hiện</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                            <TableActions
                                                                onEdit={() => handleEdit(cat)}
                                                                onDelete={() => handleDelete(cat.id, cat._count?.courses || 0)}
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
                </div>

                {/* Form Column */}
                {isEditing && (
                    <div className="col-span-1 md:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>{currentCategory.id ? 'Sửa danh mục' : 'Tạo danh mục mới'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Tên danh mục</label>
                                        <Input
                                            value={currentCategory.name || ''}
                                            onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                            required
                                            placeholder="Ví dụ: AI Marketing"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Slug (URL)</label>
                                        <Input
                                            value={currentCategory.slug || ''}
                                            onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                                            placeholder="ai-marketing (tự động nếu để trống)"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Mô tả</label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={currentCategory.description || ''}
                                            onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Switch
                                                checked={currentCategory.isActive || false}
                                                onChange={(checked) => setCurrentCategory({ ...currentCategory, isActive: checked })}
                                            />
                                            <span className="text-sm font-medium">Hiển thị công khai</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button type="submit" className="flex-1">Lưu</Button>
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
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
