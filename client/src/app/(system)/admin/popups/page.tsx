'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Button } from '@/components/Button';
import { Save, Bell, LogOut, Loader2, ShoppingBag, X, ArrowRight, MessageCircle, Eye, EyeOff } from 'lucide-react';
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
    idleTimeout: number;
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
    idleTimeout: 0,
};

const NAMES = ['Anh T.', 'Chị H.', 'Minh N.', 'Linh V.', 'Hoàng D.'];
const LOCATIONS = ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Vũng Tàu', 'Bình Dương'];

export default function PopupConfigPage() {
    const [fomo, setFomo] = useState<FomoConfig>(DEFAULT_FOMO);
    const [exit, setExit] = useState<ExitConfig>(DEFAULT_EXIT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showFomoPreview, setShowFomoPreview] = useState(false);
    const [showExitPreview, setShowExitPreview] = useState(false);
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

    // Preview data
    const previewAction = fomo.actions[0] || 'vừa mua sản phẩm';
    const previewName = NAMES[0];
    const previewLocation = LOCATIONS[0];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Popup & FOMO"
                subtitle="Cấu hình nội dung, nút và link cho các popup thông báo trên website"
                icon={<Bell className="w-8 h-8" />}
            >
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu cấu hình
                </Button>
            </AdminPageHeader>

            {/* FOMO Notification Config */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>FOMO Notification</CardTitle>
                            <CardDescription>Popup hiển thị ở góc dưới-trái khi vào trang</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFomoPreview(!showFomoPreview)}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showFomoPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {showFomoPreview ? 'Ẩn preview' : 'Xem preview'}
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{fomo.enabled ? 'Đang bật' : 'Đã tắt'}</span>
                                <Switch
                                    checked={fomo.enabled}
                                    onCheckedChange={(checked) => setFomo({ ...fomo, enabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* FOMO Preview */}
                    {showFomoPreview && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
                            <div className="flex justify-start">
                                <div className="w-72 md:w-80 overflow-hidden rounded-lg bg-zinc-900/95 border border-zinc-800 shadow-lg flex items-center p-3.5 gap-3.5">
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-zinc-900" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-1.5 mb-0.5">
                                            <span className="text-[13px] font-semibold text-zinc-100">{previewName}</span>
                                            <span className="text-[12px] text-zinc-400">đến từ</span>
                                            <span className="text-[13px] font-semibold text-zinc-200">{previewLocation}</span>
                                        </div>
                                        <p className="text-[12px] text-zinc-400 font-medium leading-tight mb-0.5">{previewAction}</p>
                                        <span className="text-[10px] text-zinc-500 block">Vừa xong</span>
                                    </div>
                                    <div className="self-start p-1 rounded-md text-zinc-600">
                                        <X className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Exit-Intent Modal</CardTitle>
                            <CardDescription>Popup khi user di chuột ra khỏi trang hoặc không tương tác</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowExitPreview(!showExitPreview)}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showExitPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {showExitPreview ? 'Ẩn preview' : 'Xem preview'}
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{exit.enabled ? 'Đang bật' : 'Đã tắt'}</span>
                                <Switch
                                    checked={exit.enabled}
                                    onCheckedChange={(checked) => setExit({ ...exit, enabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Exit-Intent Preview */}
                    {showExitPreview && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
                            <div className="flex justify-center">
                                <div className="w-full max-w-md overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h2 className="text-xl font-semibold text-zinc-100">{exit.title || 'Tiêu đề'}</h2>
                                        <div className="p-1.5 rounded-md text-zinc-500">
                                            <X className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{exit.description || 'Nội dung mô tả...'}</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-medium">
                                            {exit.primaryText || 'Nút chính'}
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                        <div className="flex items-center justify-center gap-2 w-full h-11 rounded-md border border-zinc-700 text-zinc-300 text-sm font-medium">
                                            <MessageCircle className="w-4 h-4" />
                                            {exit.secondaryText || 'Nút phụ'}
                                        </div>
                                    </div>
                                    <div className="mt-4 w-full text-center text-zinc-600 text-xs font-medium">
                                        Không, cảm ơn
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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

                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Trigger theo thời gian</p>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Hiển thị sau khi không tương tác (giây)</Label>
                            <Input
                                type="number"
                                value={exit.idleTimeout}
                                onChange={(e) => setExit({ ...exit, idleTimeout: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                            />
                            <p className="text-xs text-muted-foreground">
                                {exit.idleTimeout > 0
                                    ? `Sẽ hiện popup sau ${exit.idleTimeout} giây không tương tác (hoạt động trên cả mobile)`
                                    : 'Đặt 0 để tắt. Chỉ dùng trigger chuột rời trang (desktop only).'}
                            </p>
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
                    <p><strong>Exit-Intent Modal:</strong> Hiển thị khi user di chuột ra khỏi viewport (phía trên) hoặc sau khi không tương tác một khoảng thời gian. Chỉ hiện 1 lần mỗi session. Chỉ trên landing page và trang chủ.</p>
                    <p><strong>Link:</strong> Dùng đường dẫn nội bộ (VD: <code className="bg-muted px-1 py-0.5 rounded text-xs">/san-pham</code>) hoặc link ngoài (VD: <code className="bg-muted px-1 py-0.5 rounded text-xs">https://zalo.me/...</code>).</p>
                </CardContent>
            </Card>
        </div>
    );
}
