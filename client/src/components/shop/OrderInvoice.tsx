'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Download, Mail, Globe, MapPin, FileText, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
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
    const { addToast } = useToast();
    const [footerData, setFooterData] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState(false);
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

        if (!invoiceRef.current || isDownloading) return;

        setIsDownloading(true);

        // Mitigation for html2canvas oklch parsing error:
        // Identify and replace oklch functions during capture.
        const styleId = 'pdf-oklch-mitigation';

        // Safety timeout to ensure UI is unblocked
        const safetyTimeout = setTimeout(() => {
            if (isDownloading) {
                console.warn('PDF generation taking too long, forcing cleanup');
                document.body.classList.remove('pdf-capture-mode');
                setIsDownloading(false);
            }
        }, 30000); // 30s safety net

        try {
            // 1. Add style mitigation
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                // Force basic colors for potential problem areas during capture
                styleEl.innerHTML = `
                    .pdf-capture-mode * {
                        /* Force standard color formats if needed */
                        outline-color: transparent !important;
                        text-decoration-color: currentColor !important;
                    }
                `;
                document.head.appendChild(styleEl);
            }

            // Dynamic import wrapper for robustness
            const html2pdfModule: any = await import('html2pdf.js');
            const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

            if (!html2pdf || typeof html2pdf !== 'function') {
                throw new Error('Could not initialize PDF library');
            }

            const element = invoiceRef.current;
            document.body.classList.add('pdf-capture-mode');

            // Force a small delay to ensure styles are applied
            await new Promise(resolve => setTimeout(resolve, 100));

            const opt: any = {
                margin: [10, 10, 10, 10],
                filename: `TulieLab_DH_${order.code.toUpperCase()}.pdf`,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    windowWidth: 1024,
                    scrollY: 0,
                    scrollX: 0,
                    onclone: (clonedDoc: Document) => {
                        // 1. Remove problem styles from cloned documents
                        const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                        styles.forEach(s => {
                            if (s.textContent && s.textContent.includes('oklch')) {
                                s.textContent = s.textContent.replace(/oklch\([^)]+\)/g, '#000');
                            }
                        });

                        // 2. Check for elements that might cause issues in the clone
                        const allElements = clonedDoc.querySelectorAll('*');
                        allElements.forEach((el: any) => {
                            if (el.style) {
                                // Aggressive string replacement on common color props
                                ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
                                    const val = el.style[prop];
                                    if (val && val.includes('oklch')) {
                                        el.style[prop] = prop === 'backgroundColor' ? '#ffffff' : '#000000';
                                    }
                                });
                            }
                        });
                    },
                    ignoreElements: (el: any) => {
                        return el.classList.contains('no-pdf') ||
                            el.classList.contains('no-print') ||
                            el.tagName === 'NAV' ||
                            el.tagName === 'HEADER' ||
                            el.tagName === 'FOOTER';
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Trigger generation
            await html2pdf().set(opt).from(element).save();

            addToast('Đã tải xuống đơn hàng PDF thành công', 'success');
        } catch (error: any) {
            console.error('PDF Download Error Detail:', error);
            addToast(`Không thể tạo file PDF: ${error.message || 'Lỗi xử lý màu sắc (oklch)'}`, 'error');
        } finally {
            clearTimeout(safetyTimeout);
            document.body.classList.remove('pdf-capture-mode');
            const styleEl = document.getElementById(styleId);
            if (styleEl) styleEl.remove();
            setIsDownloading(false);
        }
    };

    // Accounting Calculations (VAT 10%)
    const totalPayment = order.amount;
    const subtotalBeforeVat = Math.round(totalPayment / 1.1);
    const vatAmount = totalPayment - subtotalBeforeVat;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans print:p-0 print:m-0 print:max-w-none">
            {/* Action Bar - Hidden during print */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden px-4 md:px-0 no-pdf">
                <Link href="/orders">
                    <Button variant="outline" className="gap-2 border-zinc-200 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold">Quay lại lịch sử</span>
                    </Button>
                </Link>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="gap-2 min-w-[120px]"
                    >
                        {isDownloading ? (
                            <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {isDownloading ? 'Đang tải...' : 'Tải PDF'}
                    </Button>
                    <Button onClick={handlePrint} className="gap-2 bg-zinc-950 text-white hover:bg-zinc-800">
                        <Printer className="w-4 h-4" />
                        In đơn hàng
                    </Button>
                </div>
            </div>

            {/* Invoice Container */}
            <div ref={invoiceRef} className="print:w-[210mm] print:min-h-[297mm] print:bg-white mx-auto relative group/invoice">
                <Card className="border border-zinc-100 shadow-xl print:shadow-none overflow-hidden bg-white text-zinc-950 rounded-xl relative z-10">
                    <CardContent className="pt-16 md:pt-20 pb-12 px-8 md:p-12 space-y-12 print:p-12 relative overflow-hidden invoice-pdf-container">
                        {/* Header Area */}
                        <div className="relative z-10 border-b border-zinc-100 pb-12 text-zinc-950 space-y-8">
                            {/* Logo Row */}
                            <div className="flex justify-between items-center">
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
                                <h1 className="text-3xl md:text-4xl print:text-4xl font-bold leading-none">Đơn Hàng</h1>
                            </div>

                            {/* Info Row: Company Name & Order Code */}
                            <div className="flex flex-col md:flex-row print:flex-row justify-between items-center gap-4 text-sm">
                                <div className="font-bold text-zinc-900 text-base md:text-lg">{footerData?.companyName}</div>
                                <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                                    <span className="text-zinc-600">Mã đơn hàng:</span>
                                    <span className="font-bold text-zinc-950">{order.code}</span>
                                </div>
                            </div>

                            {/* Detailed Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 text-[13px]">
                                <div className="space-y-1.5 text-zinc-500">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{footerData?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> MST: {footerData?.taxId}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {footerData?.email || 'support@tulielab.vn'}</div>
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Hotline: {settings.contact_hotline || footerData?.hotline || '0336.883.242'}</div>
                                </div>
                                <div className="space-y-2 md:text-right print:text-right flex flex-col items-start md:items-end">
                                    <div className="text-sm">
                                        <span className="text-zinc-600">Ngày tạo:</span>
                                        <span className="font-medium ml-2">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold
                                            ${order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}
                                        `}>
                                            {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Info Grid */}
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-600">Thông tin khách hàng</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Họ tên người mua:</span>
                                        <span className="font-bold">{order.metadata?.vatBuyerName || order.metadata?.customerName || order.user.profile?.name || order.user.name || ''}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Số điện thoại:</span>
                                        <span className="font-bold">{order.metadata?.vatPhone || order.metadata?.phone || order.user.profile?.phone || ''}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Email:</span>
                                        <span className="font-bold">{order.metadata?.vatEmail || order.metadata?.email || order.user.email || ''}</span>
                                    </div>
                                    {order.metadata?.taxId && (
                                        <div className="flex gap-2">
                                            <span className="text-zinc-600 w-44 shrink-0">Mã số thuế:</span>
                                            <span className="font-bold">{order.metadata?.taxId}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <span className="text-zinc-600 w-44 shrink-0">Địa chỉ:</span>
                                        <span className="font-bold text-zinc-600">{order.metadata?.address || order.user.profile?.address || ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 md:text-right">
                                <h3 className="text-sm font-bold text-zinc-600">Thông tin thanh toán</h3>
                                <div className="space-y-2 text-sm md:text-right">
                                    <div className="flex justify-start md:justify-end gap-2">
                                        <span className="text-zinc-600 shrink-0">Hình thức:</span>
                                        <span className="font-bold">Chuyển khoản</span>
                                    </div>
                                    {order.metadata?.isGift && (
                                        <div className="flex justify-start md:justify-end gap-2">
                                            <span className="text-zinc-600 shrink-0">Ghi chú:</span>
                                            <span className="font-bold text-red-600">Mua làm quà tặng</span>
                                        </div>
                                    )}
                                    {order.metadata?.requireVAT && (
                                        <div className="flex justify-start md:justify-end gap-2">
                                            <span className="text-zinc-600 shrink-0">Đơn hàng:</span>
                                            <span className="font-bold text-zinc-900 underline">Đã đăng ký VAT</span>
                                        </div>
                                    )}
                                    <div className="flex justify-start md:justify-end gap-2">
                                        <span className="text-zinc-600 shrink-0">Tài khoản:</span>
                                        <span className="font-bold">{order.metadata?.createAccount ? 'Tạo mới' : 'Đã có tài khoản'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="relative z-10 space-y-4">
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
                                                        {item.course?.title || item.product?.title || 'Dịch vụ'}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 mt-1 uppercase font-medium tracking-wider">
                                                        {item.course ? 'Khóa học trực tuyến' : 'Sản phẩm số'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-zinc-900">
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
                                            <td className="px-6 py-6 text-right text-2xl font-bold">{formatCurrency(totalPayment)}</td>
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
                            <div className="relative z-10 space-y-4 pt-4 border-t border-zinc-100">
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
                                                        <td className="px-6 py-4 text-zinc-500">{formatDate(tx.createdAt)}</td>
                                                        <td className="px-6 py-4 font-bold">{tx.bankName || tx.paymentMethod || 'Chuyển khoản'}</td>
                                                        <td className="px-6 py-4 font-mono text-zinc-400 text-xs">{tx.referenceCode || tx.id}</td>
                                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(tx.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-zinc-400 py-4 px-6 bg-zinc-50/50 rounded-lg border border-dashed text-center">
                                        Đã thanh toán (Dữ liệu giao dịch đang được đồng bộ...)
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="relative z-10 pt-8 border-t border-zinc-100 flex justify-between items-end opacity-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-400">Hệ sinh thái Tulie TSS</p>
                                <p className="text-xs font-medium text-zinc-500">tulie.vn</p>
                            </div>
                            <div className="text-right">
                                <FileText className="w-8 h-8 text-zinc-200 ml-auto" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Print Only Styles & PDF compatibility fix */}
            <style jsx global>{`
                /* PDF Mitigation: html2canvas fails on oklch. Force standard colors for the print container */
                .invoice-pdf-container {
                    /* Override standard Tailwind variables that might resolve to oklch */
                    --background: 0 0% 100% !important;
                    --foreground: 0 0% 0% !important;
                    --primary: 0 0% 0% !important;
                    --muted: 0 0% 96% !important;
                    --muted-foreground: 0 0% 40% !important;
                }

                @media print {
                    @page { 
                        margin: 0; 
                        size: A4;
                    }
                    body { 
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    nav, header, footer, .no-print, .print-hidden, [role="navigation"], .no-pdf { 
                        display: none !important; 
                    }
                    .max-w-4xl { 
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .shadow-xl { box-shadow: none !important; }
                    .Card { border: none !important; }
                }

                .pdf-capture-mode nav, 
                .pdf-capture-mode footer,
                .pdf-capture-mode header {
                    display: none !important;
                }
            `}</style>
        </div>
    );
};
