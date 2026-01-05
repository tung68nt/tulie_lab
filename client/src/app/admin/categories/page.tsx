'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Switch } from '@/components/Switch';

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res: any = await api.categories.list();
            setCategories(Array.isArray(res) ? res : []);
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
        if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

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
        <div className="container mx-auto py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
                <Button onClick={handleCreate} disabled={isEditing}>Thêm danh mục</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List Column */}
                <div className={`col-span-1 ${isEditing ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <Card>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 w-full flex items-center justify-center text-muted-foreground">Đang tải...</div>
                            ) : categories.length === 0 ? (
                                <div className="p-8 w-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px] h-full text-center">Chưa có danh mục nào</div>
                            ) : (
                                <div className="divide-y">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {cat.name}
                                                    {!cat.isActive && <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded">Hidden</span>}
                                                </div>
                                                <div className="text-sm text-muted-foreground">/{cat.slug} &middot; {cat._count?.courses || 0} khóa học</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(cat)}>Sửa</Button>
                                                <Button variant="ghost" size="sm" className="text-foreground hover:text-muted-foreground underline" onClick={() => handleDelete(cat.id, cat._count?.courses || 0)}>Xóa</Button>
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
