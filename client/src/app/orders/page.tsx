'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const profile: any = await api.users.getProfile();
                if (profile && profile.orders) {
                    setOrders(profile.orders);
                }
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
                <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-10 max-w-4xl">
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
                        <p className="text-muted-foreground mb-6">Khám phá các khóa học tuyệt vời của chúng tôi!</p>
                        <Link href="/courses">
                            <Button>Xem khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Orders Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-sm">
                                        <th className="px-4 py-3 font-medium">Mã đơn</th>
                                        <th className="px-4 py-3 font-medium">Ngày tạo</th>
                                        <th className="px-4 py-3 font-medium">Khóa học</th>
                                        <th className="px-4 py-3 font-medium text-right">Số tiền</th>
                                        <th className="px-4 py-3 font-medium text-center">Trạng thái</th>
                                        <th className="px-4 py-3 font-medium text-right">Thao tác</th>
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
                                                <td className="px-4 py-4 text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {order.courses && order.courses.length > 0 ? (
                                                        <span className="text-sm">{order.courses[0].title}</span>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className={`text-sm font-medium ${order.amount === 0 ? 'text-muted-foreground' : ''}`}>
                                                        {formatCurrency(order.amount)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                                        ${status.variant === 'success' ? 'bg-foreground text-background' : ''}
                                                        ${status.variant === 'pending' ? 'bg-muted text-foreground' : ''}
                                                        ${status.variant === 'cancelled' ? 'bg-muted text-muted-foreground line-through' : ''}
                                                    `}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    {order.status === 'PENDING' && order.amount > 0 ? (
                                                        <Link href={`/order/${order.code}`}>
                                                            <Button size="sm">Thanh toán</Button>
                                                        </Link>
                                                    ) : (order.status === 'PAID' || order.status === 'COMPLETED' || isFreeCompleted) ? (
                                                        <Link href="/dashboard">
                                                            <Button variant="outline" size="sm">Vào học</Button>
                                                        </Link>
                                                    ) : null}
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
