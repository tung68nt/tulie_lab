'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Save, Bell, LogOut, Loader2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Switch } from '@/components/Switch';
import { Textarea } from '@/components/Textarea';

interface FomoConfig {
    enabled: boolean;
    actions: string[];
    showEvery: number;
    duration: number;
}

interface ExitConfig {
    enabled: boolean;
    title: string;
    description: string;
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    secondaryLink: string;
}

const DEFAULT_FOMO: FomoConfig = {
    enabled: true,
    actions: [
        'vừa đăng ký khóa Vibe Coding cho người mới',
        'vừa mua Hệ thống Quản lý Nhân sự (HRM)',
        'vừa mua Automation Email Marketing Script',
        'vừa mua AI Content Generator Template',
        'vừa mua Hệ thống Quản lý Tài chính Đa kênh',
    ],
    showEvery: 25000,
    duration: 6000,
};

const DEFAULT_EXIT: ExitConfig = {
    enabled: true,
    title: 'Chờ chút nhé!',
    description: 'Bạn có thể đang bỏ lỡ các công cụ và khoá học giúp tối ưu công việc. Hãy xem qua sản phẩm của chúng mình trước khi rời đi.',
    primaryText: 'Xem sản phẩm',
    primaryLink: '/san-pham',
    secondaryText: 'Chat với tư vấn viên',
    secondaryLink: 'https://zalo.me/0393137755',
};

export default function PopupConfigPage() {
    const [fomo, setFomo] = useState<FomoConfig>(DEFAULT_FOMO);
    const [exit, setExit] = useState<ExitConfig>(DEFAULT_EXIT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res: any = await api.settings.get();
            if (res.POPUP_FOMO_CONFIG) {
                try { setFomo({ ...DEFAULT_FOMO, ...JSON.parse(res.POPUP_FOMO_CONFIG) }); } catch {}
            }
            if (res.POPUP_EXIT_CONFIG) {
                try { setExit({ ...DEFAULT_EXIT, ...JSON.parse(res.POPUP_EXIT_CONFIG) }); } catch {}
            }
        } catch (error) {
            console.error('Load popup settings error:', error);
            addToast('Lỗi khi tải cấu hình popup', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.settings.update({
                POPUP_FOMO_CONFIG: JSON.stringify(fomo),
                POPUP_EXIT_CONFIG: JSON.stringify(exit),
            });
            addToast('Đã lưu cấu hình popup', 'success');
        } catch (error) {
            console.error('Save popup settings error:', error);
            addToast('Lỗi khi lưu cấu hình', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <AdminPageHeader
                title="Popup & FOMO"
                subtitle="Cấu hình nội dung, nút và link cho các popup thông báo trên website"
                icon={<Bell className="w-8 h-8 text-foreground" />}
            />

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu cấu hình
                </Button>
            </div>

            {/* FOMO Notification Config */}
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                            <Bell className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-base">FOMO Notification</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">Popup hiển thị ở góc dưới-trái khi vào trang</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{fomo.enabled ? 'Đang bật' : 'Đã tắt'}</span>
                        <Switch
                            checked={fomo.enabled}
                            onCheckedChange={(checked) => setFomo({ ...fomo, enabled: checked })}
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Danh sách hành động</Label>
                        <Textarea
                            rows={6}
                            value={fomo.actions.join('\n')}
                            onChange={(e) => setFomo({ ...fomo, actions: e.target.value.split('\n').filter(Boolean) })}
                            placeholder="Mỗi dòng là 1 hành động, ví dụ:&#10;vừa mua HRM Google Sheets&#10;vừa đăng ký khóa Vibe Coding"
                            className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Mỗi dòng là 1 hành động. Hệ thống sẽ random ghép với tên và địa chỉ giả lập.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Hiển thị mỗi (ms)</Label>
                            <Input
                                type="number"
                                value={fomo.showEvery}
                                onChange={(e) => setFomo({ ...fomo, showEvery: parseInt(e.target.value) || 25000 })}
                                placeholder="25000"
                            />
                            <p className="text-xs text-muted-foreground">{(fomo.showEvery / 1000).toFixed(0)} giây</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Thời gian hiển thị (ms)</Label>
                            <Input
                                type="number"
                                value={fomo.duration}
                                onChange={(e) => setFomo({ ...fomo, duration: parseInt(e.target.value) || 6000 })}
                                placeholder="6000"
                            />
                            <p className="text-xs text-muted-foreground">{(fomo.duration / 1000).toFixed(0)} giây</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Exit-Intent Modal Config */}
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Exit-Intent Modal</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">Popup khi user di chuột ra khỏi trang</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{exit.enabled ? 'Đang bật' : 'Đã tắt'}</span>
                        <Switch
                            checked={exit.enabled}
                            onCheckedChange={(checked) => setExit({ ...exit, enabled: checked })}
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Tiêu đề</Label>
                        <Input
                            value={exit.title}
                            onChange={(e) => setExit({ ...exit, title: e.target.value })}
                            placeholder="Chờ chút nhé!"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Nội dung mô tả</Label>
                        <Textarea
                            rows={3}
                            value={exit.description}
                            onChange={(e) => setExit({ ...exit, description: e.target.value })}
                            placeholder="Bạn có thể đang bỏ lỡ..."
                            className="text-sm"
                        />
                    </div>

                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Nút chính (Primary)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Text</Label>
                                <Input
                                    value={exit.primaryText}
                                    onChange={(e) => setExit({ ...exit, primaryText: e.target.value })}
                                    placeholder="Xem sản phẩm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Link</Label>
                                <Input
                                    value={exit.primaryLink}
                                    onChange={(e) => setExit({ ...exit, primaryLink: e.target.value })}
                                    placeholder="/san-pham"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Nút phụ (Secondary)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Text</Label>
                                <Input
                                    value={exit.secondaryText}
                                    onChange={(e) => setExit({ ...exit, secondaryText: e.target.value })}
                                    placeholder="Chat với tư vấn viên"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Link</Label>
                                <Input
                                    value={exit.secondaryLink}
                                    onChange={(e) => setExit({ ...exit, secondaryLink: e.target.value })}
                                    placeholder="https://zalo.me/..."
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-muted/30 border-border shadow-none">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">Hướng dẫn</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-muted-foreground leading-relaxed">
                    <p><strong>FOMO Notification:</strong> Popup nhỏ hiển thị ở góc dưới-trái, auto rotate danh sách hành động. Chỉ hiển thị trên landing page và trang chủ.</p>
                    <p><strong>Exit-Intent Modal:</strong> Hiển thị khi user di chuột ra khỏi viewport (phía trên). Chỉ hiện 1 lần mỗi session. Chỉ trên landing page và trang chủ.</p>
                    <p><strong>Link:</strong> Dùng đường dẫn nội bộ (VD: <code className="bg-muted px-1 py-0.5 rounded text-xs">/san-pham</code>) hoặc link ngoài (VD: <code className="bg-muted px-1 py-0.5 rounded text-xs">https://zalo.me/...</code>).</p>
                </CardContent>
            </Card>
        </div>
    );
}
