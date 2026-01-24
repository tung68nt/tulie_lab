'use client';

import React from 'react';
import { Package, User, Printer, Download, CreditCard, Calendar, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';

interface InvoiceProps {
    order: {
        id: string;
        code: string;
        amount: number;
        status: string;
        createdAt: string;
        user: {
            id: string;
            email: string;
            name?: string;
            profile?: {
                name?: string;
                phone?: string;
                address?: string;
            };
        };
        items: {
            id: string;
            price: number;
            course?: { id: string; title: string };
            product?: { id: string; title: string };
        }[];
        transactions?: {
            id: string;
            amount: number;
            bankName?: string;
            status: string;
            createdAt: string;
        }[];
    };
    onDownload?: () => void;
    onPrint?: () => void;
}

export const OrderInvoice = ({ order, onDownload, onPrint }: InvoiceProps) => {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const formatDate = (str: string) =>
        new Date(str).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Action Bar - Hidden during print */}
            <div className="flex justify-end gap-3 print:hidden">
                <Button variant="outline" onClick={onDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    Tải PDF
                </Button>
                <Button onClick={handlePrint} className="gap-2 bg-zinc-950 text-white hover:bg-zinc-800">
                    <Printer className="w-4 h-4" />
                    In hóa đơn
                </Button>
            </div>

            {/* Invoice Container */}
            <Card className="border-none shadow-2xl print:shadow-none overflow-hidden bg-white text-zinc-950">
                <CardContent className="p-8 md:p-12 space-y-12">
                    {/* Header: Company & Invoice Info */}
                    <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-zinc-100 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-zinc-950 rounded flex items-center justify-center text-white font-bold text-xl">T</div>
                                <span className="text-2xl font-bold tracking-tight">tulie.\lab</span>
                            </div>
                            <div className="text-sm text-zinc-500 space-y-1">
                                <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> academy.tulie.vn</div>
                                <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> contact@tulie.vn</div>
                                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Hà Nội, Việt Nam</div>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter">HÓA ĐƠN</h1>
                            <div className="text-sm">
                                <span className="text-zinc-500">Mã đơn:</span>
                                <span className="font-mono font-bold border-b-2 border-zinc-950 ml-2">{order.code}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-zinc-500">Ngày tạo:</span>
                                <span className="font-medium ml-2">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="mt-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
                                    ${order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}
                                `}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Thông tin khách hàng</h3>
                            <div className="space-y-2">
                                <div className="font-bold text-lg">{order.user.profile?.name || order.user.name || 'Khách hàng'}</div>
                                <div className="text-sm text-zinc-600 flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> {order.user.email}
                                </div>
                                {order.user.profile?.phone && (
                                    <div className="text-sm text-zinc-600 flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5" /> {order.user.profile.phone}
                                    </div>
                                )}
                                {order.user.profile?.address && (
                                    <div className="text-sm text-zinc-600 flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5" /> <span>{order.user.profile.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4 md:text-right">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Hình thức thanh toán</h3>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Chuyển khoản Ngân hàng (Auto QR)</div>
                                <div className="text-xs text-zinc-500">Nội dung: {order.code}</div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Chi tiết dịch vụ</h3>
                        <div className="overflow-x-auto rounded-xl border border-zinc-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-100">
                                        <th className="px-6 py-4 text-left font-bold w-16">#</th>
                                        <th className="px-6 py-4 text-left font-bold">Mô tả</th>
                                        <th className="px-6 py-4 text-left font-bold w-32">Loại</th>
                                        <th className="px-6 py-4 text-right font-bold w-40">Đơn giá</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-zinc-400">{index + 1}</td>
                                            <td className="px-6 py-4 font-bold">
                                                {item.course?.title || item.product?.title || 'Unknown Item'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded font-medium">
                                                    {item.course ? 'KHÓA HỌC' : 'SẢN PHẨM SỐ'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-bold">
                                                {formatCurrency(item.price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-zinc-900 border-dashed">
                                        <td colSpan={3} className="px-6 py-6 text-right font-bold text-lg">Tổng giá trị đơn hàng:</td>
                                        <td className="px-6 py-6 text-right text-2xl font-black font-mono">{formatCurrency(order.amount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="border-t border-zinc-100 pt-12 text-center space-y-4">
                        <p className="text-zinc-400 text-sm max-w-md mx-auto italic">
                            Cảm ơn bạn đã lựa chọn Tulie Academy. <br /> Hóa đơn trực tuyến có giá trị xác nhận quyền sở hữu dịch vụ/sản phẩm số vĩnh viễn trên hệ thống của chúng tôi.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-tighter text-zinc-300">
                            <span>Automation</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-200" />
                            <span>Vibe Coding</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-200" />
                            <span>Premium Quality</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Print Only Styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 20mm; }
                    body { background: white !important; }
                    .print-hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
};
