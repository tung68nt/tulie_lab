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
            <div className="mx-auto max-w-4xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Thanh toán đơn hàng</CardTitle>
                        <CardDescription>Mã đơn hàng: <span className="font-bold text-primary">{order.code}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Left Column: QR & Price */}
                            <div className="flex flex-col space-y-6">
                                <div className="rounded-lg bg-muted/50 p-4 text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Số tiền cần thanh toán</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.amount))}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
                                        <img src={qrUrl} alt="QR Code Payment" className="h-full w-full object-contain" />
                                    </div>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Quét mã QR bằng ứng dụng ngân hàng để thanh toán.<br />
                                        <span className="font-semibold text-rose-500">Nội dung chuyển khoản bắt buộc: {transferContent}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Bank Info & Actions */}
                            <div className="flex flex-col space-y-6 justify-center">
                                <div className="rounded-lg border p-4 text-sm space-y-3">
                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <span className="text-muted-foreground">Ngân hàng</span>
                                        <span className="col-span-2 font-medium break-words text-right">{bankName}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <span className="text-muted-foreground">Số tài khoản</span>
                                        <span className="col-span-2 font-medium break-all text-right">{accountNo}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <span className="text-muted-foreground">Chủ tài khoản</span>
                                        <span className="col-span-2 font-medium break-words text-right">{accountName}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-2">
                                        <span className="text-muted-foreground">Nội dung</span>
                                        <span className="col-span-2 font-bold text-primary break-all text-right">{transferContent}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <Button className="w-full" size="lg" variant="default" onClick={() => window.location.reload()}>
                                        Tôi đã chuyển khoản
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground">
                                        Hệ thống sẽ tự động kích hoạt khóa học sau khi nhận được thanh toán (thường trong vòng 1-2 phút).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Hệ thống sẽ tự động kích hoạt khóa học sau khi nhận được thanh toán (thường trong vòng 1-2 phút).
                </p>
            </div>
        </div>
    );
}
