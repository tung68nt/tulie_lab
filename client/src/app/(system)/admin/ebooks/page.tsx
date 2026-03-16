'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import {  Plus, Search, BookOpen, ExternalLink, Trash2, Edit2, FileText , Loader2 } from 'lucide-react';
import { Input } from '@/components/Input';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';
import { EbookEditModal } from '@/components/system/admin/EbookEditModal';

export default function AdminEbooksPage() {
    const [ebooks, setEbooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEbook, setEditingEbook] = useState<any>(null);

    const { addToast } = useToast();
    const confirm = useConfirm();

    const fetchEbooks = async () => {
        try {
            setLoading(true);
            const res = await api.admin.ebooks.listAdmin({ limit: 100 });
            if (res.data) {
                setEbooks(res.data);
            }
        } catch (error: any) {
            addToast('Lỗi tải danh sách Ebook: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEbooks();
    }, []);

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: 'Xóa Ebook?',
            message: 'Hành động này sẽ xóa vĩnh viễn Ebook này khỏi hệ thống.',
            confirmText: 'Xóa',
            variant: 'danger'
        });
        if (!ok) return;

        try {
            await api.admin.ebooks.delete(id);
            addToast('Xóa Ebook thành công', 'success');
            fetchEbooks();
        } catch (error: any) {
            addToast('Lỗi khi xóa: ' + error.message, 'error');
        }
    };

    const handleEdit = (ebook: any) => {
        setEditingEbook(ebook);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setEditingEbook(null);
        setIsEditModalOpen(true);
    };

    const filteredEbooks = ebooks.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý Ebooks"
                subtitle="Danh sách các sách điện tử đang bán và cho phép đọc online."
                icon={<BookOpen className="w-8 h-8" />}
            >
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> Thêm Ebook mới
                </Button>
            </AdminPageHeader>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Ebook</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">PDF Key (R2)</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Sản phẩm</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground text-center">Preview</th>
                                <th className="h-12 px-4 text-right font-medium text-muted-foreground">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="h-32 text-center items-center justify-center">
                                        <div className="flex justify-center flex-col items-center gap-2">
                                            <Loader2 className="animate-spin w-6 h-6 text-primary " />
                                            <span className="text-muted-foreground">Đang tải...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEbooks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="h-32 text-center text-muted-foreground">
                                        Chưa có Ebook nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                filteredEbooks.map((ebook) => (
                                    <tr key={ebook.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {ebook.cover ? (
                                                    <img src={ebook.cover} alt="" className="h-14 w-10 object-cover rounded shadow-sm" />
                                                ) : (
                                                    <div className="h-14 w-10 bg-muted flex items-center justify-center rounded border border-border">
                                                        <FileText className="w-5 h-5 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-foreground">{ebook.title}</div>
                                                    <div className="text-xs text-muted-foreground">{ebook.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-muted-foreground max-w-[200px] truncate">
                                            {ebook.pdfKey}
                                        </td>
                                        <td className="p-4">
                                            {ebook.product ? (
                                                <div className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md inline-block">
                                                    Linked: {ebook.product.title}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-amber-500 font-medium italic">Không có liên kết SP</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-xs font-semibold">{ebook.previewPages} trang</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <TableActions
                                                viewUrl={`/ebooks/${ebook.slug}`}
                                                onEdit={() => handleEdit(ebook)}
                                                onDelete={() => handleDelete(ebook.id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EbookEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                ebook={editingEbook}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    fetchEbooks();
                }}
            />
        </div>
    );
}
