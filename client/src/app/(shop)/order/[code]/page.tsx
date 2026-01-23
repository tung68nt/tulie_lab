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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-6 bg-zinc-50/50">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: QR Code */}
                    <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 bg-zinc-50/30">
                        <div className="text-center mb-6">
                            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Thanh toán đơn hàng</h2>
                            <p className="font-mono text-zinc-400 text-xs px-2 py-0.5 bg-zinc-100/50 rounded inline-block">{order.code}</p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm mb-6">
                            <img src={qrUrl} alt="QR Code Payment" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-zinc-400 mb-1 uppercase tracking-wide">Số tiền cần thanh toán</p>
                            <p className="text-3xl font-semibold text-zinc-800 tracking-tight">
                                {new Intl.NumberFormat('vi-VN').format(Number(order.amount))}
                                <span className="text-lg text-zinc-500 ml-0.5 align-top">đ</span>
                            </p>
                        </div>
                    </div>

                    {/* Right: Info & Actions */}
                    <div className="p-8 flex flex-col justify-center">
                        <div className="mb-8">
                            <h3 className="text-base font-medium text-zinc-800 mb-6 flex items-center gap-2">
                                <Info className="w-4 h-4 text-zinc-400" />
                                Thông tin chuyển khoản
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { label: 'Ngân hàng', value: bankName, id: 'bank' },
                                    { label: 'Số tài khoản', value: accountNo, id: 'account', mono: true },
                                    { label: 'Chủ tài khoản', value: accountName, id: 'name' },
                                    { label: 'Nội dung', value: transferContent, id: 'content', mono: true, highlight: true },
                                ].map((item) => (
                                    <div key={item.id} className="group flex items-center justify-between text-sm">
                                        <span className="text-zinc-500 min-w-[100px] text-xs font-medium">{item.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-zinc-700 ${item.mono ? 'font-mono' : ''} ${item.highlight ? 'text-blue-600 font-medium' : ''}`}>
                                                {item.value}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(item.value, item.id)}
                                                className="text-zinc-300 hover:text-zinc-600 transition-colors p-1"
                                                title="Sao chép"
                                            >
                                                {copiedField === item.id ? (
                                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        );
}
