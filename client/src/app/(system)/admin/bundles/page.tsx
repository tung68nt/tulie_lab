'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { Layers, Plus, BookOpen, List } from 'lucide-react';

export default function AdminBundlesPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBundles = async () => {
        try {
            const data: any = await api.bundles.listAdmin();
            setBundles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            addToast('Không thể tải danh sách combo', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Xác nhận xóa',
            message: `Bạn có chắc muốn xóa combo "${name}"?`,
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;
        try {
            await api.bundles.delete(id);
            addToast('Đã xóa combo', 'success');
            setBundles(bundles.filter(b => b.id !== id));
        } catch (error) {
            console.error(error);
            addToast('Xóa thất bại', 'error');
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Combo / Bundle"
                subtitle="Quản lý các gói combo và nội dung bán kèm"
                icon={<Layers className="w-8 h-8" />}
            >
                <Link href="/admin/bundles/new">
                    <Button as="div">+ Tạo Combo mới</Button>
                </Link>
            </AdminPageHeader>

            <div className="grid gap-6">
                {bundles.length === 0 ? (
                    <Card>
                        <CardContent className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                            Chưa có combo nào. Hãy tạo combo đầu tiên!
                        </CardContent>
                    </Card>
                ) : (
                    bundles.map((bundle) => (
                        <Card key={bundle.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-4 p-6">
                                {/* Thumbnail can be here */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-semibold">{bundle.name}</h3>
                                            <p className="text-sm text-muted-foreground">/{bundle.slug}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-semibold ${bundle.isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                            {bundle.isActive ? 'Live' : 'Draft'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{bundle.description}</p>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Giá gốc: </span>
                                            <span className="line-through">{bundle.originalPrice?.toLocaleString()}đ</span>
                                        </div>
                                        <div className="text-lg font-semibold text-primary">
                                            {bundle.salePrice?.toLocaleString()}đ
                                        </div>
                                        {bundle.discountPercent && (
                                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                                                -{bundle.discountPercent}%
                                            </span>
                                        )}
                                    </div>

                                    {/* Courses list preview */}
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            Gồm {bundle.courses?.length || 0} khóa học trong lộ trình:
                                        </p>
                                        <div className="space-y-2">
                                            {bundle.courses?.map((bc: any, idx: number) => (
                                                <div key={bc.course.id} className="flex items-center gap-3 group/item">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center border border-primary/20">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors truncate block">
                                                            {bc.course.title}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-medium shrink-0">
                                                        {Number(bc.course.price || 0).toLocaleString()}đ
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                                    <Link href={`/admin/bundles/${bundle.id}`}>
                                        <Button as="div" variant="outline" size="sm" className="w-full">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-foreground hover:text-muted-foreground hover:bg-muted"
                                        onClick={() => handleDelete(bundle.id, bundle.name)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
