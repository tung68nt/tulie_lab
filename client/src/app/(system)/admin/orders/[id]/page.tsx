'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Mail, User, CreditCard, Calendar, Package } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { OrderInvoice } from '@/components/shop/OrderInvoice';

interface OrderDetail {
    id: string;
    code: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        fullName?: string;
        name?: string;
        profile?: {
            name?: string;
            phone?: string;
        };
    };
    items: {
        id: string;
        price: number;
        course?: { id: string; title: string; image?: string };
        product?: { id: string; title: string; image?: string };
    }[];
    transactions?: {
        id: string;
        amount: number;
        bankName?: string;
        status: string;
        createdAt: string;
    }[];
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { addToast } = useToast();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res: any = await api.admin.orders.get(id);
                setOrder(res.order || res);
            } catch (error) {
                console.error('Failed to load order:', error);
                addToast('Không thể tải thông tin đơn hàng', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, addToast]);

    const updateStatus = async (newStatus: 'PAID' | 'CANCELLED') => {
        if (!confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang ${newStatus}?`)) return;
        try {
            setUpdating(true);
            await api.admin.orders.updateStatus(id, newStatus);
            addToast('Cập nhật trạng thái thành công', 'success');
            // Refresh
            const res: any = await api.admin.orders.get(id);
            setOrder(res.order || res);
        } catch (error: any) {
            addToast(error?.message || 'Lỗi cập nhật', 'error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Không tìm thấy đơn hàng</div>;

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    const formatDate = (str: string) => new Date(str).toLocaleString('vi-VN');

    return (
        <div className="admin-container space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            Quản lý Đơn hàng
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Xem và xử lý thông tin hóa đơn khách hàng
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {order.status === 'PENDING' && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => updateStatus('CANCELLED')}
                                disabled={updating}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Hủy đơn
                            </Button>
                            <Button
                                onClick={() => updateStatus('PAID')}
                                disabled={updating}
                                className="bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                Xác nhận thanh toán
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <OrderInvoice
                order={order as any}
            />
        </div>
    );
}
