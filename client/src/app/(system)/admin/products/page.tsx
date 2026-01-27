'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/contexts/ToastContext';
import { Plus, Search, Edit, Trash, ExternalLink } from 'lucide-react';
import { Input } from '@/components/Input';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();
    const confirm = useConfirm();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res: any = await api.products.list({ limit: 100 });
            // Backend returns { data: [...], meta: ... }
            if (res.data && Array.isArray(res.data)) {
                setProducts(res.data);
            } else if (Array.isArray(res)) {
                // Fallback if structure changes
                setProducts(res);
            } else {
                setProducts([]);
            }
        } catch (error: any) {
            console.error('Error loading products:', error);
            const errorMessage = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
            addToast(`Lỗi tải sản phẩm: ${errorMessage || 'Unknown error'}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        const ok = await confirm({
            title: 'Xóa sản phẩm?',
            message: 'Hành động này không thể hoàn tác.',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            variant: 'danger'
        });
        if (!ok) return;

        try {
            await api.products.delete(id);
            addToast('Xóa sản phẩm thành công', 'success');
            fetchProducts();
        } catch (error) {
            console.error(error);
            addToast('Lỗi xóa sản phẩm', 'error');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ...

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Sản phẩm số"
                subtitle="Quản lý các sản phẩm kỹ thuật số (Template, App, License)"
            >
                <Link href="/admin/products/new">
                    <Button as="div" className="gap-2">
                        <Plus className="h-4 w-4" /> Thêm sản phẩm
                    </Button>
                </Link>
            </AdminPageHeader>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sản phẩm</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Loại</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Giá</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Trạng thái</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="h-24 text-center">
                                        <div className="flex justify-center">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Chưa có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                {product.thumbnail && (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt=""
                                                        className="h-10 w-16 object-cover rounded bg-muted"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{product.title}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="secondary">{product.type}</Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </div>
                                            {product.compareAtPrice && (
                                                <div className="text-xs text-muted-foreground line-through">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.compareAtPrice)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {product.isPublished ? (
                                                <Badge className="bg-green-500 hover:bg-green-600 whitespace-nowrap">Đang bán</Badge>
                                            ) : (
                                                <Badge variant="outline" className="whitespace-nowrap">Nháp</Badge>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <TableActions
                                                viewUrl={`/shop/${product.slug}`}
                                                editUrl={`/admin/products/${product.id}`}
                                                onDelete={() => handleDelete(product.id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
