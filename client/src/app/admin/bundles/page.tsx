'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';

export default function BundlesPage() {
    const { addToast } = useToast();
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
        if (!confirm(`Bạn có chắc muốn xóa combo "${name}"?`)) return;
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Combo Khóa học</h1>
                <Link href="/admin/bundles/new">
                    <Button>+ Tạo Combo mới</Button>
                </Link>
            </div>

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
                                        <div className={`px-2 py-1 rounded text-xs font-semibold ${bundle.isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                            {bundle.isActive ? 'Live' : 'Draft'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{bundle.description}</p>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Giá gốc: </span>
                                            <span className="line-through">{bundle.originalPrice?.toLocaleString()}đ</span>
                                        </div>
                                        <div className="text-lg font-bold text-primary">
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
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Gồm {bundle.courses?.length || 0} khóa học:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {bundle.courses?.map((bc: any) => (
                                                <span key={bc.course.id} className="px-2 py-1 bg-secondary rounded text-xs">
                                                    {bc.course.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                                    <Link href={`/admin/bundles/${bundle.id}`}>
                                        <Button variant="outline" size="sm" className="w-full">Edit</Button>
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
