'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Info, CircleCheck, Copy, Check } from 'lucide-react';

export default function OrderPage({ params }: { params: any }) {
    const [code, setCode] = useState<string>('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Handle params promise safely
    useEffect(() => {
        if (params instanceof Promise) {
            params.then(p => {
                if (p.code) setCode(p.code);
            });
        } else if (params && typeof params === 'object' && params.code) {
            setCode(params.code);
        }
    }, [params]);

    useEffect(() => {
        // Only fetch if code is available
        if (!code) return;

        const fetchData = async () => {
            try {
                // Parallel fetch
                const [orderData, settingsData] = await Promise.all([
                    api.payments.getOrder(code).catch(e => {
                        console.warn("Failed to fetch order", e);
                        return null;
                    }),
                    api.settings.getPublic().catch(() => ({}))
                ]);

                setOrder(orderData);
                setSettings(settingsData);
            } catch (e) {
                console.error("Error loading order page", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Auto-refresh order status every 5 seconds if order is pending
        const interval = setInterval(async () => {
            try {
                const orderData = await api.payments.getOrder(code);
                if (orderData && orderData.status !== order?.status) {
                    setOrder(orderData);
                }
            } catch (e) {
                console.error("Failed to refresh order status", e);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [code]);

    if (loading) return <div className="p-10 text-center">Đang tải thông tin đơn hàng...</div>;

    if (!order) return (
        <div className="container py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Đơn hàng không tồn tại</h1>
            <Link href="/courses">
                <Button as="div">Quay lại danh sách khóa học</Button>
            </Link>
        </div>
    );

    // Redirect if this is a free course (shouldn't be here)
    if (order && order.amount === 0) {
        return (
            <div className="container py-20 text-center">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <Info className="h-16 w-16 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Khóa học miễn phí</h1>
                    <p className="text-muted-foreground mb-6">Khóa học này hoàn toàn miễn phí. Bạn không cần thanh toán.</p>
                    <Link href="/my-learning">
                        <Button as="div" className="w-full">Vào học ngay</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (order.status === 'PAID') {
        return (
            <div className="container py-20 text-center">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <CircleCheck className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
                    <p className="text-muted-foreground mb-6">Bạn đã đăng ký thành công khóa học.</p>
                    <Link href="/dashboard">
                        <Button as="div" className="w-full">Vào học ngay</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Dynamic Bank Info
    const bankName = settings.bank_name || 'MB Bank';
    const accountNo = settings.bank_account_no || '0999999999';
    const accountName = settings.bank_account_name || 'NGUYEN VAN A';

    // Dynamic Transfer Content
    const syntax = settings.payment_transfer_syntax || '{{code}}';
    const transferContent = syntax.replace('{{code}}', order.code);

    const qrUrl = `https://qr.sepay.vn/img?acc=${accountNo}&bank=${bankName}&amount=${order.amount}&des=${transferContent}`;

    return (
        <div className="container pt-6 md:pt-10" style={{ paddingBottom: '120px' }}>
            <div className="mx-auto max-w-5xl">
                <Card>
                    <CardHeader className="text-center border-b">
                        <CardTitle className="text-2xl font-semibold">Thanh toán đơn hàng</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Mã đơn hàng: <span className="font-semibold text-foreground">{order.code}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        {/* Responsive Grid: 1 column on mobile, 2 columns on landscape/tablet+ */}
                        <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2 items-start">
                            {/* Left Column: QR Code */}
                            <div className="flex flex-col items-center justify-start space-y-4 order-1">
                                {/* Amount Display */}
                                <div className="w-full rounded-lg bg-muted/50 p-5 text-center border border-border">
                                    <p className="text-sm text-muted-foreground mb-2">Số tiền cần thanh toán</p>
                                    <p className="text-3xl font-semibold text-foreground">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.amount))}
                                    </p>
                                </div>

                                {/* QR Code */}
                                <div className="flex flex-col items-center space-y-3 w-full">
                                    <div className="relative aspect-square w-full max-w-[320px] lg:max-w-[280px] overflow-hidden rounded-xl border-2 border-border bg-white p-3 shadow-lg">
                                        <img src={qrUrl} alt="QR Code Payment" className="h-full w-full object-contain" />
                                    </div>
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 w-full max-w-[320px] lg:max-w-[280px]">
                                        <p className="text-center text-sm leading-normal">
                                            <span className="text-muted-foreground">Quét mã QR bằng app ngân hàng</span>
                                            <br />
                                            <span className="font-semibold text-foreground mt-2 block">
                                                Nội dung chuyển khoản:
                                            </span>
                                            <span className="font-semibold text-foreground block">
                                                {transferContent}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Bank Info & Actions */}
                            <div className="flex flex-col justify-start space-y-6 order-2">
                                {/* Bank Information */}
                                <div className="rounded-xl border-2 border-border p-5 space-y-3 bg-card h-fit">
                                    <h3 className="font-semibold text-lg mb-4 text-center lg:text-left">Thông tin chuyển khoản</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-3 border-b">
                                            <span className="text-sm text-muted-foreground">Ngân hàng</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-base">{bankName}</span>
                                                <button
                                                    onClick={() => copyToClipboard(bankName, 'bank')}
                                                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedField === 'bank' ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b">
                                            <span className="text-sm text-muted-foreground">Số tài khoản</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-base">{accountNo}</span>
                                                <button
                                                    onClick={() => copyToClipboard(accountNo, 'account')}
                                                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedField === 'account' ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b">
                                            <span className="text-sm text-muted-foreground">Chủ tài khoản</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-base">{accountName}</span>
                                                <button
                                                    onClick={() => copyToClipboard(accountName, 'name')}
                                                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedField === 'name' ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">Nội dung chuyển khoản</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground text-base">{transferContent}</span>
                                                <button
                                                    onClick={() => copyToClipboard(transferContent, 'content')}
                                                    className="p-1.5 hover:bg-muted rounded-md transition-colors"
                                                    title="Copy"
                                                >
                                                    {copiedField === 'content' ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full text-base h-12"
                                        size="lg"
                                        variant="default"
                                        onClick={() => window.location.reload()}
                                    >
                                        Tôi đã chuyển khoản
                                    </Button>
                                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                                        <p className="text-center text-xs text-muted-foreground leading-relaxed">
                                            Hệ thống tự động kích hoạt sau khi nhận thanh toán (1-2 phút)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
