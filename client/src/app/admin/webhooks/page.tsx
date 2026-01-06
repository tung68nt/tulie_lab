'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Clock, CheckCircle2, AlertCircle, Search, RefreshCcw, Copy, Save, Loader2 } from 'lucide-react';

export default function AdminWebhooksPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    // Bank Config State
    const [bankConfig, setBankConfig] = useState<any>({});
    const [savingConfig, setSavingConfig] = useState(false);

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

    const fetchBankConfig = async () => {
        try {
            const settings: any = await api.admin.settings.get();
            setBankConfig({
                bank_name: settings.bank_name || '',
                bank_account_no: settings.bank_account_no || '',
                bank_account_name: settings.bank_account_name || '',
                payment_transfer_syntax: settings.payment_transfer_syntax || ''
            });
        } catch (e) {
            console.error('Failed to load bank config', e);
        }
    };

    const handleSaveBankConfig = async () => {
        setSavingConfig(true);
        try {
            await api.admin.settings.update(bankConfig);
            addToast('Đã lưu cấu hình thanh toán', 'success');
        } catch (e: any) {
            addToast(e.message || 'Lỗi lưu cấu hình', 'error');
        } finally {
            setSavingConfig(false);
        }
    };

    const handleConfigChange = (key: string, value: string) => {
        setBankConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchTransactions();
        fetchBankConfig();
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
                    <h1 className="text-3xl font-bold">Cổng thanh toán</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Cấu hình thanh toán và lịch sử giao dịch.</p>
                </div>
                <button
                    onClick={fetchTransactions}
                    className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    Làm mới
                </button>
            </div>

            {/* Bank Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thông tin tài khoản nhận tiền</CardTitle>
                    <CardDescription>Cấu hình để tạo mã QR thanh toán và nội dung chuyển khoản.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên ngân hàng</label>
                            <Input
                                value={bankConfig.bank_name || ''}
                                onChange={(e) => handleConfigChange('bank_name', e.target.value)}
                                placeholder="Ví dụ: VietinBank"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số tài khoản</label>
                            <Input
                                value={bankConfig.bank_account_no || ''}
                                onChange={(e) => handleConfigChange('bank_account_no', e.target.value)}
                                placeholder="Ví dụ: 104002106705"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Chủ tài khoản</label>
                            <Input
                                value={bankConfig.bank_account_name || ''}
                                onChange={(e) => handleConfigChange('bank_account_name', e.target.value)}
                                placeholder="Ví dụ: NGUYEN VAN A"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                        <label className="text-sm font-medium">Cú pháp nội dung chuyển khoản</label>
                        <Input
                            value={bankConfig.payment_transfer_syntax || ''}
                            onChange={(e) => handleConfigChange('payment_transfer_syntax', e.target.value)}
                            placeholder="Mặc định: {{code}}"
                        />
                        <p className="text-xs text-muted-foreground">
                            Dùng <code className="bg-muted px-1 rounded">{`{{code}}`}</code> để thay bằng mã đơn (VD: ORD-123).
                            Ví dụ: <code className="bg-muted px-1 rounded">SEVQR {`{{code}}`}</code> → Kết quả: <strong>SEVQR ORD-12345</strong>
                        </p>
                        <div className="p-3 bg-muted rounded text-sm">
                            <span className="text-muted-foreground mr-2">Xem trước:</span>
                            <span className="font-semibold">
                                {(bankConfig.payment_transfer_syntax || '{{code}}').replace('{{code}}', 'ORD-123456')}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSaveBankConfig} disabled={savingConfig}>
                            {savingConfig ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Lưu cấu hình
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Webhook Config */}
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

            {/* Search */}
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
