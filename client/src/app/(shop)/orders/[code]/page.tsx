'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { OrderInvoice } from '@/components/shop/OrderInvoice';

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
                <div className="w-12 h-12 border-4 border-zinc-950 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 font-medium">Đang tải hóa đơn...</p>
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
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 pt-24 pb-20">
            <div className="container max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/orders" className="flex items-center gap-2 group print:hidden">
                        <div className="p-2 rounded-full border border-zinc-200 group-hover:bg-zinc-100 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">Quay lại lịch sử</span>
                    </Link>
                </div>

                <OrderInvoice
                    order={order}
                />
            </div>
        </div>
    );
}
