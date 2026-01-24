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
        <div className="min-h-screen bg-background pt-8 pb-20">
            <div className="container max-w-4xl px-4">
                {/* Header Section - More Compact */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        Chờ thanh toán
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Thanh toán đơn hàng</h1>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Unified Payment Card */}
                    <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left Side: QR Code */}
                            <div className="p-8 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Quét mã QR</p>
                                <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm w-full max-w-[200px] mb-4">
                                    <img src={qrUrl} alt="QR Code Payment" className="w-full h-auto object-contain" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500 leading-relaxed px-4">
                                        Mở App ngân hàng quét mã QR để thanh toán tự động
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Manual Info */}
                            <div className="p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Chi tiết chuyển khoản</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Bank & Account Group */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase mb-1 block">Ngân hàng</label>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{bankName}</p>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase mb-1 block">Tài khoản</label>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{accountNo}</p>
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="text-[11px] font-bold text-zinc-400 uppercase mb-1 block">Chủ tài khoản</label>
                                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{accountName}</p>
                                    </div>

                                    {/* Transfer Content - Highlighted */}
                                    <div className="pt-2">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">Nội dung (Quan trọng)</label>
                                                <button onClick={() => copyToClipboard(transferContent, 'content')} className="text-blue-600 dark:text-blue-400 text-[10px] font-bold hover:underline flex items-center gap-1">
                                                    {copiedField === 'content' ? 'Đã sao chép' : 'Sao chép'}
                                                </button>
                                            </div>
                                            <p className="font-bold text-blue-700 dark:text-blue-300 text-xl tracking-tight">{transferContent}</p>
                                        </div>
                                    </div>

                                    {/* Amount - Highlighted */}
                                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-end">
                                        <div className="text-left">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase block">Số tiền cần trả</label>
                                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                                {new Intl.NumberFormat('vi-VN').format(Number(order.amount))}₫
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase block">Mã đơn hàng</label>
                                            <p className="font-mono text-zinc-500 text-xs">{order.code}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicator - Tighter integration */}
                    <div className="mt-8">
                        <div className="relative flex items-center gap-4 p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/20">
                            <div className="relative flex h-3 w-3 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm">
                                    Đang chờ hệ thống xác nhận thanh toán...
                                </h4>
                                <p className="text-xs text-amber-800/70 dark:text-amber-500/60 mt-0.5">
                                    Tự động kích hoạt sau 10 - 60 giây. Vui lòng giữ trình duyệt mở.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Help Link - Minimal */}
                    <div className="mt-8 text-center">
                        <Link href="/contact" className="text-xs text-zinc-400 hover:text-primary transition-colors inline-flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            Hỗ trợ kỹ thuật 24/7
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
