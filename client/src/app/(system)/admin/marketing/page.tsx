'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import {
    BarChart3,
    TrendingUp,
    RefreshCw,
    DollarSign,
    Target,
    MousePointer2,
    Tag,
    AlertCircle
} from 'lucide-react';

export default function FacebookROIPage() {
    const { addToast } = useToast();
    const [roiData, setRoiData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.marketingAds.getROI();
            setRoiData(data);
        } catch (error: any) {
            console.error('Failed to fetch ROI data:', error);
            addToast('Không thể tải dữ liệu ROI: ' + (error.message || 'Lỗi mạng'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await api.marketingAds.syncInsights('yesterday');
            addToast('Đã bắt đầu đồng bộ dữ liệu quảng cáo từ Facebook', 'success');
            fetchData();
        } catch (error: any) {
            addToast('Đồng bộ thất bại: ' + (error.message || 'Lỗi API'), 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleClassify = async () => {
        try {
            await api.marketingAds.classify();
            addToast('Đã phân loại leads và cập nhật tags thành công', 'success');
        } catch (error: any) {
            addToast('Phân loại thất bại: ' + (error.message || 'Lỗi API'), 'error');
        }
    };

    if (loading && roiData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalSpend = roiData.reduce((acc, curr) => acc + curr.spend, 0);
    const totalRevenue = roiData.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Marketing ROI Dashboard"
                subtitle="Theo dõi hiệu quả tiếp thị và tối ưu hóa lợi nhuận thực tế trên toàn bộ nền tảng"
                icon={<BarChart3 className="w-8 h-8 text-foreground" />}
            >
                <div className="flex gap-2 text-foreground font-medium">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClassify}
                        className="gap-2 border-slate-200 hover:bg-slate-50"
                    >
                        <Tag className="w-4 h-4" />
                        Phân loại Leads
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSync}
                        disabled={syncing}
                        className="gap-2 bg-black text-white hover:bg-black/90"
                    >
                        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                        Đồng bộ Ad Spend
                    </Button>
                </div>
            </AdminPageHeader>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Tổng chi phí Ads"
                    value={formatCurrency(totalSpend)}
                    icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}
                    trend="Chi phí thực tế từ Marketing API"
                />
                <MetricCard
                    title="Doanh thu quy đổi"
                    value={formatCurrency(totalRevenue)}
                    icon={<TrendingUp className="w-5 h-5 text-muted-foreground" />}
                    trend="Doanh thu khớp theo UTM Campaign"
                />
                <MetricCard
                    title="ROAS Trung bình"
                    value={avgROAS.toFixed(2) + 'x'}
                    icon={<Target className="w-5 h-5 text-muted-foreground" />}
                    highlight="text-foreground"
                />
                <MetricCard
                    title="ROI (%)"
                    value={avgROI.toFixed(1) + '%'}
                    icon={<BarChart3 className="w-5 h-5 text-muted-foreground" />}
                    highlight="text-foreground"
                />
            </div>

            <Card className="border-slate-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Hiệu quả theo Chiến dịch</CardTitle>
                            <CardDescription>Dữ liệu tổng hợp từ 30 ngày gần nhất (Real-time Attribution)</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b border-slate-100 transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 align-middle font-semibold text-foreground uppercase text-[10px] tracking-widest">Nền tảng</th>
                                    <th className="h-12 px-4 align-middle font-semibold text-foreground uppercase text-[10px] tracking-widest">Chiến dịch (UTM Campaign)</th>
                                    <th className="h-12 px-4 align-middle font-semibold text-foreground uppercase text-[10px] tracking-widest text-right">Chi phí</th>
                                    <th className="h-12 px-4 align-middle font-semibold text-foreground uppercase text-[10px] tracking-widest text-right">Doanh thu</th>
                                    <th className="h-12 px-4 align-middle font-semibold text-foreground uppercase text-[10px] tracking-widest text-center">ROAS</th>
                                    <th className="h-12 px-4 align-middle font-semibold text-foreground uppercase text-[10px] tracking-widest text-right">ROI (%)</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 text-foreground">
                                {roiData.length > 0 ? roiData.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                        <td className="p-4 align-middle">
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-wider border border-slate-200">
                                                {item.platform || 'Facebook'}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">{item.campaign}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">Direct Attribution</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right font-medium text-slate-600">
                                            {formatCurrency(item.spend)}
                                        </td>
                                        <td className="p-4 align-middle text-right font-bold text-slate-900">
                                            {formatCurrency(item.revenue)}
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            <span className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                                                {item.roas.toFixed(2)}x
                                            </span>
                                        </td>
                                        <td className={`p-4 align-middle text-right font-black ${item.roi > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {item.roi.toFixed(1)}%
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-muted-foreground italic">
                                            Chưa có dữ liệu chiến dịch được đồng bộ.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                <Card className="bg-slate-50/50 border-slate-100 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                            <MousePointer2 className="w-4 h-4 text-foreground" />
                            Cấu hình Tracking (CAPI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-4">
                        <p className="text-muted-foreground leading-relaxed">Hỗ trợ tối ưu hóa thuật toán Facebook bằng cách đẩy ngược dữ liệu chuyển đổi thực tế từ Server. Giúp giảm thiểu sai số do chặn cookie trên trình duyệt.</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-black" />
                                <span>Trạng thái: <strong className="text-foreground">Đang hoạt động</strong></span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-black" />
                                <span>Sự kiện theo dõi: Purchase, Lead, Checkout</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50 border-slate-100 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4 text-foreground" />
                            Nguyên tắc Ghi nhận (Attribution)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-4">
                        <p className="text-muted-foreground leading-relaxed">Doanh thu được tính dựa trên khớp chính xác tham số <code>utm_campaign</code> trong link quảng cáo với mã chiến dịch trong đơn hàng của hệ thống Tulie.</p>
                        <div className="p-3 bg-white rounded border border-slate-200 text-[10px] text-slate-600 font-medium">
                            CHÚ Ý: Luôn kiểm tra tính nhất quán của tên chiến dịch trên mọi nền tảng quảng cáo (Facebook, Google, Tiktok).
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, highlight }: any) {
    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{title}</CardTitle>
                <div className="p-2 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-black tracking-tighter ${highlight || 'text-foreground'}`}>{value}</div>
                {trend && <p className="text-[9px] text-muted-foreground mt-1 uppercase font-semibold leading-relaxed">{trend}</p>}
            </CardContent>
        </Card>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
