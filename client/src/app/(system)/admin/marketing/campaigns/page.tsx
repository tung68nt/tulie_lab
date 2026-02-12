'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/Button';
import { RefreshCw, Filter, CheckSquare, Square, Search } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';

interface Campaign {
    id: string;
    name: string;
    status: string;
    objective: string;
}

interface MarketingAccountConfig {
    id: string;
    name: string;
    active: boolean;
    FB_PIXEL_ID: string;
    FB_CAPI_ACCESS_TOKEN: string;
    FB_AD_ACCOUNT_ID: string;
    monitoredCampaigns: string[];
}

export default function MarketingCampaignsPage() {
    const [configs, setConfigs] = useState<MarketingAccountConfig[]>([]);
    const [selectedConfigId, setSelectedConfigId] = useState<string>('');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loadingConfigs, setLoadingConfigs] = useState(true);
    const [loadingCampaigns, setLoadingCampaigns] = useState(false);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    // Fetch Configurations
    const fetchConfigs = async () => {
        setLoadingConfigs(true);
        try {
            const res = await api.settings.get();
            const storedConfigs = res.MARKETING_CONFIGS ? JSON.parse(res.MARKETING_CONFIGS) : [];
            setConfigs(storedConfigs);
            if (storedConfigs.length > 0) {
                setSelectedConfigId(storedConfigs[0].id);
            }
        } catch (error) {
            console.error('Fetch Configs Error:', error);
            showToast('Lỗi khi tải cấu hình', 'error');
        } finally {
            setLoadingConfigs(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    // Fetch Campaigns when account changes
    useEffect(() => {
        if (selectedConfigId) {
            fetchCampaigns(selectedConfigId);
        }
    }, [selectedConfigId]);

    const fetchCampaigns = async (configId: string) => {
        const config = configs.find(c => c.id === configId);
        if (!config || !config.FB_AD_ACCOUNT_ID || !config.FB_CAPI_ACCESS_TOKEN) {
            setCampaigns([]);
            return;
        }

        setLoadingCampaigns(true);
        try {
            const data = await api.marketingAds.getCampaigns(config.FB_AD_ACCOUNT_ID, config.FB_CAPI_ACCESS_TOKEN);
            setCampaigns(data);
        } catch (error) {
            console.error('Fetch Campaigns Error:', error);
            showToast('Lỗi khi tải danh sách chiến dịch', 'error');
            setCampaigns([]);
        } finally {
            setLoadingCampaigns(false);
        }
    };

    const toggleCampaign = (campaignId: string) => {
        const configIndex = configs.findIndex(c => c.id === selectedConfigId);
        if (configIndex === -1) return;

        const newConfigs = [...configs];
        const currentMonitored = newConfigs[configIndex].monitoredCampaigns || [];

        if (currentMonitored.includes(campaignId)) {
            newConfigs[configIndex].monitoredCampaigns = currentMonitored.filter(id => id !== campaignId);
        } else {
            newConfigs[configIndex].monitoredCampaigns = [...currentMonitored, campaignId];
        }

        setConfigs(newConfigs);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.settings.update({
                MARKETING_CONFIGS: JSON.stringify(configs)
            });
            showToast('Đã lưu cấu hình chiến dịch thành công', 'success');
        } catch (error) {
            console.error('Update Configs Error:', error);
            showToast('Lỗi khi lưu cấu hình', 'error');
        } finally {
            setSaving(false);
        }
    };

    const selectedConfig = configs.find(c => c.id === selectedConfigId);
    const monitoredCount = selectedConfig?.monitoredCampaigns?.length || 0;

    return (
        <div className="space-y-8 h-full flex flex-col">
            <AdminPageHeader
                title="Danh sách Chiến dịch"
                subtitle="Chọn các chiến dịch cụ thể để theo dõi cho từng tài khoản"
                icon={<Filter className="w-8 h-8 text-foreground" />}
            />

            <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
                {/* Sidebar: Account Selection */}
                <Card className="w-full md:w-64 flex-shrink-0 border-slate-200 shadow-none h-fit">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold">Tài khoản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {loadingConfigs ? (
                            <div className="text-xs text-muted-foreground p-2">Đang tải...</div>
                        ) : configs.length === 0 ? (
                            <div className="text-xs text-muted-foreground p-2">Chưa có tài khoản nào được cấu hình.</div>
                        ) : configs.map(config => (
                            <button
                                key={config.id}
                                onClick={() => setSelectedConfigId(config.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${selectedConfigId === config.id
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-muted-foreground hover:bg-slate-100'
                                    }`}
                            >
                                <div className="truncate">{config.name}</div>
                                <div className={`text-[10px] mt-0.5 opacity-80 truncate font-mono`}>ID: {config.FB_AD_ACCOUNT_ID}</div>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Main Content: Campaign List */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                        <div>
                            <h3 className="text-sm font-bold">{selectedConfig?.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {monitoredCount === 0
                                    ? 'Đang theo dõi TẤT CẢ chiến dịch (Mặc định)'
                                    : `Đang theo dõi ${monitoredCount} chiến dịch được chọn`}
                            </p>
                        </div>
                        <Button onClick={handleSave} disabled={saving} className="bg-black text-white gap-2">
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                            Lưu thay đổi
                        </Button>
                    </div>

                    <Card className="border-slate-200 shadow-none flex-1">
                        <CardContent className="p-0">
                            {loadingCampaigns ? (
                                <div className="flex items-center justify-center p-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                </div>
                            ) : campaigns.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground text-sm">
                                    Không tìm thấy chiến dịch nào hoặc chưa cấu hình đúng API Key.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {campaigns.map(campaign => {
                                        const isChecked = selectedConfig?.monitoredCampaigns?.includes(campaign.id);
                                        return (
                                            <div
                                                key={campaign.id}
                                                className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer ${isChecked ? 'bg-slate-50/50' : ''}`}
                                                onClick={() => toggleCampaign(campaign.id)}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggleCampaign(campaign.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-semibold truncate">{campaign.name}</span>
                                                        <Badge variant="outline" className={`text-[10px] h-5 ${campaign.status === 'ACTIVE'
                                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                                : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {campaign.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">ID: {campaign.id}</span>
                                                        <span>Objective: {campaign.objective}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
