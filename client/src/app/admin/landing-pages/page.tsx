'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Plus, ExternalLink, Edit, Trash2 } from 'lucide-react';

export default function LandingPagesAdmin() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const res = (await api.landingPages.list()) as any[];
            setPages(res);
        } catch (error) {
            console.error('Failed to load pages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa trang này?')) return;
        try {
            await api.landingPages.delete(id);
            loadPages();
        } catch (error) {
            alert('Xóa thất bại');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Landing Pages</h1>
                    <p className="text-muted-foreground">Tạo và chỉnh sửa các trang bán hàng động.</p>
                </div>
                <Link href="/admin/landing-pages/new">
                    <Button className="flex items-center gap-2">
                        <Plus size={16} /> Tạo trang mới
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {pages.map((page) => (
                    <Card key={page.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{page.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">/{page.slug}</span>
                                    <span>•</span>
                                    <span>{page.isActive ? 'Đang hoạt động' : 'Đã ẩn'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/p/${page.slug}`} target="_blank">
                                    <Button variant="ghost" size="sm" title="Xem thực tế">
                                        <ExternalLink size={16} />
                                    </Button>
                                </Link>
                                <Link href={`/admin/landing-pages/${page.id}`}>
                                    <Button variant="outline" size="sm" title="Chỉnh sửa">
                                        <Edit size={16} />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(page.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                        Chưa có trang landing page nào. Hãy tạo trang đầu tiên!
                    </div>
                )}
            </div>
        </div>
    );
}
