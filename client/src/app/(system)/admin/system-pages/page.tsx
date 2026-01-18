'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Plus, ExternalLink, Edit, Trash2, Copy } from 'lucide-react';

import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

export default function SystemPagesAdmin() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const res = (await api.landingPages.list('SYSTEM')) as any[];
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

    const handleDuplicate = async (id: string) => {
        if (!confirm('Bạn có muốn nhân bản trang này không?')) return;
        try {
            await api.landingPages.duplicate(id);
            loadPages();
        } catch (error) {
            alert('Nhân bản thất bại');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý Trang thông tin"
                subtitle="Quản lý các trang thông tin hệ thống (Trang chủ, Giới thiệu...)."
            >
                <Link href="/admin/landing-pages/new?type=SYSTEM">
                    <Button className="flex items-center gap-2">
                        <Plus size={16} /> Tạo trang mới
                    </Button>
                </Link>
            </AdminPageHeader>

            <div className="grid gap-4">
                {/* Hardcoded CMS Pages */}
                {[
                    { id: 'cms-home', title: 'Trang chủ (Home)', slug: '/', isActive: true, isCms: true },
                    { id: 'cms-about', title: 'Về chúng tôi (About)', slug: '/about', isActive: true, isCms: true },
                    { id: 'cms-instructors', title: 'Giảng viên (Instructors)', slug: '/instructors', isActive: true, isCms: true },
                ].map((page) => (
                    <Card key={page.id} className="border border-border bg-secondary/20">
                        <CardContent className="p-6 pt-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    {page.title}
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">System Core</span>
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs">{page.slug}</span>
                                    <span>•</span>
                                    <span>Đang hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <TableActions
                                    viewUrl={page.slug}
                                    editUrl={`/admin/system-pages/${page.id}`}
                                    customActions={[
                                        {
                                            title: "Chỉnh sửa cấu trúc",
                                            icon: Edit,
                                            href: `/admin/system-pages/${page.id}`
                                        }
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pages.map((page) => (
                    <Card key={page.id}>
                        <CardContent className="p-6 pt-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{page.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs">/{page.slug}</span>
                                    <span>•</span>
                                    <span>{page.isActive ? 'Đang hoạt động' : 'Đã ẩn'}</span>
                                </div>
                            </div>
                            <TableActions
                                viewUrl={`/p/${page.slug}`}
                                editUrl={`/admin/landing-pages/${page.id}`}
                                onDelete={() => handleDelete(page.id)}
                                customActions={[
                                    {
                                        title: 'Nhân bản',
                                        icon: Copy,
                                        onClick: () => handleDuplicate(page.id)
                                    }
                                ]}
                            />
                        </CardContent>
                    </Card>
                ))}

                {pages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                        Chưa có trang thông tin nào.
                    </div>
                )}
            </div>
        </div>
    );
}
