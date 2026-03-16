'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';
import {  Trash2 , Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { SectionBackground } from '@/components/info/SectionBackground';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
    const { addToast } = useToast();
    const confirm = useConfirm();

    const handleDeleteOrder = async (orderId: string, orderCode: string) => {
        const confirmed = await confirm({
            title: 'Xóa đơn hàng',
            message: `Bạn có chắc chắn muốn xóa đơn hàng ${orderCode}? Hành động này không thể hoàn tác.`,
            variant: 'danger',
            confirmText: 'Xóa ngay',
            cancelText: 'Hủy'
        });

        if (!confirmed) return;

        setDeletingOrder(orderId);
        try {
            await api.payments.deleteOrder(orderId);
            setOrders(orders.filter(o => o.id !== orderId));
            addToast('Đã xóa đơn hàng thành công', 'success');
        } catch (error: any) {
            console.error('Delete order error:', error);
            addToast(error.message || 'Không thể xóa đơn hàng', 'error');
        } finally {
            setDeletingOrder(null);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersResult: any = await api.users.getMyOrders();
                // api.users.getMyOrders returns Order[] directly
                const ordersData = Array.isArray(ordersResult) ? ordersResult : ordersResult?.orders || [];
                setOrders(ordersData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusConfig = (status: string, amount: number) => {
        // Free orders should show as completed
        if (amount === 0 && status === 'PENDING') {
            return { label: 'Hoàn thành', variant: 'success' as const };
        }
        switch (status) {
            case 'PAID':
            case 'COMPLETED':
                return { label: 'Hoàn thành', variant: 'success' as const };
            case 'CANCELLED':
                return { label: 'Đã hủy', variant: 'cancelled' as const };
            default:
                return { label: 'Chờ thanh toán', variant: 'pending' as const };
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount === 0) return 'Miễn phí';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-3 border-border border-t-foreground animate-spin" style={{ animationDuration: '0.6s' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
            <SectionBackground backgroundTheme="light" showDotPattern={true} className="z-0" />
            <div className="container relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Lịch sử đơn hàng</h1>
                    <p className="text-muted-foreground mt-1">Quản lý và theo dõi các đơn hàng của bạn</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-muted-foreground mb-6">Khám phá các khóa học và sản phẩm tuyệt vời của chúng tôi!</p>
                        <div className="flex justify-center gap-4">
                            <Link href="/courses">
                                <Button as="div">Xem khóa học</Button>
                            </Link>
                            <Link href="/shop">
                                <Button as="div" variant="outline">Xem cửa hàng</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Orders Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-sm">
                                        <th className="px-4 py-3 font-medium w-[120px]">Mã đơn</th>
                                        <th className="px-4 py-3 font-medium w-[120px]">Ngày tạo</th>
                                        <th className="px-4 py-3 font-medium">Nội dung đơn hàng</th>
                                        <th className="px-4 py-3 font-medium text-right w-[120px]">Số tiền</th>
                                        <th className="px-4 py-3 font-medium text-center w-[160px]">Trạng thái</th>
                                        <th className="px-4 py-3 font-medium text-right w-[130px]">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {orders.map((order: any) => {
                                        const status = getStatusConfig(order.status, order.amount);
                                        const isFreeCompleted = order.amount === 0;

                                        return (
                                            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-medium">{order.code}</span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                                                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {order.courses && order.courses.length > 0 && order.courses.map((c: any) => (
                                                            <div key={c.id} className="text-sm font-medium flex items-center gap-2">
                                                                <span className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] whitespace-nowrap">Khóa học</span>
                                                                <span className="line-clamp-1">{c.title}</span>
                                                            </div>
                                                        ))}
                                                        {order.products && order.products.length > 0 && order.products.map((p: any) => (
                                                            <div key={p.id} className="text-sm font-medium flex items-center gap-2">
                                                                <span className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] whitespace-nowrap">Sản phẩm</span>
                                                                <span className="line-clamp-1">{p.title}</span>
                                                            </div>
                                                        ))}
                                                        {(!order.courses?.length && !order.products?.length) && (
                                                            <span className="text-sm text-muted-foreground">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className={`text-sm font-medium whitespace-nowrap ${order.amount === 0 ? 'text-muted-foreground' : ''}`}>
                                                        {formatCurrency(order.amount)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                                        ${status.variant === 'success' ? 'bg-foreground text-background' : ''}
                                                        ${status.variant === 'pending' ? 'bg-muted text-foreground' : ''}
                                                        ${status.variant === 'cancelled' ? 'bg-muted text-muted-foreground line-through' : ''}
                                                    `}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link href={`/orders/${order.code}`} className="shrink-0">
                                                            <Button as="div" variant="outline" size="sm" className="whitespace-nowrap">Chi tiết</Button>
                                                        </Link>

                                                        {order.status === 'PENDING' && order.amount > 0 && (
                                                            <>
                                                                <Link href={`/order/${order.code}`} className="shrink-0">
                                                                    <Button as="div" size="sm" className="whitespace-nowrap bg-zinc-950 text-white hover:bg-zinc-800">Thanh toán</Button>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDeleteOrder(order.id, order.code)}
                                                                    disabled={deletingOrder === order.id}
                                                                    className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50 shrink-0"
                                                                    title="Xóa đơn hàng"
                                                                >
                                                                    <Trash2 className={`w-4 h-4 text-muted-foreground hover:text-foreground ${deletingOrder === order.id ? 'animate-pulse' : ''}`} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {(order.status === 'PAID' || order.status === 'COMPLETED' || isFreeCompleted) && (
                                                            (() => {
                                                                const hasCourses = order.courses && order.courses.length > 0;
                                                                const hasProducts = order.products && order.products.length > 0;

                                                                let buttonText = 'Xem';
                                                                let buttonLink = '/dashboard';

                                                                if (hasCourses && hasProducts) {
                                                                    buttonText = 'Xem';
                                                                    buttonLink = '/dashboard';
                                                                } else if (hasCourses) {
                                                                    buttonText = 'Vào học';
                                                                    buttonLink = '/dashboard';
                                                                } else if (hasProducts) {
                                                                    buttonText = 'Xem sản phẩm';
                                                                    buttonLink = '/my-products';
                                                                }

                                                                return (
                                                                    <Link href={buttonLink} className="shrink-0">
                                                                        <Button as="div" variant="outline" size="sm" className="whitespace-nowrap">{buttonText}</Button>
                                                                    </Link>
                                                                );
                                                            })()
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Stats - Simple black/white */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold">{orders.length}</p>
                                <p className="text-sm text-muted-foreground">Tổng đơn</p>
                            </div>
                            <div className="border rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === 'PAID' || o.status === 'COMPLETED' || o.amount === 0).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                            </div>
                            <div className="border rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === 'PENDING' && o.amount > 0).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
