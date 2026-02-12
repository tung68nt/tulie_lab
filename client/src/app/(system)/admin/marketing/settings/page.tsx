'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/Button';
import { RefreshCw, Plus, Trash2, Save, Check, X, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface MarketingAccountConfig {
    id: string;
    name: string;
    active: boolean;
    FB_PIXEL_ID: string;
    FB_CAPI_ACCESS_TOKEN: string;
    FB_AD_ACCOUNT_ID: string;
    monitoredCampaigns: string[];
}

export default function MarketingSettingsPage() {
    const [configs, setConfigs] = useState<MarketingAccountConfig[]>([]);
    const [loadingConfigs, setLoadingConfigs] = useState(true);
    const [savingConfigs, setSavingConfigs] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const { showToast } = useToast();

    // Fetch Configurations
    const fetchConfigs = async () => {
        setLoadingConfigs(true);
        try {
            const res = await api.settings.get();
            const storedConfigs = res.MARKETING_CONFIGS ? JSON.parse(res.MARKETING_CONFIGS) : [];

            if (storedConfigs.length === 0) {
                // Initialize with one empty config if none exist
                const newId = Math.random().toString(36).substr(2, 9);
                setConfigs([{
                    id: newId,
                    name: 'Tài khoản chính',
                    active: true,
                    FB_PIXEL_ID: '',
                    FB_CAPI_ACCESS_TOKEN: '',
                    FB_AD_ACCOUNT_ID: '',
                    monitoredCampaigns: []
                }]);
                setExpandedIds([newId]);
            } else {
                setConfigs(storedConfigs);
                // Expand the first one by default
                if (storedConfigs.length > 0) setExpandedIds([storedConfigs[0].id]);
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

    const handleSaveConfigs = async () => {
        setSavingConfigs(true);
        try {
            await api.settings.update({
                MARKETING_CONFIGS: JSON.stringify(configs)
            });
            showToast('Đã lưu cấu hình thành công', 'success');
        } catch (error) {
            console.error('Update Configs Error:', error);
            showToast('Lỗi khi lưu cấu hình', 'error');
        } finally {
            setSavingConfigs(false);
        }
    };

    const addConfig = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setConfigs([...configs, {
            id: newId,
            name: `Tài khoản ${configs.length + 1}`,
            active: true,
            FB_PIXEL_ID: '',
            FB_CAPI_ACCESS_TOKEN: '',
            FB_AD_ACCOUNT_ID: '',
            monitoredCampaigns: []
        }]);
        setExpandedIds([...expandedIds, newId]);
    };

    const removeConfig = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) {
            if (configs.length > 1) {
                setConfigs(configs.filter(c => c.id !== id));
            } else {
                showToast('Phải có ít nhất một cấu hình', 'error');
            }
        }
    };

    const updateConfig = (id: string, field: keyof MarketingAccountConfig, value: any) => {
        setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <AdminPageHeader
                title="Cấu hình API"
                subtitle="Quản lý kết nối nhiều tài khoản quảng cáo Facebook"
                icon={<Settings className="w-8 h-8 text-foreground" />}
            />

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={addConfig} className="gap-2">
                    <Plus className="w-4 h-4" /> Thêm tài khoản
                </Button>
                <Button onClick={handleSaveConfigs} disabled={savingConfigs} className="gap-2 bg-black text-white">
                    {savingConfigs ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu tất cả cấu hình
                </Button>
            </div>

            <div className="space-y-4">
                {configs.map((config, index) => (
                    <Collapsible
                        key={config.id}
                        open={expandedIds.includes(config.id)}
                        onOpenChange={() => toggleExpand(config.id)}
                        className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200"
                    >
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border-b border-white select-none">
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer flex-1">
                                    {expandedIds.includes(config.id) ? (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-sm">{config.name}</span>
                                        {config.active ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs font-normal">Đang hoạt động</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 text-xs font-normal">Đã tắt</Badge>
                                        )}
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={config.active}
                                    onCheckedChange={(checked) => updateConfig(config.id, 'active', checked)}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeConfig(config.id)}
                                    className="text-muted-foreground hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <CollapsibleContent>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Tên gợi nhớ</Label>
                                        <Input
                                            value={config.name}
                                            onChange={(e) => updateConfig(config.id, 'name', e.target.value)}
                                            placeholder="VD: Page A - Tài khoản chính"
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Ad Account ID</Label>
                                        <Input
                                            value={config.FB_AD_ACCOUNT_ID}
                                            onChange={(e) => updateConfig(config.id, 'FB_AD_ACCOUNT_ID', e.target.value)}
                                            placeholder="VD: 1234567890"
                                            className="font-mono text-sm bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">FB CAPI Access Token</Label>
                                    <textarea
                                        rows={3}
                                        value={config.FB_CAPI_ACCESS_TOKEN}
                                        onChange={(e) => updateConfig(config.id, 'FB_CAPI_ACCESS_TOKEN', e.target.value)}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-black transition-all font-mono text-sm break-all"
                                        placeholder="EAA..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Facebook Pixel ID</Label>
                                    <Input
                                        value={config.FB_PIXEL_ID}
                                        onChange={(e) => updateConfig(config.id, 'FB_PIXEL_ID', e.target.value)}
                                        placeholder="VD: 123456789012345"
                                        className="font-mono text-sm bg-white"
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>

            <Card className="bg-slate-50 border-slate-200 shadow-none">
                <CardHeader>
                    <CardTitle className="text-sm font-bold">Hướng dẫn cấu hình</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-4 text-muted-foreground leading-relaxed">
                    <p>Hệ thống hỗ trợ kết nối nhiều tài khoản quảng cáo cùng lúc. Dữ liệu từ tất cả các tài khoản hoạt động sẽ được tổng hợp lại trong trang Tổng quan.</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Tên gợi nhớ:</strong> Đặt tên dễ phân biệt (VD: Page Mỹ phẩm, Page Thời trang).</li>
                        <li><strong>Ad Account ID:</strong> Chỉ nhập số, không bao gồm 'act_'.</li>
                        <li><strong>Monitored Campaigns:</strong> Mặc định hệ thống sẽ lấy tất cả chiến dịch. Bạn có thể giới hạn chiến dịch tại trang "Danh sách Chiến dịch".</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
