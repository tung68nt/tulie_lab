'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { Clock, CheckCircle2, AlertCircle, Search, RefreshCcw, Copy } from 'lucide-react';

export default function AdminWebhooksPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await api.admin.payments.listTransactions() as any[];
            setTransactions(data);
        } catch (e) {
            console.error(e);
            addToast('Lỗi tải danh sách giao dịch', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filtered = transactions.filter(t =>
        (t.content?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (t.referenceCode?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (t.accountNumber?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Quản lý các biến động số dư từ cổng thanh toán Sepay.</p>
                </div>
                <button
                    onClick={fetchTransactions}
                    className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    Làm mới
                </button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nội dung, mã tham chiếu, số tài khoản..."
                        className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Cấu hình Webhook</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            Sử dụng URL này để cấu hình Webhook trong trang quản lý của Sepay.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1 border">
                                {typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/api/payments/sepay-webhook` : '.../api/payments/sepay-webhook'}
                            </code>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const url = `${window.location.protocol}//${window.location.host}/api/payments/sepay-webhook`;
                                    navigator.clipboard.writeText(url);
                                    addToast('Đã sao chép Webhook URL', 'success');
                                }}
                            >
                                <Copy size={14} className="mr-2" /> Sao chép
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Danh sách giao dịch</CardTitle>
                        <span className="text-xs text-muted-foreground">Tổng số: {filtered.length}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground font-medium">
                                    <th className="text-left py-3 px-2 font-semibold">Ngày</th>
                                    <th className="text-left py-3 px-2 font-semibold">Nội dung</th>
                                    <th className="text-right py-3 px-2 font-semibold">Số tiền</th>
                                    <th className="text-left py-3 px-2 font-semibold">Tài khoản</th>
                                    <th className="text-left py-3 px-2 font-semibold">Mã GD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20 bg-muted/5 text-muted-foreground">Đang tải dữ liệu...</td>
                                    </tr>
                                )}
                                {!loading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20 bg-muted/5 text-muted-foreground">Không tìm thấy giao dịch nào.</td>
                                    </tr>
                                )}
                                {!loading && filtered.map((t) => (
                                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs">
                                                    {new Date(t.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(t.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 max-w-[300px]">
                                            <p className="font-mono text-xs break-all bg-muted/50 p-1.5 rounded border border-border/50">{t.content}</p>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <span className={`font-bold ${t.amountIn > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {t.amountIn > 0 ? '+' : ''}{formatVND(Number(t.amountIn || 0))}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="text-xs flex flex-col">
                                                <span className="font-medium">{t.accountNumber}</span>
                                                <span className="text-muted-foreground">Sepay</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="text-xs flex flex-col">
                                                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{t.referenceCode || 'N/A'}</code>
                                                <span className="text-[9px] text-muted-foreground mt-0.5 truncate max-w-[80px]">{t.gateway}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-muted rounded-full mb-3">
                            <Clock size={24} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Đồng bộ cuối</p>
                        <p className="text-2xl font-bold">Vừa xong</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-muted rounded-full mb-3">
                            <AlertCircle size={24} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Xử lý lỗi</p>
                        <p className="text-2xl font-bold">0 GD</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
