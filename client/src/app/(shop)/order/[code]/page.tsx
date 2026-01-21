'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Info, CircleCheck } from 'lucide-react';

export default function OrderPage({ params }: { params: any }) {
    const [code, setCode] = useState<string>('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});

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
                        // Fallback/Mock
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
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Thanh toán đơn hàng</CardTitle>
                        <CardDescription>Mã đơn hàng: <span className="font-bold text-primary">{order.code}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        {/* Responsive Grid: 1 column on mobile, 2 columns on landscape/tablet+ */}
                        <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
                            {/* Left Column: QR Code */}
                            <div className="flex flex-col items-center justify-center space-y-4 order-1">
                                {/* Amount Display */}
                                <div className="w-full rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center border border-primary/20">
                                    <p className="text-sm text-muted-foreground mb-1">Số tiền cần thanh toán</p>
                                    <p className="text-3xl md:text-4xl font-bold text-primary">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.amount))}
                                    </p>
                                </div>

                                {/* QR Code */}
                                <div className="flex flex-col items-center space-y-3 w-full">
                                    <div className="relative aspect-square w-full max-w-[320px] lg:max-w-[280px] overflow-hidden rounded-xl border-2 border-border bg-white p-3 shadow-lg">
                                        <img src={qrUrl} alt="QR Code Payment" className="h-full w-full object-contain" />
                                    </div>
                                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-3 w-full max-w-[320px] lg:max-w-[280px]">
                                        <p className="text-center text-sm">
                                            <span className="text-muted-foreground">Quét mã QR bằng app ngân hàng</span>
                                            <br />
                                            <span className="font-bold text-rose-600 dark:text-rose-400">
                                                Nội dung CK: {transferContent}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Bank Info & Actions */}
                            <div className="flex flex-col justify-center space-y-6 order-2">
                                {/* Bank Information */}
                                <div className="rounded-xl border-2 border-border p-5 space-y-3 bg-card">
                                    <h3 className="font-bold text-lg mb-4 text-center lg:text-left">Thông tin chuyển khoản</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b">
                                            <span className="text-sm text-muted-foreground">Ngân hàng</span>
                                            <span className="font-semibold text-base">{bankName}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b">
                                            <span className="text-sm text-muted-foreground">Số tài khoản</span>
                                            <span className="font-mono font-semibold text-base">{accountNo}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b">
                                            <span className="text-sm text-muted-foreground">Chủ tài khoản</span>
                                            <span className="font-semibold text-base">{accountName}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm text-muted-foreground">Nội dung CK</span>
                                            <span className="font-bold text-primary text-base">{transferContent}</span>
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
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
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
