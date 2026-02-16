'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, RefreshCw, ArrowLeft, History, Search, FileText, ChevronLeft, ChevronRight, ExternalLink, CreditCard } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import Link from 'next/link';

interface Transaction {
    id: string;
    gateway: string;
    amountIn: number;
    transactionDate: string;
    accountNumber: string;
    content: string;
    referenceCode: string;
    description: string;
    code: string;
    orderId?: string;
    createdAt: string;
}

export default function AdminPaymentsPage() {
    const { addToast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncLimit, setSyncLimit] = useState(100);
    const limit = 20;

    const loadTransactions = useCallback(async (currentPage: number, currentSearch: string, start: string, end: string) => {
        try {
            setLoading(true);
            const res: any = await api.admin.payments.getTransactions({
                page: currentPage,
                limit,
                search: currentSearch,
                startDate: start,
                endDate: end
            });
            setTransactions(res.data || []);
            setTotal(res.total || 0);
        } catch (error) {
            console.error('Failed to load transactions:', error);
            addToast('Không thể tải lịch sử giao dịch', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    // Use a ref to store a timeout for debouncing
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            loadTransactions(page, search, startDate, endDate);
        }, 300);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [loadTransactions, page, search, startDate, endDate]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await api.admin.payments.syncTransactions({ limit: syncLimit });
            addToast(`Đã đồng bộ thành công ${res.result?.processed || 0} giao dịch`, 'success');
            setPage(1);
            loadTransactions(1, search, startDate, endDate);
        } catch (error: any) {
            addToast(error.message || 'Lỗi đồng bộ giao dịch', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const renderDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return (
            <div className="flex flex-col text-[10px] leading-tight text-muted-foreground">
                <span className="font-semibold text-foreground text-xs">
                    {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>
                    {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
            </div>
        );
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="admin-container space-y-6">
            <AdminPageHeader
                title="Lịch sử giao dịch"
                subtitle="Xem và đối soát tất cả giao dịch thanh toán từ cổng SePay"
                icon={<CreditCard className="w-8 h-8" />}
            >
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 border rounded-lg bg-white overflow-hidden shadow-sm">
                        <select
                            className="text-xs font-semibold px-2 py-1.5 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer"
                            value={syncLimit}
                            onChange={(e) => setSyncLimit(Number(e.target.value))}
                            disabled={syncing}
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                            <option value={1000}>1000</option>
                        </select>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleSync}
                            disabled={syncing}
                            className="gap-2 rounded-none border-l h-8"
                        >
                            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                            {syncing ? 'Đang sync...' : 'Đồng bộ'}
                        </Button>
                    </div>
                    <Link href="/admin/orders">
                        <Button variant="outline" size="sm" className="gap-2">
                            <FileText size={14} />
                            Xem đơn hàng
                        </Button>
                    </Link>
                </div>
            </AdminPageHeader>

            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History size={18} />
                            Giao dịch ngân hàng
                        </CardTitle>
                        <CardDescription>
                            Dữ liệu đồng bộ từ SePay. Mã đơn được tự động tách từ nội dung chuyển khoản.
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn, nội dung..."
                                className="pl-8 pr-3 py-1.5 text-xs bg-muted/50 border rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-primary"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs border rounded-lg px-2 py-1 bg-muted/50">
                            <input
                                type="date"
                                className="bg-transparent focus:outline-none"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setPage(1);
                                }}
                            />
                            <span className="opacity-40">→</span>
                            <input
                                type="date"
                                className="bg-transparent focus:outline-none"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <span className="text-sm font-semibold bg-muted px-2 py-1 rounded text-foreground border border-border">
                            {total}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading && transactions.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                            <div className="mb-4">
                                <History size={48} className="mx-auto opacity-20" />
                            </div>
                            <p>Không tìm thấy giao dịch nào khớp với điều kiện lọc</p>
                            <Button variant="link" onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); }} className="mt-2 text-primary font-semibold">
                                Xóa bộ lọc
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="overflow-x-auto border rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground/70">Thời gian</th>
                                            <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground/70">Ngân hàng</th>
                                            <th className="text-left py-3 px-4 font-semibold text-xs text-muted-foreground/70">Nội dung</th>
                                            <th className="text-right py-3 px-4 font-semibold text-xs text-muted-foreground/70">Số tiền</th>
                                            <th className="text-center py-3 px-4 font-semibold text-xs text-muted-foreground/70 text-nowrap">Mã đơn</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y relative">
                                        {loading && (
                                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                                <Loader2 className="animate-spin text-primary" />
                                            </div>
                                        )}
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    {renderDate(tx.transactionDate || tx.createdAt)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-semibold text-foreground text-xs">{tx.gateway}</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">{tx.accountNumber}</div>
                                                </td>
                                                <td className="py-3 px-4 min-w-[200px] max-w-[400px]">
                                                    <div className="text-[11px] leading-relaxed break-words text-muted-foreground" title={tx.content || tx.description}>
                                                        {tx.content || tx.description || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-foreground text-xs">
                                                    {formatCurrency(tx.amountIn)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {tx.code ? (
                                                        <Link href={tx.orderId ? `/admin/orders/${tx.orderId}` : `/admin/orders?search=${tx.code}`}>
                                                            <div className="group flex items-center justify-center gap-1.5 cursor-pointer">
                                                                <span className="text-[10px] bg-foreground text-background px-3 py-1 rounded-full font-mono font-semibold whitespace-nowrap group-hover:bg-primary/80 transition-colors shadow-sm">
                                                                    {tx.code}
                                                                </span>
                                                                {tx.orderId && <ExternalLink size={10} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />}
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">Không xác định</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        Hiển thị {transactions.length} / {total} giao dịch (Trang {page} / {totalPages})
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={page === 1 || loading}
                                            onClick={() => setPage(p => p - 1)}
                                        >
                                            <span className="sr-only">Trang trước</span>
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={page === totalPages || loading}
                                            onClick={() => setPage(p => p + 1)}
                                        >
                                            <span className="sr-only">Trang sau</span>
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
