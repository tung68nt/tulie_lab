'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { X, Save, FileText, ImageIcon, Link as LinkIcon } from 'lucide-react';

interface EbookEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    ebook?: any;
    onSuccess: () => void;
}

export const EbookEditModal: React.FC<EbookEditModalProps> = ({ isOpen, onClose, ebook, onSuccess }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        cover: '',
        pdfKey: '',
        previewPages: 5,
        totalPages: 0,
        productId: '',
        price: 0
    });

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            if (ebook) {
                setFormData({
                    title: ebook.title || '',
                    slug: ebook.slug || '',
                    description: ebook.description || '',
                    cover: ebook.cover || '',
                    pdfKey: ebook.pdfKey || '',
                    previewPages: ebook.previewPages || 5,
                    totalPages: ebook.totalPages || 0,
                    productId: ebook.productId || '',
                    price: Number(ebook.price) || 0
                });
            } else {
                setFormData({
                    title: '',
                    slug: '',
                    description: '',
                    cover: '',
                    pdfKey: '',
                    previewPages: 5,
                    totalPages: 0,
                    productId: '',
                    price: 0
                });
            }
        }
    }, [isOpen, ebook]);

    const fetchProducts = async () => {
        try {
            const res = await api.admin.products.list({ limit: 100 });
            if (res.data) setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (ebook) {
                await api.admin.ebooks.update(ebook.id, formData);
                addToast('Cập nhật Ebook thành công', 'success');
            } else {
                await api.admin.ebooks.create(formData);
                addToast('Tạo Ebook thành công', 'success');
            }
            onSuccess();
        } catch (error: any) {
            addToast('Lỗi: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border shadow-2xl rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b flex items-center justify-between bg-muted/20">
                    <h2 className="text-xl font-bold">{ebook ? 'Chỉnh sửa Ebook' : 'Thêm Ebook mới'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Tiêu đề Ebook
                            </label>
                            <Input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="VD: Cẩm nang Design 2024"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" /> Slug (Đường dẫn)
                            </label>
                            <Input
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="cam-nang-design-2024"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Mô tả ngắn
                            </label>
                            <textarea
                                className="w-full min-h-[100px] bg-background border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ghi chú nhanh về nội dung cuốn sách này..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Ảnh bìa (Cover URL)
                            </label>
                            <Input
                                value={formData.cover}
                                onChange={e => setFormData({ ...formData, cover: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4" /> S3 PDF Key
                            </label>
                            <Input
                                required
                                value={formData.pdfKey}
                                onChange={e => setFormData({ ...formData, pdfKey: e.target.value })}
                                placeholder="ebooks/filename.pdf"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Số trang xem thử</label>
                            <Input
                                type="number"
                                value={formData.previewPages}
                                onChange={e => setFormData({ ...formData, previewPages: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Tổng số trang</label>
                            <Input
                                type="number"
                                value={formData.totalPages}
                                onChange={e => setFormData({ ...formData, totalPages: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Liên kết Sản phẩm (Để bán)</label>
                            <select
                                className="w-full bg-background border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.productId}
                                onChange={e => setFormData({ ...formData, productId: e.target.value })}
                            >
                                <option value="">Không có - Chỉ xem nội bộ</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.title} ({p.price}đ)</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Giá hiển thị (Ghi chú)</label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t flex items-center justify-end gap-3 bg-muted/10">
                    <Button variant="ghost" onClick={onClose} type="button">Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                        {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                        <Save className="h-4 w-4" /> {ebook ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
