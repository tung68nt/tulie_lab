'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';

export default function CouponsPage() {
    const { addToast } = useToast();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoupons = async () => {
        try {
            const data: any = await api.coupons.list();
            setCoupons(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            addToast('Không thể tải danh sách mã giảm giá', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Bạn có chắc muốn xóa mã "${code}"?`)) return;
        try {
            await api.coupons.delete(id);
            addToast('Đã xóa mã giảm giá', 'success');
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
            addToast('Xóa thất bại', 'error');
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Mã giảm giá</h1>
                <Link href="/admin/coupons/new">
                    <Button>+ Tạo Mã mới</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {coupons.length === 0 ? (
                    <Card>
                        <CardContent className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                            Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="border rounded-lg overflow-hidden bg-background">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Mã Code</th>
                                    <th className="px-4 py-3 text-left font-medium">Giảm giá</th>
                                    <th className="px-4 py-3 text-left font-medium">Đơn tối thiểu</th>
                                    <th className="px-4 py-3 text-left font-medium">Hiệu lực</th>
                                    <th className="px-4 py-3 text-left font-medium">Lượt dùng</th>
                                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{coupon.code}</td>
                                        <td className="px-4 py-3">
                                            {coupon.discountType === 'PERCENT'
                                                ? `${coupon.discountValue}% (Max ${coupon.maxDiscount?.toLocaleString() || '∞'}đ)`
                                                : `${coupon.discountValue?.toLocaleString()}đ`
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            {coupon.minPurchase ? `${coupon.minPurchase.toLocaleString()}đ` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString('vi-VN') : 'Hiện tại'}
                                            {' -> '}
                                            {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {coupon._count?.usages || 0} / {coupon.usageLimit || '∞'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${coupon.isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                                {coupon.isActive ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/coupons/${coupon.id}`}>
                                                    <Button variant="outline" size="sm" className="h-7 px-2">Sửa</Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-foreground hover:text-muted-foreground hover:bg-muted"
                                                    onClick={() => handleDelete(coupon.id, coupon.code)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
