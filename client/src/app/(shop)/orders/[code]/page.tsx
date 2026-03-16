'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {  ArrowLeft , Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { OrderInvoice } from '@/components/shop/OrderInvoice';
import { SectionBackground } from '@/components/info/SectionBackground';
import { SectionTag } from '@/components/SectionTag';

export default function OrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const { addToast } = useToast();
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res: any = await api.payments.getOrder(code);
                setOrder(res);
            } catch (error: any) {
                console.error('Failed to load order:', error);
                addToast(error.message || 'Không thể tải thông tin đơn hàng', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [code, addToast]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
                <p className="text-zinc-500 font-medium">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-24 pb-20 container flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h1>
                <p className="text-zinc-500 mb-8 max-w-md">Mã đơn hàng không tồn tại hoặc bạn không có quyền truy cập thông tin này.</p>
                <Link href="/orders">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Quay lại lịch sử
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pt-16 pb-20 overflow-hidden">
            <SectionBackground backgroundTheme="light" showDotPattern={true} />

            <div className="container max-w-5xl relative z-10">
                <div className="mb-10 space-y-4 print:hidden">
                    <div className="pt-4 pb-10 flex flex-col items-center justify-center text-center gap-6">
                        <div className="space-y-4">
                            <SectionTag className="mb-0">
                                {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                            </SectionTag>
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
                                    Chi tiết đơn hàng
                                </h1>
                            </div>
                            <p className="text-zinc-500 font-medium">
                                Mã đơn hàng: <span className="text-zinc-950 font-bold">{order.code}</span> • {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                <OrderInvoice
                    order={order}
                />
            </div>
        </div>
    );
}
