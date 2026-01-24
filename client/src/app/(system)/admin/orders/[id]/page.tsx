'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Mail, User, CreditCard, Calendar, Package } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

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
        <div className="admin-container space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        Đơn hàng #{order.code || order.id.slice(-8)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-zinc-900 text-zinc-100' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Đặt ngày {formatDate(order.createdAt)}
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="w-5 h-5 text-muted-foreground" />
                                Sản phẩm
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div>
                                        <div className="font-medium">
                                            {item.course?.title || item.product?.title || 'Unknown Item'}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.course ? 'Khóa học' : 'Sản phẩm số'}
                                        </div>
                                    </div>
                                    <div className="font-mono font-medium">
                                        {formatCurrency(item.price || order.amount)}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between pt-4 font-bold text-lg">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(order.amount)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transactions */}
                    {order.transactions && order.transactions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    Lịch sử giao dịch
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {order.transactions.map((tx, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                                            <div>
                                                <div className="font-medium">{tx.bankName || 'Chuyển khoản'}</div>
                                                <div className="text-xs text-muted-foreground text-[10px]">{formatDate(tx.createdAt)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono">{formatCurrency(tx.amount)}</div>
                                                <div className="text-[10px] uppercase text-muted-foreground">{tx.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-muted-foreground" />
                                Khách hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-lg font-bold text-zinc-500">
                                    {(order.user.name?.[0] || order.user.email[0]).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-medium truncate">{order.user.profile?.name || order.user.name || 'N/A'}</div>
                                    <div className="text-xs text-muted-foreground truncate">{order.user.email}</div>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">ID: </span>
                                    <span className="font-mono text-xs">{order.user.id}</span>
                                </div>
                                {order.user.profile?.phone && (
                                    <div>
                                        <span className="text-muted-foreground">Phone: </span>
                                        <span>{order.user.profile.phone}</span>
                                    </div>
                                )}
                            </div>
                            <Link href={`/admin/users/${order.user.id}`}>
                                <Button variant="outline" size="sm" className="w-full mt-2">
                                    Xem hồ sơ
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                Liên hệ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2 h-9">
                                <Mail className="w-4 h-4" />
                                Gửi Email
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
