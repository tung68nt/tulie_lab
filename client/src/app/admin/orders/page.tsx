'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Input } from '@/components/Input';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

import { CheckCircle2, Clock, XCircle, Search, Download, RotateCcw, Loader2 } from 'lucide-react';

interface Order {
    id: string;
    code: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
    user: {
        id: string;
        email: string;
        fullName?: string;
        name?: string;
    };
    courses?: {
        id: string;
        title: string;
    }[];
}

export default function AdminOrdersPage() {
    const { addToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        pending: 0,
        cancelled: 0,
        totalRevenue: 0
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when search or filter changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await api.admin.orders.list({
                page,
                limit: 10,
                search: debouncedSearch,
                status: statusFilter === 'all' ? undefined : statusFilter
            });
            setOrders(res.data);
            setTotalPages(res.meta.totalPages);
            if (res.meta.stats) {
                setStats(res.meta.stats);
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
            addToast('Không thể tải danh sách đơn hàng', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, statusFilter, addToast]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const updateOrderStatus = async (orderId: string, newStatus: 'PAID' | 'CANCELLED') => {
        try {
            setUpdatingId(orderId);
            await api.admin.orders.updateStatus(orderId, newStatus);
            addToast(`Đơn hàng đã được cập nhật`, 'success');
            loadOrders();
        } catch (error: any) {
            addToast(`Lỗi: ${error?.message || 'Không thể cập nhật đơn hàng'}`, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const exportToCSV = () => {
        // Export current view (or implement backend export later)
        const headers = ['Mã đơn', 'Member', 'Email', 'Workshop', 'Số tiền', 'Trạng thái', 'Ngày tạo'];
        const rows = orders.map(o => [
            o.code,
            o.user?.name || o.user?.fullName || 'N/A',
            o.user?.email || 'N/A',
            o.courses?.map(c => c.title).join('; ') || 'N/A',
            o.amount.toString(),
            o.status,
            new Date(o.createdAt).toLocaleDateString('vi-VN')
        ]);

        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        addToast('Đã xuất file CSV (Trang hiện tại)', 'success');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const isPaid = status === 'PAID' || status === 'COMPLETED';
        const isPending = status === 'PENDING';
        const isCancelled = status === 'CANCELLED';

        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${isPaid ? 'bg-foreground text-background' :
                isPending ? 'bg-muted text-muted-foreground' :
                    'bg-muted/50 text-muted-foreground/50'
                }`}>
                {isPaid ? <CheckCircle2 size={12} /> : isPending ? <Clock size={12} /> : <XCircle size={12} />}
                {isPaid ? 'Paid' : isPending ? 'Pending' : 'Cancelled'}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
                    <p className="text-sm text-muted-foreground">Quản lý tất cả giao dịch của hệ thống</p>
                </div>
                <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
                    <Download size={14} />
                    Xuất CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('all')}>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm text-muted-foreground font-medium">Total</div>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('PAID')}>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-3xl font-bold mb-1">{stats.paid}</div>
                        <div className="text-sm text-muted-foreground font-medium">Paid</div>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('PENDING')}>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                        <div className="text-sm text-muted-foreground font-medium">Pending</div>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('CANCELLED')}>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-3xl font-bold text-muted-foreground mb-1">{stats.cancelled}</div>
                        <div className="text-sm text-muted-foreground font-medium">Canceled</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xl font-bold mb-1">{formatCurrency(stats.totalRevenue)}</div>
                        <div className="text-sm text-muted-foreground font-medium">Revenue</div>
                    </CardContent>
                </Card>
            </div>


            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1">
                    <Input
                        placeholder="Tìm theo mã đơn, email, tên member, workshop..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-3 py-2 border rounded-lg bg-background text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="CANCELLED">Canceled</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }} className="gap-2">
                    <RotateCcw size={14} />
                    Reset
                </Button>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                        Danh sách đơn hàng ({stats.total})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            {search || statusFilter !== 'all'
                                ? 'Không tìm thấy đơn hàng phù hợp'
                                : 'Chưa có đơn hàng nào'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left py-3 px-3 font-medium">Mã đơn</th>
                                            <th className="text-left py-3 px-3 font-medium">Member</th>
                                            <th className="text-left py-3 px-3 font-medium">Workshop</th>
                                            <th className="text-right py-3 px-3 font-medium">Số tiền</th>
                                            <th className="text-center py-3 px-3 font-medium">Trạng thái</th>
                                            <th className="text-right py-3 px-3 font-medium">Ngày tạo</th>
                                            <th className="text-center py-3 px-3 font-medium">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} className="border-b hover:bg-muted/30">
                                                <td className="py-3 px-3">
                                                    <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                                        {order.code || order.id.slice(-8)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div>
                                                        <div className="font-medium">{order.user?.name || order.user?.fullName || 'N/A'}</div>
                                                        <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 max-w-[200px] truncate">
                                                    {order.courses?.[0]?.title || 'N/A'}
                                                </td>
                                                <td className="py-3 px-3 text-right font-medium">
                                                    {formatCurrency(order.amount)}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                                <td className="py-3 px-3 text-right text-muted-foreground text-xs">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="flex gap-1 justify-center">
                                                        {order.status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-foreground hover:bg-muted h-7 px-2 text-[11px]"
                                                                    onClick={() => updateOrderStatus(order.id, 'PAID')}
                                                                    disabled={updatingId === order.id}
                                                                >
                                                                    {updatingId === order.id ? '...' : 'Approve'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-foreground hover:bg-muted h-7 px-2 text-[11px]"
                                                                    onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                                    disabled={updatingId === order.id}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        )}
                                                        {(order.status === 'PAID' || order.status === 'COMPLETED') && (
                                                            <span className="text-xs text-foreground">Done</span>
                                                        )}
                                                        {order.status === 'CANCELLED' && (
                                                            <span className="text-xs text-muted-foreground">Cancelled</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
