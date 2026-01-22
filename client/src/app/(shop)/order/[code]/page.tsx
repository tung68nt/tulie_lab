'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Info, CircleCheck, Copy, Check } from 'lucide-react';

export default function OrderPage({ params }: { params: any }) {
    const [code, setCode] = useState<string>('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

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
                setIsChecking(true);
                const orderData = await api.payments.getOrder(code);
                if (orderData && orderData.status !== order?.status) {
                    setOrder(orderData);
                }
            } catch (e) {
                console.error("Failed to refresh order status", e);
            } finally {
                setTimeout(() => setIsChecking(false), 1000);
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
        // Check if order contains courses or products
        const hasCourses = order.items?.some((item: any) => item.course) || false;
        const hasProducts = order.items?.some((item: any) => item.product) || false;

        // Determine message and button based on items
        let message = 'Thanh toán thành công!';
        let description = '';
        let buttonText = '';
        let buttonLink = '/dashboard';

        if (hasCourses && hasProducts) {
            description = 'Bạn đã mua thành công khóa học và sản phẩm.';
            buttonText = 'Xem ngay';
        } else if (hasCourses) {
            description = 'Bạn đã đăng ký thành công khóa học.';
            buttonText = 'Vào học ngay';
        } else if (hasProducts) {
            description = 'Bạn đã mua thành công sản phẩm.';
            buttonText = 'Xem sản phẩm';
            buttonLink = '/my-products';
        } else {
            description = 'Đơn hàng của bạn đã được xử lý thành công.';
            buttonText = 'Xem chi tiết';
        }

        return (
            <div className="container py-20 text-center">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <CircleCheck className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{message}</h1>
                    <p className="text-muted-foreground mb-6">{description}</p>
                    <Link href={buttonLink}>
                        <Button as="div" className="w-full">{buttonText}</Button>
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 md:py-16">
            <div className="container max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Thanh toán đơn hàng</h1>
                    <p className="text-muted-foreground">
                        Mã đơn hàng: <span className="font-mono font-bold text-foreground">{order.code}</span>
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Amount & QR Code */}
                    <div className="bg-card border rounded-2xl p-8 shadow-xl space-y-6">
                        {/* Amount */}
                        <div className="text-center pb-6 border-b">
                            <p className="text-sm text-muted-foreground mb-2">Số tiền cần thanh toán</p>
                            <p className="text-5xl md:text-6xl font-bold text-foreground">
                                {new Intl.NumberFormat('vi-VN').format(Number(order.amount))} ₫
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-[320px] aspect-square">
                                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl"></div>
                                <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                                    <img src={qrUrl} alt="QR Code Payment" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4 text-center">
                                Quét mã QR bằng app ngân hàng
                            </p>
                        </div>

                        {/* Payment Status */}
                        <div className={`p-4 rounded-xl transition-all duration-300 ${
                            isChecking ? 'bg-primary/5' : 'bg-muted/30'
                        }`}>
                            <div className="flex items-center justify-center gap-3">
                                {isChecking ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                        <span className="text-sm font-medium text-primary animate-pulse">Đang kiểm tra thanh toán...</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-muted-foreground">Chờ xác nhận thanh toán</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Bank Info & Actions */}
                    <div className="space-y-6">
                        {/* Bank Information */}
                        <div className="bg-card border rounded-2xl p-6 shadow-xl space-y-4">
                            <h3 className="text-xl font-bold mb-4">Thông tin chuyển khoản</h3>

                            {/* Single table-like layout */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">Ngân hàng</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(bankName, 'bank')}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
                                        >
                                            {copiedField === 'bank' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">Số tài khoản</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold">{accountNo}</span>
                                        <button
                                            onClick={() => copyToClipboard(accountNo, 'account')}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
                                        >
                                            {copiedField === 'account' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">Chủ tài khoản</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{accountName}</span>
                                        <button
                                            onClick={() => copyToClipboard(accountName, 'name')}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
                                        >
                                            {copiedField === 'name' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-3">
                                    <span className="text-muted-foreground">Nội dung chuyển khoản</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-primary">{transferContent}</span>
                                        <button
                                            onClick={() => copyToClipboard(transferContent, 'content')}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
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
                        <Button
                            className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                            size="lg"
                            onClick={() => window.location.reload()}
                        >
                            Tôi đã chuyển khoản
                        </Button>

                        {/* Auto Verification Note */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-100 text-center leading-relaxed">
                                💡 Hệ thống tự động kích hoạt sau khi nhận thanh toán (1-2 phút)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
