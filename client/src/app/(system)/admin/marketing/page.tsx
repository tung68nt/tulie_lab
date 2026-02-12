'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/Button';
import { RefreshCw, TrendingUp, DollarSign, Target, BarChart3, Plus, Trash2, Tag, Calendar, Filter } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function MarketingOverviewPage() {
    const [roiData, setRoiData] = useState<any[]>([]);
    const [loadingRoi, setLoadingRoi] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const { showToast } = useToast();

    // Fetch ROI Data
    const fetchROI = async () => {
        setLoadingRoi(true);
        try {
            const data = await api.marketingAds.getROI();
            setRoiData(data);
        } catch (error) {
            console.error('Fetch ROI Error:', error);
            showToast('Lỗi khi tải dữ liệu hiệu quả', 'error');
        } finally {
            setLoadingRoi(false);
        }
    };

    useEffect(() => {
        fetchROI();
    }, []);

    const handleSyncNow = async () => {
        setSyncing(true);
        try {
            await api.marketingAds.syncInsights();
            showToast('Đã bắt đầu đồng bộ dữ liệu', 'success');
            setTimeout(fetchROI, 2000); // Wait a bit for sync to process
        } catch (error) {
            showToast('Lỗi khi đồng bộ dữ liệu', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleClassify = async () => {
        try {
            await api.marketingAds.classify();
            showToast('Đã phân loại leads và cập nhật tags thành công', 'success');
        } catch (error: any) {
            showToast('Phân loại thất bại: ' + (error.message || 'Lỗi API'), 'error');
        }
    };

    const totalSpend = roiData.reduce((acc, curr) => acc + (curr.spend || 0), 0);
    const totalRevenue = roiData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Tổng quan hiệu quả"
                subtitle="Theo dõi hiệu quả chiến dịch marketing và ROI"
                icon={<BarChart3 className="w-8 h-8 text-foreground" />}
            />

            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleClassify} className="gap-2 border-slate-200">
                        <Tag className="w-4 h-4" /> Phân loại Leads
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSyncNow} disabled={syncing} className="gap-2 bg-black text-white">
                        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Đồng bộ Spend
                    </Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Tổng chi phí Ads"
                        value={formatCurrency(totalSpend)}
                        trend="Chi phí thực tế từ Marketing API"
                        icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
                    />
                    <MetricCard
                        title="Doanh thu quy đổi"
                        value={formatCurrency(totalRevenue)}
                        trend="Doanh thu khớp theo UTM Campaign"
                        icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
                    />
                    <MetricCard
                        title="ROAS trung bình"
                        value={`${avgROAS.toFixed(2)}x`}
                        icon={<Target className="w-4 h-4 text-muted-foreground" />}
                    />
                    <MetricCard
                        title="ROI (%)"
                        value={`${avgROI.toFixed(1)}%`}
                        highlight={avgROI > 0 ? 'text-green-600' : 'text-foreground'}
                        icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />}
                    />
                </div>

                {/* Campaign Performance Table */}
                <Card className="border-slate-200 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Hiệu quả theo Chiến dịch</CardTitle>
                        <CardDescription>Dữ liệu tổng hợp (Real-time Attribution)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingRoi ? (
                            <div className="h-40 flex items-center justify-center text-muted-foreground">Đang tải dữ liệu...</div>
                        ) : (
                            <div className="relative w-full overflow-auto text-foreground">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="h-12 px-4 font-medium text-xs text-muted-foreground">Nền tảng</th>
                                            <th className="h-12 px-4 font-medium text-xs text-muted-foreground">Chiến dịch</th>
                                            <th className="h-12 px-4 font-medium text-xs text-muted-foreground text-right border-x border-slate-50">Chi phí</th>
                                            <th className="h-12 px-4 font-medium text-xs text-muted-foreground text-right border-r border-slate-50">Doanh thu</th>
                                            <th className="h-12 px-4 font-medium text-xs text-muted-foreground text-center">ROAS</th>
                                            <th className="h-12 px-4 font-medium text-xs text-muted-foreground text-right">ROI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roiData.length > 0 ? (
                                            roiData.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold border border-slate-200 text-slate-600">{item.platform}</span></td>
                                                    <td className="p-4 font-medium text-sm">{item.campaign}</td>
                                                    <td className="p-4 text-right font-medium text-slate-600 border-x border-slate-50">{formatCurrency(item.spend)}</td>
                                                    <td className="p-4 text-right font-semibold text-slate-900 border-r border-slate-50">{formatCurrency(item.revenue)}</td>
                                                    <td className="p-4 text-center"><span className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100">{item.roas.toFixed(2)}x</span></td>
                                                    <td className={`p-4 text-right font-bold ${item.roi > 0 ? 'text-green-600' : 'text-slate-400'}`}>{item.roi.toFixed(1)}%</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Chưa có dữ liệu chiến dịch.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</CardTitle>
                <div className="p-2 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${highlight || 'text-foreground'}`}>{value}</div>
                {trend && <p className="text-xs text-muted-foreground mt-1 font-medium">{trend}</p>}
            </CardContent>
        </Card>
    );
}
