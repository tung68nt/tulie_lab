'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, RefreshCw, ArrowLeft, History, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
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
    createdAt: string;
}

export default function AdminPaymentsPage() {
    const { addToast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await api.admin.payments.getTransactions();
            setTransactions(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error('Failed to load transactions:', error);
            addToast('Không thể tải lịch sử giao dịch', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await api.admin.payments.syncTransactions();
            addToast(`Đã đồng bộ thành công ${res.result?.processed || 0} giao dịch`, 'success');
            loadTransactions();
        } catch (error: any) {
            addToast(error.message || 'Lỗi đồng bộ giao dịch', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-container space-y-6">
            <AdminPageHeader
                title="Lịch sử giao dịch"
                subtitle="Theo dõi các giao dịch ngân hàng được đồng bộ tự động"
            >
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleSync}
                        disabled={syncing}
                        className="gap-2"
                    >
                        <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Đang đồng bộ...' : 'Đồng bộ giao dịch'}
                    </Button>
                    <Link href="/admin/orders">
                        <Button variant="outline" size="sm" className="gap-2">
                            <FileText size={14} />
                            Xem đơn hàng
                        </Button>
                    </Link>
                </div>
            </AdminPageHeader>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <History size={18} />
                        Giao dịch gần đây
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">{transactions.length} giao dịch</span>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                            <div className="mb-4">
                                <History size={48} className="mx-auto opacity-20" />
                            </div>
                            <p>Chưa có giao dịch nào được ghi nhận</p>
                            <Button variant="link" onClick={handleSync} className="mt-2">
                                Thử đồng bộ ngay
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left py-3 px-3 font-medium">Thời gian</th>
                                        <th className="text-left py-3 px-3 font-medium">Ngân hàng</th>
                                        <th className="text-left py-3 px-3 font-medium">Nội dung</th>
                                        <th className="text-right py-3 px-3 font-medium">Số tiền</th>
                                        <th className="text-center py-3 px-3 font-medium">Mã đơn</th>
                                        <th className="text-right py-3 px-3 font-medium">Ref Code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(tx.transactionDate || tx.createdAt)}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-medium">{tx.gateway}</div>
                                                <div className="text-[10px] text-muted-foreground">{tx.accountNumber}</div>
                                            </td>
                                            <td className="py-3 px-3 max-w-[300px]">
                                                <div className="truncate text-xs" title={tx.content || tx.description}>
                                                    {tx.content || tx.description || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-right font-bold text-zinc-900">
                                                {formatCurrency(tx.amountIn)}
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                {tx.code ? (
                                                    <span className="text-xs bg-zinc-900 text-zinc-100 px-2 py-0.5 rounded-full font-mono font-bold">
                                                        {tx.code}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-muted-foreground italic">Không xác định</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-right text-xs font-mono text-muted-foreground">
                                                {tx.referenceCode || tx.id.slice(-8)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
