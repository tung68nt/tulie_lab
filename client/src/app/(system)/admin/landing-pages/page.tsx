'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Plus, ExternalLink, Edit, Trash2, Copy, Layout } from 'lucide-react';

import { useConfirm } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';

import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

export default function LandingPagesAdmin() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const confirmDialog = useConfirm();
    const { addToast } = useToast();

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const res = (await api.landingPages.list('LANDING')) as any;
            setPages(Array.isArray(res) ? res : (res.data || []));
        } catch (error) {
            console.error('Failed to load pages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirmDialog({
            title: 'Xóa Landing Page',
            message: 'Bạn có chắc chắn muốn xóa trang này? Hành động này không thể hoàn tác.',
            variant: 'danger',
            confirmText: 'Xóa ngay'
        });

        if (!isConfirmed) return;

        try {
            await api.landingPages.delete(id);
            addToast('Đã xóa trang thành công', 'success');
            loadPages();
        } catch (error: any) {
            console.error('Delete failed:', error);
            addToast(error.message || 'Xóa thất bại. Vui lòng kiểm tra lại.', 'error');
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
                title="Landing Pages"
                subtitle="Quản lý các trang Landing Page giới thiệu sản phẩm/khóa học"
                icon={<Layout className="w-8 h-8" />}
            >
                <Link href="/admin/landing-pages/new">
                    <Button as="div" className="flex items-center gap-2">
                        <Plus size={16} /> Tạo trang mới
                    </Button>
                </Link>
            </AdminPageHeader>

            <div className="grid gap-4">
                {pages.map((page) => (
                    <Card key={page.id}>
                        <CardContent className="px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg m-0 text-foreground">{page.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium border border-border">/{page.slug}</span>
                                    <span>•</span>
                                    <span className="text-xs font-medium">{page.isActive ? 'Đang hoạt động' : 'Đã ẩn'}</span>
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
                        Chưa có trang landing page nào. Hãy tạo trang đầu tiên!
                    </div>
                )}
            </div>
        </div>
    );
}
