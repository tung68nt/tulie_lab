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
            const data = await api.facebook.getROI();
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
            await api.facebook.syncInsights('yesterday');
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
            await api.facebook.classify();
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
                title="Facebook Ads ROI Dashboard"
                subtitle="Theo dõi hiệu quả quảng cáo và tối ưu hóa lợi nhuận thực tế"
                icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
            >
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClassify}
                        className="gap-2"
                    >
                        <Tag className="w-4 h-4" />
                        Phân loại Leads
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSync}
                        disabled={syncing}
                        className="gap-2"
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
                    icon={<DollarSign className="w-5 h-5 text-red-500" />}
                    trend="Chi phí thực tế từ Marketing API"
                />
                <MetricCard
                    title="Doanh thu Facebook"
                    value={formatCurrency(totalRevenue)}
                    icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                    trend="Doanh thu khớp theo UTM Campaign"
                />
                <MetricCard
                    title="ROAS Trung bình"
                    value={avgROAS.toFixed(2) + 'x'}
                    icon={<Target className="w-5 h-5 text-purple-500" />}
                    highlight={avgROAS >= 2 ? 'text-green-600' : 'text-orange-500'}
                />
                <MetricCard
                    title="ROI (%)"
                    value={avgROI.toFixed(1) + '%'}
                    icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
                    highlight={avgROI > 0 ? 'text-green-600' : 'text-red-500'}
                />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Hiệu quả theo Chiến dịch</CardTitle>
                            <CardDescription>Dữ liệu tổng hợp từ 30 ngày gần nhất (Real-time Attribution)</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Chiến dịch (UTM Campaign)</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Chi phí</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Doanh thu</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">ROAS</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">ROI (%)</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0 text-foreground font-medium">
                                {roiData.length > 0 ? roiData.map((item, idx) => (
                                    <tr key={idx} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{item.campaign}</span>
                                                <span className="text-xs text-muted-foreground">Direct Conversion</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right text-red-500">
                                            {formatCurrency(item.spend)}
                                        </td>
                                        <td className="p-4 align-middle text-right text-green-600">
                                            {formatCurrency(item.revenue)}
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.roas >= 3 ? 'bg-green-100 text-green-700' :
                                                item.roas >= 1.5 ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {item.roas.toFixed(2)}x
                                            </span>
                                        </td>
                                        <td className={`p-4 align-middle text-right font-bold ${item.roi > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.roi.toFixed(1)}%
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                                            Chưa có dữ liệu chiến dịch được đồng bộ.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-blue-50/30 border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MousePointer2 className="w-5 h-5 text-blue-600" />
                            Cấu hình Tracking (CAPI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                        <p className="text-muted-foreground">Hỗ trợ tối ưu hóa thuật toán Facebook bằng cách đẩy ngược dữ liệu chuyển đổi thực tế từ Server (Tulie API).</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span>Trạng thái: <strong>Hoạt động</strong></span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span>Tracked Events: Purchase, Lead, InitiateCheckout</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50/30 border-orange-100">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            Ghi chú Attribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                        <p className="text-muted-foreground">Doanh thu được tính dựa trên khớp chính xác <code>utm_campaign</code> trong link quảng cáo với đơn hàng trong hệ thống.</p>
                        <div className="p-3 bg-background rounded border border-orange-100 text-xs text-orange-800">
                            <strong>Mẹo:</strong> Đảm bảo tất cả link quảng cáo đều có tham số <code>utm_campaign</code> rõ ràng để ROI chuẩn xác 100%.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, highlight }: any) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${highlight}`}>{value}</div>
                {trend && <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{trend}</p>}
            </CardContent>
        </Card>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
