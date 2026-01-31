'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Info, CheckCircle2, Copy, Check, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { SectionBackground } from '@/components/info/SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

export default function OrderPage({ params }: { params: any }) {
    const router = useRouter();
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
        if (!code) return;

        const fetchData = async () => {
            try {
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
    }, [code, order?.status]);

    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center bg-white">
                <SectionBackground backgroundTheme="light" showDotPattern={true} />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-zinc-900 animate-spin" />
                    <p className="text-zinc-400 font-medium">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen relative flex items-center justify-center px-4 bg-white text-center">
                <SectionBackground backgroundTheme="light" showDotPattern={true} />
                <FadeIn direction="up" className="relative z-10 max-w-md w-full">
                    <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-8">
                        <Info className="w-10 h-10 text-zinc-300" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-zinc-900">Đơn hàng không tồn tại</h1>
                    <p className="text-zinc-500 mb-8 leading-relaxed text-lg">
                        Chúng tôi không tìm thấy thông tin cho mã đơn hàng này. Vui lòng kiểm tra lại.
                    </p>
                    <Link href="/courses">
                        <Button className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-zinc-100">
                            Quay lại danh sách khóa học
                        </Button>
                    </Link>
                </FadeIn>
            </div>
        );
    }

    // Success State
    if (order.status === 'PAID') {
        const hasCourses = order.items?.some((item: any) => item.course) || false;
        const hasProducts = order.items?.some((item: any) => item.product) || false;

        let description = 'Đơn hàng của bạn đã được xử lý thành công.';
        let buttonText = 'Vào học ngay';
        let buttonLink = '/my-learning';

        if (hasCourses && hasProducts) {
            description = 'Bạn đã mua thành công khóa học và sản phẩm.';
            buttonText = 'Bắt đầu ngay';
        } else if (hasCourses) {
            description = 'Bạn đã đăng ký thành công khóa học.';
            buttonText = 'Vào học ngay';
        } else if (hasProducts) {
            description = 'Bạn đã mua thành công sản phẩm.';
            buttonText = 'Xem sản phẩm';
            buttonLink = '/my-products';
        }

        return (
            <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-white">
                <SectionBackground backgroundTheme="light" showDotPattern={true} />
                <FadeIn direction="up">
                    <div className="max-w-md w-full relative z-10 text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center shadow-xl">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900">
                            Thanh toán thành công
                        </h1>
                        <p className="text-zinc-500 text-lg mb-10 leading-relaxed text-balance">
                            {description} Cảm ơn bạn đã tin tưởng và đồng hành cùng Tulie Lab.
                        </p>
                        <Button
                            size="lg"
                            className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-zinc-200"
                            onClick={() => router.push(buttonLink)}
                        >
                            {buttonText}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </FadeIn>
            </div>
        );
    }

    // Pending State Redesign - Clean, Modern, Minimalist
    const bankName = settings.bank_name || 'MB Bank';
    const accountNo = settings.bank_account_no || '0999999999';
    const accountName = settings.bank_account_name || 'NGUYEN VAN A';
    const syntax = settings.payment_transfer_syntax || '{{code}}';
    const transferContent = syntax.replace('{{code}}', order.code);
    const qrUrl = `https://qr.sepay.vn/img?acc=${accountNo}&bank=${bankName}&amount=${order.amount}&des=${transferContent}`;

    return (
        <div className="min-h-screen relative flex flex-col items-center pt-12 pb-20 px-4 overflow-hidden bg-white">
            <SectionBackground backgroundTheme="light" showDotPattern={true} />

            <div className="max-w-3xl w-full relative z-10 flex flex-col items-center">
                <FadeIn direction="up">
                    <div className="text-center space-y-4 mb-8">
                        <SectionTag variant="default" size="lg" showDot={true} animate={true}>
                            Chờ thanh toán
                        </SectionTag>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
                            Thanh toán đơn hàng
                        </h1>
                        <p className="text-zinc-500 text-base max-w-lg mx-auto">
                            Hoàn tất thanh toán để truy cập ngay các nội dung học tập và sản phẩm của bạn.
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-[680px] w-full">
                    <FadeIn direction="up" delay={0.2}>
                        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                                {/* Left Side: QR Code */}
                                <div className="p-6 flex flex-col items-center justify-center bg-zinc-50/50 border-b md:border-b-0 md:border-r border-zinc-100">
                                    <p className="text-xs text-zinc-400 font-medium mb-4">Quét mã QR</p>
                                    <div className="bg-white p-2 rounded-xl border border-zinc-100 w-full max-w-[180px]">
                                        <img src={qrUrl} alt="QR Code" className="w-full h-auto object-contain" />
                                    </div>
                                    <p className="text-[11px] text-zinc-400 mt-4 text-center leading-relaxed">
                                        Mở ứng dụng ngân hàng và quét mã để thanh toán tự động
                                    </p>
                                </div>

                                {/* Right Side: Manual Info */}
                                <div className="p-6 space-y-5">
                                    {/* Bank Info - Compact Single Block */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-zinc-400" />
                                            <span className="text-xs font-medium text-zinc-400">Chuyển khoản thủ công</span>
                                        </div>
                                        <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">Ngân hàng</span>
                                                <span className="text-sm font-medium text-zinc-900">{bankName}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">Số tài khoản</span>
                                                <span className="text-sm font-semibold text-zinc-900 font-mono">{accountNo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">Chủ tài khoản</span>
                                                <span className="text-sm font-medium text-zinc-900">{accountName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transfer Content */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-medium text-zinc-400">Nội dung chuyển khoản</span>
                                        <div
                                            onClick={() => copyToClipboard(transferContent, 'content')}
                                            className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-center relative cursor-pointer hover:border-zinc-400 transition-all group/content active:scale-[0.99]"
                                        >
                                            <p className="text-base font-mono font-semibold text-zinc-900 tracking-wide">
                                                {transferContent}
                                            </p>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {copiedField === 'content'
                                                    ? <Check className="w-4 h-4 text-green-500" />
                                                    : <Copy className="w-3.5 h-3.5 text-zinc-300 group-hover/content:text-zinc-500 transition-colors" />
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount - Redesigned Clean Box */}
                                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-xl p-4 text-center">
                                        <p className="text-xs text-zinc-400 mb-1">Số tiền thanh toán</p>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl font-semibold tracking-tight">
                                                {new Intl.NumberFormat('vi-VN').format(Number(order.amount))}
                                            </span>
                                            <span className="text-lg text-zinc-400">₫</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 mt-1">Hệ thống tự động xác nhận</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Status Indicator */}
                    <FadeIn direction="up" delay={0.4}>
                        <div className="mt-6 flex items-center justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100">
                                <div className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-600"></span>
                                </div>
                                <p className="text-xs text-zinc-600 font-medium">
                                    {isChecking ? 'Đang kiểm tra...' : 'Đang chờ xác nhận'}
                                </p>
                                <span className="text-zinc-300">·</span>
                                <p className="text-xs text-zinc-400">Tự động chuyển trang sau khi nhận</p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.6}>
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => router.push('/contact')}
                                className="text-xs text-zinc-400 hover:text-zinc-600 font-medium inline-flex items-center gap-1.5 transition-colors"
                            >
                                <Info className="w-3.5 h-3.5" />
                                Cần hỗ trợ? Liên hệ 24/7
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
