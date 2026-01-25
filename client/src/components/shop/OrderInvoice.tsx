'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Download, Mail, Globe, MapPin, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useSettings } from '@/contexts/SettingsContext';
import { api } from '@/lib/api';

interface InvoiceProps {
    order: {
        id: string;
        code: string;
        amount: number;
        status: string;
        createdAt: string;
        metadata?: any;
        user: {
            id: string;
            email: string;
            name?: string;
            profile?: {
                id?: string;
                name?: string;
                phone?: string;
                address?: string;
                company?: string;
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
            referenceCode?: string;
            paymentMethod?: string;
        }[];
    };
    onDownload?: () => void;
    onPrint?: () => void;
}

const toVietnameseWords = (amount: number): string => {
    if (amount === 0) return 'Không đồng./.';
    if (amount < 0) return 'Số tiền âm./.';

    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    const readGroup = (group: number, isFirst: boolean): string => {
        if (group === 0) return '';

        let res = '';
        const h = Math.floor(group / 100);
        const t = Math.floor((group % 100) / 10);
        const u = group % 10;

        if (h > 0 || !isFirst) {
            res += digits[h] + ' trăm ';
        }

        if (t === 0 && u > 0) {
            if (!isFirst || h > 0) res += 'lẻ ' + digits[u];
            else res += digits[u];
        } else if (t === 1) {
            res += 'mười ';
            if (u === 5) res += 'lăm';
            else if (u > 0) res += digits[u];
        } else if (t > 1) {
            res += digits[t] + ' mươi ';
            if (u === 1) res += 'mốt';
            else if (u === 5) res += 'lăm';
            else if (u > 0) res += digits[u];
        }

        return res.trim();
    };

    let result = '';
    const groups: number[] = [];
    let temp = amount;

    while (temp > 0) {
        groups.push(temp % 1000);
        temp = Math.floor(temp / 1000);
    }

    const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

    let firstNonZero = true;
    for (let i = groups.length - 1; i >= 0; i--) {
        const groupStr = readGroup(groups[i], firstNonZero);
        if (groupStr !== '') {
            result += groupStr + units[i] + ' ';
            firstNonZero = false;
        }
    }

    result = result.trim();
    if (!result) return 'Không đồng./.';
    return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng./.';
};

export const OrderInvoice = ({ order, onDownload, onPrint }: InvoiceProps) => {
    const { settings } = useSettings();
    const [footerData, setFooterData] = useState<any>(null);
    const invoiceRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadFooterData = async () => {
            try {
                const cms = await api.cms.get(['footer_settings']) as any;
                if (cms && cms.footer_settings) {
                    setFooterData(JSON.parse(cms.footer_settings));
                }
            } catch (e) { }
        };
        loadFooterData();
    }, []);

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

    const handleDownload = async () => {
        if (onDownload) {
            onDownload();
            return;
        }

        if (!invoiceRef.current) return;

        try {
            // Use dynamic import for html2pdf
            const html2pdf = (await import('html2pdf.js')).default;

            const element = invoiceRef.current;
            const opt = {
                margin: 0,
                filename: `Don-hang-${order.code}.pdf`,
                image: { type: 'jpeg' as const, quality: 1.0 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    windowWidth: 1200 // Force desktop width for capture
                },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF Download Error:', error);
        }
    };

    // Accounting Calculations (VAT 10%)
    const totalPayment = order.amount;
    const subtotalBeforeVat = Math.round(totalPayment / 1.1);
    const vatAmount = totalPayment - subtotalBeforeVat;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans print:p-0 print:m-0">
            {/* Action Bar - Hidden during print */}
            <div className="flex justify-end gap-3 print:hidden px-4 md:px-0">
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    Tải PDF
                </Button>
                <Button onClick={handlePrint} className="gap-2 bg-zinc-950 text-white hover:bg-zinc-800">
                    <Printer className="w-4 h-4" />
                    In hóa đơn
                </Button>
            </div>

            {/* Invoice Container */}
            <div ref={invoiceRef} className="print:w-[210mm] print:min-h-[297mm] print:bg-white mx-auto">
                <Card className="border-none shadow-2xl print:shadow-none overflow-hidden bg-white text-zinc-950 rounded-none md:rounded-xl">
                    <CardContent className="pt-16 md:pt-20 pb-12 px-8 md:p-12 space-y-12 print:p-12">
                        {/* Header: Company & Invoice Info */}
                        <div className="flex flex-col md:flex-row print:flex-row justify-between items-start gap-8 border-b border-zinc-100 pb-12 text-zinc-950">
                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-2.5">
                                    {settings.site_logo ? (
                                        <img src={settings.site_logo} alt="Logo" className="h-10 w-auto object-contain" />
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-zinc-950 rounded flex items-center justify-center text-white font-bold text-xl">T</div>
                                            <span className="text-2xl font-bold tracking-tight">tulie.\lab</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-[13px] text-zinc-500 leading-relaxed max-w-sm space-y-1">
                                    <div className="font-extrabold text-zinc-950 text-base mb-2 uppercase">{footerData?.companyName}</div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>
                                            {footerData?.address?.includes('Thành phố Hà Nội') ? (
                                                <>
                                                    {footerData.address.split('Thành phố Hà Nội')[0].trim()}
                                                    <br />
                                                    Thành phố Hà Nội{footerData.address.split('Thành phố Hà Nội')[1]}
                                                </>
                                            ) : footerData?.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> MST: {footerData?.taxId}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {footerData?.email || 'support@tulielab.vn'}</div>
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Hotline: {footerData?.hotline || '0336.883.242'}</div>
                                </div>
                            </div>
                            <div className="text-left md:text-right print:text-right space-y-2">
                                <h1 className="text-3xl md:text-4xl print:text-4xl font-bold uppercase">ĐƠN HÀNG</h1>
                                <div className="text-sm">
                                    <span className="text-zinc-600">Mã đơn hàng:</span>
                                    <span className="font-bold ml-2 text-base">{order.code}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-zinc-600">Ngày tạo:</span>
                                    <span className="font-medium ml-2">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="mt-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold
                                        ${order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}
                                    `}>
                                        {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-600">Thông tin khách hàng</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Họ tên người mua hàng:</span>
                                        <span className="font-bold">{order.metadata?.customerName || order.user.profile?.name || order.user.name || ''}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Tên đơn vị:</span>
                                        <span className="font-bold">{order.metadata?.companyName || order.user.profile?.company || ''}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Mã số thuế:</span>
                                        <span className="font-bold">{order.metadata?.taxId || ''}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Địa chỉ:</span>
                                        <span className="font-bold">{order.metadata?.address || order.user.profile?.address || ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 md:text-right">
                                <h3 className="text-sm font-bold text-zinc-600">Hình thức thanh toán</h3>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Chuyển khoản Ngân hàng (Auto QR)</div>
                                    <div className="text-xs text-zinc-600">Nội dung: {order.code}</div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-600">Chi tiết dịch vụ</h3>
                            <div className="overflow-x-auto rounded-xl border border-zinc-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-100">
                                            <th className="px-6 py-4 text-left font-bold">Mô tả</th>
                                            <th className="px-6 py-4 text-right font-bold w-40">Tổng cộng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {order.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-zinc-900">
                                                        {item.course?.title || item.product?.title || 'Unknown Item'}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 mt-1 uppercase">
                                                        {item.course ? 'KHÓA HỌC TRỰC TUYẾN' : 'SẢN PHẨM SỐ / TEMPLATE'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold">
                                                    {formatCurrency(item.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-zinc-50/50">
                                        <tr className="border-t border-zinc-100">
                                            <td className="px-6 py-3 text-right text-zinc-600">Thành tiền:</td>
                                            <td className="px-6 py-3 text-right font-medium">{formatCurrency(subtotalBeforeVat)}</td>
                                        </tr>
                                        <tr className="">
                                            <td className="px-6 py-3 text-right text-zinc-600">Thuế suất GTGT (VAT) 10%:</td>
                                            <td className="px-6 py-3 text-right font-medium">{formatCurrency(vatAmount)}</td>
                                        </tr>
                                        <tr className="border-t border-zinc-900 border-dashed">
                                            <td className="px-6 py-6 text-right font-bold text-lg">Tổng số tiền thanh toán:</td>
                                            <td className="px-6 py-6 text-right text-2xl font-black">{formatCurrency(totalPayment)}</td>
                                        </tr>
                                        <tr className="border-t border-zinc-100">
                                            <td colSpan={2} className="px-6 py-4 text-right">
                                                <span className="text-xs text-zinc-600 mr-2">Số tiền viết bằng chữ:</span>
                                                <span className="font-bold">{toVietnameseWords(totalPayment)}</span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Transaction History Section */}
                        {(order.status === 'PAID' || order.status === 'COMPLETED') && (
                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <h3 className="text-sm font-bold text-zinc-600">Chi tiết giao dịch</h3>
                                {order.transactions && order.transactions.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl border border-zinc-100">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-zinc-50 border-b border-zinc-100">
                                                    <th className="px-6 py-3 text-left font-bold text-xs text-zinc-600">Ngày giao dịch</th>
                                                    <th className="px-6 py-3 text-left font-bold text-xs text-zinc-600">Cổng</th>
                                                    <th className="px-6 py-3 text-left font-bold text-xs text-zinc-600">ID giao dịch</th>
                                                    <th className="px-6 py-3 text-right font-bold text-xs text-zinc-600">Số tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-50">
                                                {order.transactions.map((tx, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-6 py-4 text-zinc-600">{formatDate(tx.createdAt)}</td>
                                                        <td className="px-6 py-4 font-medium">{tx.bankName || tx.paymentMethod || 'Chuyển khoản ngân hàng'}</td>
                                                        <td className="px-6 py-4 font-mono text-zinc-500 text-xs">{tx.referenceCode || tx.id}</td>
                                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(tx.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-sm text-zinc-600 py-4 px-6 bg-zinc-50 rounded-lg border border-dashed text-center">
                                        Đã thanh toán (Dữ liệu giao dịch đang được đồng bộ...)
                                    </div>
                                )}
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>

            {/* Print Only Styles */}
            <style jsx global>{`
                @media print {
                    @page { margin: 15mm; }
                    body { background: white !important; }
                    .print-hidden { display: none !important; }
                    .shadow-2xl { box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
};
