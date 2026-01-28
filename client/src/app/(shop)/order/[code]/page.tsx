'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Info, CircleCheck, Copy, Check, Sparkles, CreditCard, Wallet, MoveRight } from 'lucide-react';

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
            params.then((p: any) => {
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
                    api.payments.getOrder(code).catch((e: any) => {
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
            } catch (e: any) {
                console.error("Failed to refresh order status", e);
            } finally {
                setTimeout(() => setIsChecking(false), 1000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [code]);

    if (loading) return <div className="min-h-screen pt-12 text-center">Đang tải thông tin đơn hàng...</div>;

    if (!order) return (
        <div className="min-h-screen pt-12 container text-center">
            <div className="mx-auto max-w-md py-12">
                <h1 className="text-2xl font-bold mb-4">Đơn hàng không tồn tại</h1>
                <Link href="/courses">
                    <Button as="div">Quay lại danh sách khóa học</Button>
                </Link>
            </div>
        </div>
    );

    // Redirect if this is a free course (shouldn't be here)
    if (order && order.amount === 0) {
        return (
            <div className="min-h-screen pt-24 container">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg text-center">
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
            <div className="min-h-screen pt-12 pb-20 bg-background relative overflow-hidden">
                <div className="container flex flex-col items-center justify-center relative z-10">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/50 dark:bg-zinc-800/50 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4 shadow-sm">
                            <CircleCheck className="w-4 h-4 text-green-500" />
                            Thanh toán bảo mật
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Hoàn tất đơn hàng</h1>
                        <p className="text-muted-foreground text-lg">{description}</p>
                    </div>

                    <div className="mx-auto max-w-md w-full rounded-2xl border border-zinc-200 bg-card p-8 shadow-xl text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                                <CircleCheck className="h-10 w-10 text-green-500" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{message}</h2>
                        <p className="text-muted-foreground mb-8">Hệ thống đã ghi nhận thanh toán của bạn.</p>
                        <Link href={buttonLink}>
                            <Button as="div" size="lg" className="w-full font-bold h-12 rounded-xl">
                                {buttonText}
                                <MoveRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
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
        <div className="min-h-screen bg-background pt-4 pb-12">
            <div className="container max-w-4xl px-4">
                {/* Header Section - Ultra-Compact */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-medium border border-zinc-200 dark:border-zinc-700 mb-2">
                        <div className="w-1 h-1 rounded-full bg-zinc-400 animate-pulse" />
                        Chờ thanh toán
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Thanh toán đơn hàng</h1>
                </div>

                <div className="max-w-[720px] mx-auto">
                    {/* Unified Payment Card - Side by Side */}
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                            {/* Left Side: QR Code */}
                            <div className="p-6 flex flex-col items-center justify-center bg-zinc-50/30 dark:bg-zinc-900/10 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800">
                                <p className="text-[10px] font-medium text-zinc-400 mb-4">Quét mã QR để thanh toán</p>
                                <div className="bg-white p-2 rounded-xl border border-zinc-100 shadow-sm w-[180px]">
                                    <img src={qrUrl} alt="QR Code" className="w-full h-auto object-contain" />
                                </div>
                                <p className="text-[10px] text-zinc-400 mt-4 text-center px-4 leading-relaxed">
                                    Mở ứng dụng ngân hàng và quét mã để thanh toán tự động
                                </p>
                            </div>

                            {/* Right Side: Manual Info */}
                            <div className="p-6 space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-50 dark:border-zinc-900">
                                    <CreditCard className="w-4 h-4 text-zinc-400" />
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Thông tin chuyển khoản</h3>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-xs text-zinc-500">Ngân hàng</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{bankName}</span>
                                    </div>

                                    <div className="flex justify-between items-center group">
                                        <span className="text-xs text-zinc-500">Số tài khoản</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{accountNo}</span>
                                            <button onClick={() => copyToClipboard(accountNo, 'account')} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                                                {copiedField === 'account' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center group">
                                        <span className="text-xs text-zinc-500">Chủ tài khoản</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{accountName}</span>
                                    </div>

                                    <div className="h-px bg-zinc-50 dark:bg-zinc-900" />

                                    {/* Transfer Content */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-medium text-zinc-400">Nội dung chuyển khoản</label>
                                            <button onClick={() => copyToClipboard(transferContent, 'content')} className="text-zinc-900 dark:text-zinc-100 text-[10px] font-medium hover:underline flex items-center gap-1">
                                                {copiedField === 'content' ? 'Đã sao chép' : 'Sao chép nội dung'}
                                            </button>
                                        </div>
                                        <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-center">
                                            <p className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">{transferContent}</p>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="pt-1 flex flex-col items-center gap-0.5">
                                        <span className="text-[10px] text-zinc-400">Số tiền cần thanh toán</span>
                                        <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
                                            {new Intl.NumberFormat('vi-VN').format(Number(order.amount))}₫
                                        </p>
                                        <p className="text-[9px] text-zinc-400 mt-1 opacity-60">Đơn hàng: {order.code}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicator - Tighter */}
                    <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50">
                        <div className="relative flex h-1.5 w-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-400"></span>
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <p className="font-medium text-zinc-600 dark:text-zinc-400 text-[11px]">
                                Đang chờ hệ thống xác nhận...
                            </p>
                            <p className="text-[10px] text-zinc-400">Tự động sau vài giây</p>
                        </div>
                    </div>

                    {/* Minimal Footer */}
                    <div className="mt-8 text-center text-[10px] text-zinc-400">
                        <Link href="/contact" className="hover:text-zinc-600 transition-colors inline-flex items-center gap-1.5">
                            <Info className="w-3 h-3" />
                            Cần hỗ trợ? Liên hệ kỹ thuật 24/7
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
