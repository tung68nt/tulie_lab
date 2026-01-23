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

    if (loading) return <div className="min-h-screen pt-24 text-center">Đang tải thông tin đơn hàng...</div>;

    if (!order) return (
        <div className="min-h-screen pt-24 container text-center">
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
            <div className="min-h-screen pt-24 container">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-8 shadow-lg text-center">
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
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container max-w-5xl">
                {/* Header Section */}
                <div className="mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-3">
                        <CreditCard className="w-3.5 h-3.5" />
                        Chờ thanh toán
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Thanh toán đơn hàng</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Thực hiện chuyển khoản theo thông tin dưới đây để kích hoạt khóa học.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT: QR Code Card */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden sticky top-32">
                            <div className="p-6 bg-zinc-50/50 border-b border-zinc-100 text-center">
                                <p className="text-sm font-medium text-zinc-500 mb-1 uppercase tracking-wider">Mã đơn hàng</p>
                                <p className="text-xl font-bold text-zinc-900">{order.code}</p>
                            </div>

                            <div className="p-8 flex flex-col items-center">
                                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-6 w-full max-w-[280px]">
                                    <img src={qrUrl} alt="QR Code Payment" className="w-full h-auto object-contain" />
                                </div>
                                <p className="text-center text-sm text-zinc-500">
                                    Mở App ngân hàng quét mã QR code để nhập nhanh thông tin
                                </p>
                            </div>

                            <div className="p-6 bg-blue-50/50 border-t border-blue-100 text-center">
                                <p className="text-sm font-medium text-blue-600 mb-1">Tổng thanh toán</p>
                                <p className="text-3xl font-bold text-blue-700">
                                    {new Intl.NumberFormat('vi-VN').format(Number(order.amount))}
                                    <span className="text-xl ml-1 align-top">đ</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Manual Transfer Info */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-zinc-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900">Thông tin thủ công</h3>
                                    <p className="text-sm text-muted-foreground">Nhập chính xác nội dung chuyển khoản</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Bank */}
                                <div className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-medium text-zinc-500">Ngân hàng</label>
                                        <button onClick={() => copyToClipboard(bankName, 'bank')} className="text-blue-600 text-xs font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            {copiedField === 'bank' ? 'Đã sao chép' : 'Sao chép'}
                                        </button>
                                    </div>
                                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                                        <p className="font-bold text-zinc-900 border-none bg-transparent w-full text-lg">{bankName}</p>
                                    </div>
                                </div>

                                {/* Account No */}
                                <div className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-medium text-zinc-500">Số tài khoản</label>
                                        <button onClick={() => copyToClipboard(accountNo, 'account')} className="text-blue-600 text-xs font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            {copiedField === 'account' ? 'Đã sao chép' : 'Sao chép'}
                                        </button>
                                    </div>
                                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex items-center justify-between">
                                        <p className="font-bold text-zinc-900 text-xl tracking-tight">{accountNo}</p>
                                        <button onClick={() => copyToClipboard(accountNo, 'account')} className="text-zinc-400 hover:text-zinc-600">
                                            {copiedField === 'account' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Owner Name */}
                                <div className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-medium text-zinc-500">Chủ tài khoản</label>
                                    </div>
                                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                                        <p className="font-bold text-zinc-900 text-lg uppercase">{accountName}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="group pt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-medium text-blue-600">Nội dung chuyển khoản (Quan trọng)</label>
                                        <button onClick={() => copyToClipboard(transferContent, 'content')} className="text-blue-600 text-xs font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            {copiedField === 'content' ? 'Đã sao chép' : 'Sao chép'}
                                        </button>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center justify-between ring-2 ring-blue-100 ring-offset-2">
                                        <p className="font-black text-blue-700 text-xl">{transferContent}</p>
                                        <button onClick={() => copyToClipboard(transferContent, 'content')} className="text-blue-400 hover:text-blue-600">
                                            {copiedField === 'content' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                                        <Info className="w-3.5 h-3.5" />
                                        Nhập chính xác nội dung này để hệ thống tự động kích hoạt.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-4 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                            <div className="relative flex h-3 w-3 mt-1.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-yellow-800 text-sm">Hệ thống đang chờ nhận tiền...</h4>
                                <p className="text-sm text-yellow-700 mt-0.5">
                                    Trạng thái đơn hàng sẽ tự động cập nhật sau mỗi 5 giây. Không cần refresh trang.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
