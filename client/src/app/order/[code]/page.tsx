'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function OrderPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock bank info - in production this might come from env or config
    const BANK_INFO = {
        bankName: 'MB Bank',
        accountNo: '0999999999', // Replace with real one
        accountName: 'NGUYEN VAN A',
        template: 'print'
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await api.payments.getOrder(code);
                setOrder(data);
            } catch (e) {
                console.warn("Failed to fetch order, using mock data", e);
                // Fallback for mock orders or when backend is down
                setOrder({
                    code: code,
                    amount: 1200000,
                    status: 'PENDING'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [code]);

    if (loading) return <div className="p-10 text-center">Đang tải thông tin đơn hàng...</div>;

    if (!order) return (
        <div className="container py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Đơn hàng không tồn tại</h1>
            <Link href="/courses">
                <Button>Quay lại danh sách khóa học</Button>
            </Link>
        </div>
    );

    // Redirect if this is a free course (shouldn't be here)
    if (order && order.amount === 0) {
        return (
            <div className="container py-20 text-center">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg">
                    <div className="mb-6 text-6xl">ℹ️</div>
                    <h1 className="text-2xl font-bold mb-2">Khóa học miễn phí</h1>
                    <p className="text-muted-foreground mb-6">Khóa học này hoàn toàn miễn phí. Bạn không cần thanh toán.</p>
                    <Link href="/my-learning">
                        <Button className="w-full">Vào học ngay</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (order.status === 'PAID') {
        return (
            <div className="container py-20 text-center">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg">
                    <div className="mb-6 text-6xl">🎉</div>
                    <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
                    <p className="text-muted-foreground mb-6">Bạn đã đăng ký thành công khóa học.</p>
                    <Link href="/dashboard">
                        <Button className="w-full">Vào học ngay</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const qrUrl = `https://qr.sepay.vn/img?acc=${BANK_INFO.accountNo}&bank=${BANK_INFO.bankName}&amount=${order.amount}&des=${order.code}`;

    return (
        <div className="container pt-6 md:pt-10" style={{ paddingBottom: '120px' }}>
            <div className="mx-auto max-w-lg">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Thanh toán đơn hàng</CardTitle>
                        <CardDescription>Mã đơn hàng: <span className="font-bold text-primary">{order.code}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Số tiền cần thanh toán</p>
                            <p className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative aspect-square w-64 overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
                                <img src={qrUrl} alt="QR Code Payment" className="h-full w-full object-contain" />
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                Quét mã QR bằng ứng dụng ngân hàng để thanh toán.<br />
                                <span className="font-semibold text-rose-500">Nội dung chuyển khoản bắt buộc: {order.code}</span>
                            </p>
                        </div>

                        <div className="rounded-lg border p-4 text-sm">
                            <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                <span className="text-muted-foreground">Ngân hàng</span>
                                <span className="col-span-2 font-medium">{BANK_INFO.bankName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                <span className="text-muted-foreground">Số tài khoản</span>
                                <span className="col-span-2 font-medium">{BANK_INFO.accountNo}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                <span className="text-muted-foreground">Chủ tài khoản</span>
                                <span className="col-span-2 font-medium">{BANK_INFO.accountName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-2">
                                <span className="text-muted-foreground">Nội dung</span>
                                <span className="col-span-2 font-bold text-primary">{order.code}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" onClick={() => window.location.reload()}>
                            Tôi đã chuyển khoản
                        </Button>
                    </CardFooter>
                </Card>
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Hệ thống sẽ tự động kích hoạt khóa học sau khi nhận được thanh toán (thường trong vòng 1-2 phút).
                </p>
            </div>
        </div>
    );
}
