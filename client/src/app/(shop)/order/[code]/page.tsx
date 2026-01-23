'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Info, CircleCheck, Copy, Check, Sparkles } from 'lucide-react';

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
        <div className="min-h-screen bg-background py-12 md:py-20 px-4">
            <div className="container max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Thanh toán đơn hàng
                    </h1>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium">
                        Mã đơn hàng: <span className="ml-2 font-mono text-primary">{order.code}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: QR and Amount */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-card border border-border/50 rounded-[2rem] p-8 shadow-2xl backdrop-blur-sm">
                                <div className="text-center mb-8">
                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Số tiền thanh toán</p>
                                    <p className="text-4xl md:text-5xl font-black text-foreground">
                                        {new Intl.NumberFormat('vi-VN').format(Number(order.amount))}
                                        <span className="ml-1 text-2xl md:text-3xl font-bold">₫</span>
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                                    <img src={qrUrl} alt="QR Code Payment" className="w-full h-auto" />
                                </div>

                                <p className="text-center mt-6 text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Quét mã bằng ứng dụng Ngân hàng
                                </p>
                            </div>
                        </div>

                        {/* Status Widget */}
                        <div className={`rounded-2xl border p-4 transition-all duration-500 flex items-center justify-center gap-3 ${isChecking
                            ? 'bg-primary/[0.03] border-primary/20 shadow-inner'
                            : 'bg-muted/30 border-border/50'
                            }`}>
                            {isChecking ? (
                                <>
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </div>
                                    <span className="text-sm font-bold text-primary tracking-wide">Đang xác thực giao dịch...</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                                    <span className="text-sm text-muted-foreground">Đang chờ tín hiệu thanh toán</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Bank Details & Action */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Info className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">Chi tiết chuyển khoản</h3>
                            </div>

                            <div className="space-y-1">
                                {[
                                    { label: 'Ngân hàng', value: bankName, id: 'bank' },
                                    { label: 'Số tài khoản', value: accountNo, id: 'account', mono: true },
                                    { label: 'Chủ tài khoản', value: accountName, id: 'name' },
                                    { label: 'Nội dung', value: transferContent, id: 'content', mono: true, highlight: true },
                                ].map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-muted/50 ${index !== 3 ? 'border-b border-border/10' : ''
                                            }`}
                                    >
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                            <p className={`text-base font-bold ${item.mono ? 'font-mono' : ''} ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                                                {item.value}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(item.value, item.id)}
                                            className={`p-2.5 rounded-lg border border-border/50 transition-all duration-300 ${copiedField === item.id
                                                ? 'bg-green-500/10 border-green-500/50 text-green-600'
                                                : 'bg-background hover:bg-foreground hover:text-background text-muted-foreground opacity-0 group-hover:opacity-100'
                                                }`}
                                        >
                                            {copiedField === item.id ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>

                                        {/* Mobile visible copy button */}
                                        <button
                                            onClick={() => copyToClipboard(item.value, item.id)}
                                            className="md:hidden p-2 text-muted-foreground active:text-primary"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action and Note */}
                        <div className="space-y-4">
                            <Button
                                className="w-full h-16 text-lg font-black tracking-wide shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all rounded-2xl"
                                size="lg"
                                onClick={() => window.location.reload()}
                            >
                                Tôi đã hoàn tất chuyển khoản
                            </Button>

                            <div className="relative overflow-hidden p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10 group">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
                                    <span>
                                        Hệ thống sẽ tự động xác minh và kích hoạt khóa học trong vòng <strong>1-2 phút</strong> sau khi nhận được tiền.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
