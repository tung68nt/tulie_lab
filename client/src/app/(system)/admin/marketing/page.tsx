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

export default function MarketingDashboard() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

    // Overview states
    const [roiData, setRoiData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Settings states
    const [settings, setSettings] = useState<Record<string, string>>({
        FB_PIXEL_ID: '',
        FB_CAPI_ACCESS_TOKEN: '',
        FB_AD_ACCOUNT_ID: ''
    });
    const [savingSettings, setSavingSettings] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.marketingAds.getROI();
            setRoiData(data || []);
        } catch (error: any) {
            console.error('Failed to fetch ROI data:', error);
            addToast('Không thể tải dữ liệu ROI: ' + (error.message || 'Lỗi mạng'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res: any = await api.settings.get();
            const allSettings = res.data || {};
            setSettings({
                FB_PIXEL_ID: allSettings.FB_PIXEL_ID || '',
                FB_CAPI_ACCESS_TOKEN: allSettings.FB_CAPI_ACCESS_TOKEN || '',
                FB_AD_ACCOUNT_ID: allSettings.FB_AD_ACCOUNT_ID || ''
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchSettings();
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

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await api.settings.update(settings);
            addToast('Đã cập nhật cấu hình API thành công', 'success');
        } catch (error: any) {
            addToast('Cập nhật thất bại: ' + (error.message || 'Lỗi hệ thống'), 'error');
        } finally {
            setSavingSettings(false);
        }
    };

    const totalSpend = roiData.reduce((acc, curr) => acc + (curr.spend || 0), 0);
    const totalRevenue = roiData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Marketing Center"
                subtitle="Quản lý chiến dịch, đo lường ROI và cấu hình tích hợp các nền tảng"
                icon={<BarChart3 className="w-8 h-8 text-foreground" />}
            />

            {/* Premium Tab Navigation */}
            <div className="flex border-b border-slate-200 gap-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'overview'
                        ? 'border-b-2 border-black text-black'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Tổng quan hiệu quả
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'settings'
                        ? 'border-b-2 border-black text-black'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Cấu hình API
                </button>
            </div>

            {activeTab === 'overview' ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={handleClassify} className="gap-2 border-slate-200">
                            <Tag className="w-4 h-4" /> Phân loại Leads
                        </Button>
                        <Button variant="default" size="sm" onClick={handleSync} disabled={syncing} className="gap-2 bg-black text-white">
                            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Đồng bộ Spend
                        </Button>
                    </div>

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

                    <Card className="border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold tracking-tight">Hiệu quả theo Chiến dịch</CardTitle>
                            <CardDescription>Dữ liệu tổng hợp (Real-time Attribution)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                </div>
                            ) : (
                                <div className="relative w-full overflow-auto text-foreground">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100 italic">
                                                <th className="h-12 px-4 font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">Nền tảng</th>
                                                <th className="h-12 px-4 font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">Chiến dịch</th>
                                                <th className="h-12 px-4 font-semibold uppercase text-[10px] tracking-widest text-muted-foreground text-right border-x border-slate-50">Chi phí</th>
                                                <th className="h-12 px-4 font-semibold uppercase text-[10px] tracking-widest text-muted-foreground text-right border-r border-slate-50">Doanh thu</th>
                                                <th className="h-12 px-4 font-semibold uppercase text-[10px] tracking-widest text-muted-foreground text-center">ROAS</th>
                                                <th className="h-12 px-4 font-semibold uppercase text-[10px] tracking-widest text-muted-foreground text-right">ROI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roiData.length > 0 ? roiData.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold uppercase tracking-wider border border-slate-200">{item.platform}</span></td>
                                                    <td className="p-4 font-semibold">{item.campaign}</td>
                                                    <td className="p-4 text-right font-medium text-slate-500 border-x border-slate-50/50">{formatCurrency(item.spend)}</td>
                                                    <td className="p-4 text-right font-bold text-slate-900 border-r border-slate-50/50">{formatCurrency(item.revenue)}</td>
                                                    <td className="p-4 text-center"><span className="px-2 py-1 rounded text-[11px] font-bold bg-slate-100">{item.roas.toFixed(2)}x</span></td>
                                                    <td className={`p-4 text-right font-black ${item.roi > 0 ? 'text-slate-900' : 'text-slate-400'}`}>{item.roi.toFixed(1)}%</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground italic">Chưa có dữ liệu chiến dịch.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black rounded-lg">
                                            <RefreshCw className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">Facebook Ads Integration</CardTitle>
                                            <CardDescription>Cấu hình các tham số để đồng bộ Ad Spend và gửi Conversion (CAPI)</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateSettings} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Facebook Pixel ID</label>
                                            <input
                                                type="text"
                                                value={settings.FB_PIXEL_ID}
                                                onChange={(e) => setSettings({ ...settings, FB_PIXEL_ID: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black transition-all font-mono text-sm"
                                                placeholder="VD: 123456789012345"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">FB CAPI Access Token</label>
                                            <textarea
                                                rows={4}
                                                value={settings.FB_CAPI_ACCESS_TOKEN}
                                                onChange={(e) => setSettings({ ...settings, FB_CAPI_ACCESS_TOKEN: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black transition-all font-mono text-xs break-all"
                                                placeholder="Nhập System User Access Token từ Facebook..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ad Account ID</label>
                                            <input
                                                type="text"
                                                value={settings.FB_AD_ACCOUNT_ID}
                                                onChange={(e) => setSettings({ ...settings, FB_AD_ACCOUNT_ID: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-black transition-all font-mono text-sm"
                                                placeholder="VD: 1234567890"
                                            />
                                            <p className="text-[10px] text-muted-foreground italic">Lưu ý: Chỉ nhập phần số, không bao gồm tiền tố 'act_'</p>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={savingSettings}
                                                className="w-full bg-black text-white hover:bg-black/90 h-14 rounded-xl text-sm font-bold uppercase tracking-widest"
                                            >
                                                {savingSettings ? <RefreshCw className="animate-spin w-5 h-5" /> : 'Lưu cấu hình API'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-slate-50 border-slate-200 shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider">Hướng dẫn cấu hình</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-4 text-muted-foreground leading-relaxed">
                                    <p>Để hệ thống tự động tính ROI, bạn cần hoàn thành các bước sau trên Facebook Events Manager:</p>
                                    <ol className="list-decimal pl-4 space-y-2">
                                        <li>Tạo <strong>Pixel</strong> và lấy Pixel ID đưa vào ô cấu hình.</li>
                                        <li>Trong phần Settings của Pixel, tạo <strong>Conversions API Access Token</strong>.</li>
                                        <li>Lấy <strong>Ad Account ID</strong> từ trình quản lý quảng cáo (Ads Manager).</li>
                                    </ol>
                                    <div className="p-3 bg-white border border-slate-200 rounded text-black font-medium">
                                        QUAN TRỌNG: Đảm bảo link quảng cáo trên Facebook luôn có <code>utm_campaign</code> tương ứng.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
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
