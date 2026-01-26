'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useConfirm } from '@/components/ConfirmDialog';
import { Clock, CircleAlert, Search, RefreshCcw, Copy, Save, Loader2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function AdminWebhooksPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    // Bank Config State
    const [bankConfig, setBankConfig] = useState<any>({});
    const [savingConfig, setSavingConfig] = useState(false);

    // QR Generator State
    const [qrAmount, setQrAmount] = useState('');
    const [qrDescription, setQrDescription] = useState('');

    // API Key State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const confirm = useConfirm();

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.admin.payments.getTransactions();
            setTransactions(res.data || []);
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
            const syntax = settings.payment_transfer_syntax || '';
            // Extract prefix (everything before {{code}})
            const prefix = syntax.replace('{{code}}', '').trim();

            setBankConfig({
                bank_name: settings.bank_name || '',
                bank_account_no: settings.bank_account_no || '',
                bank_account_name: settings.bank_account_name || '',
                payment_transfer_syntax: syntax
            });

            // Pre-fill QR description with the prefix
            if (prefix) {
                setQrDescription(prefix);
            }
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

    const fetchApiKey = async () => {
        try {
            const data: any = await api.admin.settings.getApiKey();
            setApiKey(data.apiKey);
        } catch (e) {
            console.error('Failed to load API key', e);
        }
    };

    const handleRegenerateApiKey = async () => {
        // Only ask for confirmation if key already exists
        if (apiKey) {
            const confirmed = await confirm({
                title: 'Tạo lại API Key',
                message: 'Bạn có chắc muốn tạo lại API Key? Key cũ sẽ không còn hoạt động.',
                variant: 'warning',
                confirmText: 'Tạo lại',
                cancelText: 'Hủy'
            });
            if (!confirmed) return;
        }

        setRegenerating(true);
        try {
            const data: any = await api.admin.settings.regenerateApiKey();
            setApiKey(data.apiKey);
            setShowApiKey(true);
            addToast('Đã tạo API Key mới', 'success');
        } catch (e: any) {
            addToast(e.message || 'Lỗi tạo API Key', 'error');
        } finally {
            setRegenerating(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchBankConfig();
        fetchApiKey();
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
            <AdminPageHeader
                title="Cấu hình Thanh toán & Webhooks"
                subtitle="Quản lý thông tin tài khoản ngân hàng, webhook và công cụ hỗ trợ thanh toán."
            />

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
                            Ví dụ: <code className="bg-muted px-1 rounded">DH {`{{code}}`}</code> → Kết quả: <strong>DH ORD-12345</strong>
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
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Webhook URL</label>
                        <p className="text-xs text-muted-foreground">
                            Sử dụng URL này để cấu hình Webhook từ cổng thanh toán.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="bg-muted px-3 py-2 rounded text-sm font-mono font-semibold flex-1 border">
                                {typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/api/payments/webhook` : '.../api/payments/webhook'}
                            </code>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const url = `${window.location.protocol}//${window.location.host}/api/payments/webhook`;
                                    navigator.clipboard.writeText(url);
                                    addToast('Đã sao chép Webhook URL', 'success');
                                }}
                            >
                                <Copy size={14} className="mr-2" /> Sao chép
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t">
                        <label className="text-sm font-medium">API Key (Bảo mật)</label>
                        <p className="text-xs text-muted-foreground">
                            Sử dụng API Key này để xác thực webhook từ cổng thanh toán.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="bg-muted px-3 py-2 rounded text-sm font-mono font-semibold flex-1 border">
                                {apiKey ? (showApiKey ? apiKey : '••••••••••••••••••••') : 'Chưa tạo API Key'}
                            </code>
                            {apiKey && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? 'Ẩn' : 'Hiện'}
                                </Button>
                            )}
                            {apiKey && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(apiKey);
                                        addToast('Đã sao chép API Key', 'success');
                                    }}
                                >
                                    <Copy size={14} />
                                </Button>
                            )}
                        </div>
                        <Button
                            variant={apiKey ? 'outline' : 'default'}
                            size="sm"
                            className="w-fit"
                            onClick={handleRegenerateApiKey}
                            disabled={regenerating}
                        >
                            {regenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {apiKey ? 'Tạo lại API Key' : 'Tạo API Key mới'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* QR Code Generator */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Công cụ tạo mã QR</CardTitle>
                    <CardDescription>Tạo mã QR thanh toán thủ công để test hoặc gửi cho khách.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số tiền (VND)</label>
                            <Input
                                type="number"
                                value={qrAmount}
                                onChange={(e) => setQrAmount(e.target.value)}
                                placeholder="Ví dụ: 500000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nội dung chuyển khoản</label>
                            <Input
                                value={qrDescription}
                                onChange={(e) => setQrDescription(e.target.value)}
                                placeholder="Ví dụ: DH ORD-12345"
                            />
                        </div>
                    </div>
                    {bankConfig.bank_account_no && qrAmount && (
                        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-muted/50 rounded-lg border">
                            <div className="bg-white p-4 rounded-xl shadow-sm border" id="qr-preview">
                                <img
                                    src={`https://img.vietqr.io/image/${bankConfig.bank_name || 'MB'}-${bankConfig.bank_account_no}-qr_only.png?amount=${qrAmount}&addTag=1&description=${encodeURIComponent(qrDescription || 'Thanh toan')}`}
                                    alt="QR Code"
                                    className="w-48 h-48 rounded-lg bg-white p-2"
                                    crossOrigin="anonymous"
                                />
                                <div className="text-center text-xs mt-4 space-y-1">
                                    <p className=" whitespace-nowrap"><span className="text-muted-foreground w-20 inline-block text-right mr-2">Ngân hàng:</span> <strong className="font-bold">{bankConfig.bank_name || 'N/A'}</strong></p>
                                    <p className=" whitespace-nowrap"><span className="text-muted-foreground w-20 inline-block text-right mr-2">STK:</span> <strong className="font-bold font-mono text-sm">{bankConfig.bank_account_no}</strong></p>
                                    <p className=" whitespace-nowrap"><span className="text-muted-foreground w-20 inline-block text-right mr-2">Chủ TK:</span> <strong className="font-bold uppercase">{bankConfig.bank_account_name || 'Unknown'}</strong></p>
                                    <p className=" whitespace-nowrap"><span className="text-muted-foreground w-20 inline-block text-right mr-2">Số tiền:</span> <strong className="font-bold text-lg">{formatVND(Number(qrAmount) || 0)}</strong></p>
                                    <p className=" whitespace-nowrap"><span className="text-muted-foreground w-20 inline-block text-right mr-2">Nội dung:</span> <strong className="font-bold font-mono">{qrDescription || 'Thanh toan'}</strong></p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const qrUrl = `https://img.vietqr.io/image/${bankConfig.bank_name || 'MB'}-${bankConfig.bank_account_no}-qr_only.png?amount=${qrAmount}&description=${encodeURIComponent(qrDescription || 'Thanh toan')}`;
                                        navigator.clipboard.writeText(qrUrl);
                                        addToast('Đã sao chép URL mã QR', 'success');
                                    }}
                                >
                                    <Copy size={14} className="mr-2" /> URL
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-sky-600 hover:bg-sky-700 text-white"
                                    onClick={async () => {
                                        try {
                                            const canvas = document.createElement('canvas');
                                            const ctx = canvas.getContext('2d');
                                            if (!ctx) return;

                                            // Configure canvas
                                            const width = 450;
                                            const height = 600;
                                            canvas.width = width;
                                            canvas.height = height;

                                            // Draw Background
                                            ctx.fillStyle = '#ffffff';
                                            ctx.fillRect(0, 0, width, height);

                                            // Load Image
                                            const img = new Image();
                                            img.crossOrigin = "anonymous";
                                            img.src = `https://img.vietqr.io/image/${bankConfig.bank_name || 'MB'}-${bankConfig.bank_account_no}-qr_only.png?amount=${qrAmount}&description=${encodeURIComponent(qrDescription || 'Thanh toan')}`;

                                            await new Promise((resolve) => {
                                                img.onload = resolve;
                                                img.onerror = () => {
                                                    addToast('Lỗi tải ảnh QR (CORS?)', 'error');
                                                    resolve(null);
                                                }
                                            });

                                            // Draw Image
                                            const qrSize = 250;
                                            const qrX = (width - qrSize) / 2;
                                            ctx.drawImage(img, qrX, 60, qrSize, qrSize);

                                            // Draw Text
                                            ctx.fillStyle = '#18181b'; // zinc-900
                                            ctx.textAlign = 'center';

                                            ctx.font = 'bold 20px Inter, sans-serif';
                                            ctx.fillText(bankConfig.bank_name || 'NGAN HANG', width / 2, 360);

                                            ctx.font = 'bold 28px Inter, monospace';
                                            ctx.fillText(bankConfig.bank_account_no || '0000000000', width / 2, 400);

                                            ctx.font = 'bold 20px Inter, sans-serif';
                                            ctx.fillText((bankConfig.bank_account_name || '').toUpperCase(), width / 2, 440);

                                            ctx.font = 'bold 36px Inter, sans-serif';
                                            ctx.fillText(formatVND(Number(qrAmount) || 0), width / 2, 500);

                                            ctx.font = '18px Inter, sans-serif';
                                            ctx.fillStyle = '#52525b'; // zinc-600
                                            ctx.fillText(qrDescription || 'Noi dung', width / 2, 540);

                                            canvas.toBlob(blob => {
                                                if (blob) {
                                                    navigator.clipboard.write([
                                                        new ClipboardItem({ 'image/png': blob })
                                                    ]);
                                                    addToast('Đã copy ảnh QR vào clipboard!', 'success');
                                                }
                                            });

                                        } catch (e) {
                                            console.error(e);
                                            addToast('Lỗi tạo ảnh', 'error');
                                        }
                                    }}
                                >
                                    <Copy size={14} className="mr-2" /> Sao chép ảnh
                                </Button>
                            </div>
                        </div>
                    )}
                    {!bankConfig.bank_account_no && (
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 flex items-center gap-2">
                            <CircleAlert className="h-4 w-4 shrink-0" />
                            Vui lòng cấu hình thông tin tài khoản nhận tiền ở trên trước khi tạo mã QR.
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
