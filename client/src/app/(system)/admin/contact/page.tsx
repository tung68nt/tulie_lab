'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

import { Loader2, Search, Trash2, Mail, Eye, RefreshCcw, RotateCcw, Download, MessageSquare, Phone, MapPin, User, Clock } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Card, CardContent } from '@/components/Card';
import { Pagination } from '@/components/Pagination';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

// Helper for Badge colors - B/W only
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'NEW':
            return <Badge variant="default" size="sm" showDot={false}>Mới</Badge>;
        case 'READ':
            return <Badge variant="muted" size="sm" showDot={false}>Đã xem</Badge>;
        case 'REPLIED':
            return <Badge variant="outline" size="sm" showDot={false}>Đã phản hồi</Badge>;
        default:
            return <Badge variant="outline" size="sm" showDot={false}>{status}</Badge>;
    }
};

export default function AdminContactPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset page on search
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const loadSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await api.admin.contact.list({
                page,
                limit: 10,
                search: debouncedSearch
            });
            setSubmissions(res.data);
            setTotalPages(res.meta.totalPages);
            setTotalItems(res.meta.total || 0);
        } catch (error) {
            console.error('Failed to load submissions', error);
            addToast('Không thể tải danh sách liên hệ', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, addToast]);

    useEffect(() => {
        loadSubmissions();
    }, [loadSubmissions]);

    const handleMarkStatus = async (id: string, status: string) => {
        try {
            await api.admin.contact.updateStatus(id, status);
            addToast('Đã cập nhật trạng thái', 'success');
            loadSubmissions();
        } catch (error) {
            addToast('Không thể cập nhật trạng thái', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa liên hệ?',
            message: 'Bạn có chắc muốn xóa liên hệ này?',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;
        try {
            await api.admin.contact.delete(id);
            addToast('Đã xóa liên hệ', 'success');
            loadSubmissions();
        } catch (error) {
            addToast('Không thể xóa', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Liên hệ & Phản hồi"
                subtitle="Quản lý tin nhắn liên hệ từ khách hàng"
                icon={<MessageSquare className="w-8 h-8" />}
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadSubmissions} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Tải lại
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8,"
                            + "Date,Name,Email,Phone,Message,Status\n"
                            + submissions.map(e => {
                                return `"${new Date(e.createdAt).toLocaleDateString('vi-VN')}", "${e.name}", "${e.email}", "${e.phone || ''}", "${e.message.replace(/"/g, '""')}", "${e.status}"`;
                            }).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "contacts_export.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }} disabled={submissions.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        Xuất Excel
                    </Button>
                </div>
            </AdminPageHeader>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên, email, sđt..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Ngày gửi</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Người gửi</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nội dung</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Trạng thái</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center w-[140px]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">Đang tải...</td>
                                </tr>
                            ) : submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">Không có liên hệ nào.</td>
                                </tr>
                            ) : (
                                submissions.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-muted-foreground text-xs">{item.email}</div>
                                            {item.phone && <div className="text-muted-foreground text-xs">{item.phone}</div>}
                                        </td>
                                        <td className="p-4 align-middle max-w-[300px]">
                                            <div className="truncate font-medium">{item.message}</div>
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex justify-center gap-2">
                                                {item.status === 'NEW' ? (
                                                    <button
                                                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-black"
                                                        onClick={() => handleMarkStatus(item.id, 'READ')}
                                                        title="Đánh dấu đã xem"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-black"
                                                        onClick={() => handleMarkStatus(item.id, 'NEW')}
                                                        title="Đánh dấu chưa xem"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
                className="pt-2"
            />
        </div>
    );
}
