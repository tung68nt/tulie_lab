'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Plus, ExternalLink, Edit, Trash2, Copy } from 'lucide-react';

import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

import { useConfirm } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';

export default function SystemPagesAdmin() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const confirmDialog = useConfirm();
    const { addToast } = useToast();

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
        const isConfirmed = await confirmDialog({
            title: 'Xóa trang hệ thống',
            message: 'Bạn có chắc chắn muốn xóa trang này?',
            variant: 'danger',
            confirmText: 'Xóa ngay'
        });

        if (!isConfirmed) return;

        try {
            await api.landingPages.delete(id);
            addToast('Đã xóa trang thành công', 'success');
            loadPages();
        } catch (error: any) {
            addToast(error.message || 'Xóa thất bại', 'error');
        }
    };

    const handleDuplicate = async (id: string) => {
        const isConfirmed = await confirmDialog({
            title: 'Nhân bản trang',
            message: 'Bạn có muốn nhân bản trang này không?',
            variant: 'info'
        });

        if (!isConfirmed) return;

        try {
            await api.landingPages.duplicate(id);
            addToast('Đã nhân bản trang thành công', 'success');
            loadPages();
        } catch (error: any) {
            addToast(error.message || 'Nhân bản thất bại', 'error');
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
                {pages.map((page) => (
                    <Card key={page.id}>
                        <CardContent className="p-6 pt-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{page.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs">/{page.slug}</span>
                                    <span>•</span>
                                    <span className={page.isActive ? 'text-green-600' : 'text-orange-500'}>
                                        {page.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                    </span>
                                </div>
                            </div>
                            <TableActions
                                viewUrl={`/${page.slug}`}
                                editUrl={`/admin/landing-pages/${page.id}`}
                                onDelete={page.slug !== '' ? () => handleDelete(page.id) : undefined}
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
                        <p>Chưa có trang thông tin nào.</p>
                        <p className="text-sm mt-2">Nhấn "Tạo trang mới" để bắt đầu.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
