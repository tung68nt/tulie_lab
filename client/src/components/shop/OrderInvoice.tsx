'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Download, Mail, Globe, MapPin, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
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
                    }
                `;
                document.head.appendChild(styleEl);
            }

            // Dynamic import wrapper for robustness
            const html2pdfModule: any = await import('html2pdf.js');
            const html2pdf = html2pdfModule.default || html2pdfModule;

            if (!html2pdf || typeof html2pdf !== 'function') {
                throw new Error('Could not initialize PDF library');
            }

            const element = invoiceRef.current;
            document.body.classList.add('pdf-capture-mode');

            const opt: any = {
                margin: [10, 10, 10, 10],
                filename: `Don-hang-${order.code}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    windowWidth: 1024,
                    scrollY: 0,
                    scrollX: 0,
                    // Try to catch errors early
                    onclone: (clonedDoc: Document) => {
                        // Check for elements that might cause issues in the clone
                        const allElements = clonedDoc.querySelectorAll('*');
                        allElements.forEach((el: any) => {
                            // html2canvas crashes on oklch. We can't easily detect it in computed style without a parser,
                            // but we can ensure common color variables are safe.
                            if (el.style) {
                                // Simplified approach: just ensure no complex filters/colors that are known to fail
                                if (el.style.color && el.style.color.includes('oklch')) el.style.color = '#000';
                                if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) el.style.backgroundColor = '#fff';
                                if (el.style.borderColor && el.style.borderColor.includes('oklch')) el.style.borderColor = '#ddd';
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

            // Capture and save
            await html2pdf().set(opt).from(element).save();

            addToast('Đã tải xuống hóa đơn PDF thành công', 'success');
        } catch (error: any) {
            console.error('PDF Download Error Detail:', error);
            addToast(`Không thể tạo file PDF: ${error.message || 'Lỗi xử lý màu sắc (oklch)'}`, 'error');
        } finally {
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
            <div className="flex justify-end gap-3 print:hidden px-4 md:px-0 no-pdf">
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="gap-2 min-w-[120px] bg-white border-zinc-200 text-zinc-950 hover:bg-zinc-50"
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
                    In hóa đơn
                </Button>
            </div>

            {/* Invoice Container */}
            <div ref={invoiceRef} className="print:w-[210mm] print:min-h-[297mm] print:bg-white mx-auto relative group/invoice">
                {/* Decorative dots in 4 corners for the layout background - visible only in UI, not necessarily in PDF if captured strictly */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-dot-grid-light opacity-40 pointer-events-none -translate-x-4 -translate-y-4 print:hidden" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-dot-grid-light opacity-40 pointer-events-none translate-x-4 -translate-y-4 print:hidden" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-dot-grid-light opacity-40 pointer-events-none -translate-x-4 translate-y-4 print:hidden" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-dot-grid-light opacity-40 pointer-events-none translate-x-4 translate-y-4 print:hidden" />

                <Card className="border border-zinc-100 shadow-xl print:shadow-none overflow-hidden bg-white text-zinc-950 rounded-xl relative z-10">
                    <CardContent className="pt-16 md:pt-20 pb-12 px-8 md:p-12 space-y-12 print:p-12 relative overflow-hidden">
                        {/* Background dots for the invoice card content itself to match heading style */}
                        <div className="absolute inset-0 bg-dot-grid-light opacity-[0.03] pointer-events-none" />

                        {/* Header: Company & Invoice Info */}
                        <div className="relative z-10 flex flex-col md:flex-row print:flex-row justify-between items-start gap-8 border-b border-zinc-100 pb-12 text-zinc-950">
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
                                    <div className="font-extrabold text-zinc-950 text-base mb-2 whitespace-nowrap uppercase tracking-wider">{footerData?.companyName}</div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>{footerData?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> MST: {footerData?.taxId}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {footerData?.email || 'support@tulielab.vn'}</div>
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Hotline: {footerData?.hotline || '0336.883.242'}</div>
                                </div>
                            </div>
                            <div className="text-left md:text-right print:text-right space-y-2 self-start md:pt-1">
                                <h1 className="text-4xl md:text-5xl print:text-5xl font-black leading-none tracking-tighter uppercase">Hóa Đơn</h1>
                                <div className="text-sm">
                                    <span className="text-zinc-500 font-medium">Mã đơn hàng:</span>
                                    <span className="font-bold ml-2 text-base text-zinc-900">{order.code}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-zinc-500 font-medium">Ngày tạo:</span>
                                    <span className="font-bold ml-2 text-zinc-900">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="mt-4">
                                    <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                                        ${order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}
                                    `}>
                                        {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Info Grid */}
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Thông tin khách hàng</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Họ tên người mua</span>
                                        <span className="font-bold text-zinc-900 text-base">{order.metadata?.vatBuyerName || order.metadata?.customerName || order.user.profile?.name || order.user.name || ''}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Email liên hệ</span>
                                        <span className="font-bold text-zinc-900">{order.metadata?.vatEmail || order.metadata?.email || order.user.email || ''}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Số điện thoại</span>
                                        <span className="font-bold text-zinc-900">{order.metadata?.vatPhone || order.metadata?.phone || order.user.profile?.phone || ''}</span>
                                    </div>
                                    {order.metadata?.taxId && (
                                        <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1">
                                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Mã số thuế</span>
                                            <span className="font-bold text-zinc-900">{order.metadata?.taxId}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Địa chỉ giao dịch</span>
                                        <span className="font-bold text-zinc-500 leading-relaxed">{order.metadata?.address || order.user.profile?.address || ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 md:text-right">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Chi tiết thanh toán</h3>
                                <div className="space-y-3 text-sm md:text-right">
                                    <div className="flex flex-col gap-1 md:items-end border-r-2 border-zinc-100 pr-4 py-1 md:border-l-0 md:pl-0">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Phương thức</span>
                                        <span className="font-bold text-zinc-900 uppercase">Chuyển khoản / Auto QR</span>
                                    </div>
                                    <div className="flex flex-col gap-1 md:items-end border-r-2 border-zinc-100 pr-4 py-1 md:border-l-0 md:pl-0">
                                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Loại tài khoản</span>
                                        <span className="font-bold text-zinc-900">{order.metadata?.createAccount ? 'Đăng ký mới' : 'Tài khoản hiện hữu'}</span>
                                    </div>
                                    {order.metadata?.isGift && (
                                        <div className="flex flex-col gap-1 md:items-end border-r-2 border-zinc-100 pr-4 py-1 md:border-l-0 md:pl-0">
                                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Ghi chú</span>
                                            <span className="font-bold text-zinc-950 uppercase italic tracking-wider">Đơn hàng quà tặng</span>
                                        </div>
                                    )}
                                    {order.metadata?.requireVAT && (
                                        <div className="flex flex-col gap-1 md:items-end border-r-2 border-zinc-100 pr-4 py-1 md:border-l-0 md:pl-0">
                                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Pháp lý</span>
                                            <span className="font-bold text-zinc-950 underline decoration-zinc-200 underline-offset-4">YÊU CẦU XUẤT HÓA ĐƠN VAT</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Chi tiết dịch vụ</h3>
                            <div className="overflow-x-auto rounded-none border-y border-zinc-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                            <th className="px-6 py-5 text-left font-black uppercase tracking-wider text-[11px] text-zinc-500">Mô tả sản phẩm & dịch vụ</th>
                                            <th className="px-6 py-5 text-right font-black uppercase tracking-wider text-[11px] text-zinc-500 w-48">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {order.items.map((item, index) => (
                                            <tr key={index} className="group/row hover:bg-zinc-50/30 transition-colors">
                                                <td className="px-6 py-6">
                                                    <div className="font-bold text-zinc-900 text-base mb-1">
                                                        {item.course?.title || item.product?.title || 'Dịch vụ không xác định'}
                                                    </div>
                                                    <div className="inline-flex items-center text-[10px] uppercase font-bold tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                                                        {item.course ? 'Online Course' : 'Digital Asset'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-right font-black text-zinc-950 text-base">
                                                    {formatCurrency(item.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t-2 border-zinc-900 border-double">
                                        <tr className="bg-zinc-50/20">
                                            <td className="px-6 py-4 text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Giá chưa thuế</td>
                                            <td className="px-6 py-4 text-right font-bold text-zinc-600">{formatCurrency(subtotalBeforeVat)}</td>
                                        </tr>
                                        <tr className="bg-zinc-50/20">
                                            <td className="px-6 py-4 text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Thuế GTGT (10%)</td>
                                            <td className="px-6 py-4 text-right font-bold text-zinc-600">{formatCurrency(vatAmount)}</td>
                                        </tr>
                                        <tr className="bg-zinc-950 text-white">
                                            <td className="px-6 py-8 text-right font-black uppercase tracking-[0.15em] text-sm">Tổng cộng thanh toán</td>
                                            <td className="px-6 py-8 text-right text-3xl font-black">{formatCurrency(totalPayment)}</td>
                                        </tr>
                                        <tr className="border-t border-zinc-100">
                                            <td colSpan={2} className="px-6 py-5 text-right bg-zinc-50/50">
                                                <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider mr-4">Bằng chữ</span>
                                                <span className="font-bold text-zinc-900 italic">"{toVietnameseWords(totalPayment)}"</span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Transaction History Section */}
                        {(order.status === 'PAID' || order.status === 'COMPLETED') && (
                            <div className="relative z-10 space-y-4 pt-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Lịch sử giao dịch</h3>
                                {order.transactions && order.transactions.length > 0 ? (
                                    <div className="overflow-x-auto border-t border-zinc-100">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-zinc-50">
                                                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-zinc-400">Thời gian</th>
                                                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-zinc-400">Cổng thanh toán</th>
                                                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-zinc-400">Mã giao dịch</th>
                                                    <th className="px-6 py-4 text-right font-bold text-[10px] uppercase tracking-widest text-zinc-400 w-40">Số tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-50">
                                                {order.transactions.map((tx, idx) => (
                                                    <tr key={idx} className="hover:bg-zinc-50/30 transition-colors">
                                                        <td className="px-6 py-4 text-zinc-500 font-medium">{formatDate(tx.createdAt)}</td>
                                                        <td className="px-6 py-4 font-bold text-zinc-900 uppercase text-[11px]">{tx.bankName || tx.paymentMethod || 'Chuyển khoản'}</td>
                                                        <td className="px-6 py-4 font-mono text-zinc-400 text-xs tracking-tighter">{tx.referenceCode || tx.id}</td>
                                                        <td className="px-6 py-4 text-right font-black text-zinc-950">{formatCurrency(tx.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-zinc-400 py-6 px-6 bg-zinc-50/50 rounded-lg border-2 border-dashed border-zinc-100 text-center uppercase tracking-widest">
                                        Hệ thống đã xác nhận thanh toán
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="relative z-10 pt-12 border-t border-zinc-100 flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Tulie Lab Ecosystem</p>
                                <p className="text-sm font-bold text-zinc-900">https://thelab.tulie.vn</p>
                            </div>
                            <div className="text-right">
                                <div className="w-24 h-24 ml-auto bg-zinc-100 rounded flex items-center justify-center opacity-20 grayscale">
                                    {/* Placeholder for QR or Stamp */}
                                    <FileText className="w-12 h-12 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Print Only Styles & PDF compatibility fix */}
            <style jsx global>{`
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
                    /* Hide site-wide UI elements */
                    nav, header, footer, .no-print, .print-hidden, [role="navigation"], .no-pdf { 
                        display: none !important; 
                    }
                    /* Ensure the invoice is the only thing visible */
                    .max-w-4xl { 
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .shadow-xl { box-shadow: none !important; }
                    .Card { border: none !important; }
                }

                /* PDF Specific resets: Force override any oklch usage during download */
                .pdf-capture-mode * {
                    /* html2canvas fails on oklch. This attempts to force standard colors if possible */
                    /* Note: This is a broad stroke, better to ensure no oklch in the content itself */
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
