'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Button } from '@/components/Button';
import { Save, Bell, Loader2, ShoppingBag, X, ArrowRight, MessageCircle, Eye, EyeOff, Users, TrendingUp, Zap, Plus, Trash2 } from 'lucide-react';
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
    highlight: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
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
    highlight: '🔥 Hơn 500+ học viên đã tham gia tuần này',
    title: 'Chờ chút — Đừng bỏ lỡ!',
    description: 'Bạn đang cách một bước để sở hữu bộ công cụ & khoá học giúp tự động hóa công việc, tiết kiệm hàng chục giờ mỗi tuần.',
    stats: [
        { value: '2,000+', label: 'Học viên' },
        { value: '50+', label: 'Sản phẩm số' },
        { value: '4.9/5', label: 'Đánh giá' },
    ],
    primaryText: 'Khám phá ngay',
    primaryLink: '/san-pham',
    secondaryText: 'Chat tư vấn miễn phí',
    secondaryLink: 'https://zalo.me/0393137755',
    idleTimeout: 0,
};

const NAMES = ['Anh T.', 'Chị H.', 'Minh N.', 'Linh V.', 'Hoàng D.'];
const LOCATIONS = ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Vũng Tàu', 'Bình Dương'];
const STAT_ICONS = [Users, TrendingUp, Zap];

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

    const updateStat = (index: number, field: 'value' | 'label', val: string) => {
        const newStats = [...(exit.stats || [])];
        newStats[index] = { ...newStats[index], [field]: val };
        setExit({ ...exit, stats: newStats });
    };

    const addStat = () => {
        setExit({ ...exit, stats: [...(exit.stats || []), { value: '', label: '' }] });
    };

    const removeStat = (index: number) => {
        setExit({ ...exit, stats: (exit.stats || []).filter((_, i) => i !== index) });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const previewAction = fomo.actions[0] || 'vừa mua sản phẩm';

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
                            <button onClick={() => setShowFomoPreview(!showFomoPreview)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                {showFomoPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {showFomoPreview ? 'Ẩn' : 'Preview'}
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{fomo.enabled ? 'Bật' : 'Tắt'}</span>
                                <Switch checked={fomo.enabled} onCheckedChange={(c) => setFomo({ ...fomo, enabled: c })} />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
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
                                            <span className="text-[13px] font-semibold text-zinc-100">{NAMES[0]}</span>
                                            <span className="text-[12px] text-zinc-400">đến từ</span>
                                            <span className="text-[13px] font-semibold text-zinc-200">{LOCATIONS[0]}</span>
                                        </div>
                                        <p className="text-[12px] text-zinc-400 font-medium leading-tight mb-0.5">{previewAction}</p>
                                        <span className="text-[10px] text-zinc-500 block">Vừa xong</span>
                                    </div>
                                    <div className="self-start p-1 rounded-md text-zinc-600"><X className="w-3.5 h-3.5" /></div>
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
                            placeholder="Mỗi dòng là 1 hành động"
                            className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Mỗi dòng là 1 hành động. Random ghép với tên và địa chỉ giả lập.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Hiển thị mỗi (ms)</Label>
                            <Input type="number" value={fomo.showEvery} onChange={(e) => setFomo({ ...fomo, showEvery: parseInt(e.target.value) || 25000 })} />
                            <p className="text-xs text-muted-foreground">{(fomo.showEvery / 1000).toFixed(0)} giây</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Thời gian hiển thị (ms)</Label>
                            <Input type="number" value={fomo.duration} onChange={(e) => setFomo({ ...fomo, duration: parseInt(e.target.value) || 6000 })} />
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
                            <CardDescription>Popup khi user rời trang hoặc không tương tác</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowExitPreview(!showExitPreview)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                {showExitPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {showExitPreview ? 'Ẩn' : 'Preview'}
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{exit.enabled ? 'Bật' : 'Tắt'}</span>
                                <Switch checked={exit.enabled} onCheckedChange={(c) => setExit({ ...exit, enabled: c })} />
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
                                <div className="w-full max-w-md overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                                    {/* Highlight banner */}
                                    {exit.highlight && (
                                        <div className="px-6 py-2.5 bg-zinc-800/80 border-b border-zinc-700/50 text-center">
                                            <span className="text-xs font-semibold text-zinc-300">{exit.highlight}</span>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h2 className="text-xl font-bold text-zinc-100">{exit.title || 'Tiêu đề'}</h2>
                                            <div className="p-1.5 rounded-md text-zinc-500"><X className="w-4 h-4" /></div>
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">{exit.description || 'Mô tả...'}</p>

                                        {/* Stats */}
                                        {exit.stats && exit.stats.length > 0 && (
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                {exit.stats.map((stat, i) => {
                                                    const Icon = STAT_ICONS[i % STAT_ICONS.length];
                                                    return (
                                                        <div key={i} className="text-center p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
                                                            <Icon className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
                                                            <div className="text-lg font-bold text-zinc-100">{stat.value}</div>
                                                            <div className="text-[10px] text-zinc-500 font-medium">{stat.label}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-zinc-900 text-sm font-semibold">
                                                {exit.primaryText || 'Nút chính'} <ArrowRight className="w-4 h-4" />
                                            </div>
                                            <div className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium">
                                                <MessageCircle className="w-4 h-4" /> {exit.secondaryText || 'Nút phụ'}
                                            </div>
                                        </div>
                                        <div className="mt-4 w-full text-center text-zinc-600 text-xs font-medium">Không, cảm ơn</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Highlight */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Dòng highlight (banner trên cùng)</Label>
                        <Input
                            value={exit.highlight || ''}
                            onChange={(e) => setExit({ ...exit, highlight: e.target.value })}
                            placeholder="🔥 Hơn 500+ học viên đã tham gia tuần này"
                        />
                        <p className="text-xs text-muted-foreground">Để trống để ẩn. Có thể dùng emoji.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Tiêu đề</Label>
                        <Input value={exit.title} onChange={(e) => setExit({ ...exit, title: e.target.value })} placeholder="Chờ chút — Đừng bỏ lỡ!" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Nội dung mô tả</Label>
                        <Textarea rows={3} value={exit.description} onChange={(e) => setExit({ ...exit, description: e.target.value })} className="text-sm" />
                    </div>

                    {/* Stats */}
                    <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-muted-foreground">Số liệu (Social Proof)</p>
                            <button onClick={addStat} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Thêm
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(exit.stats || []).map((stat, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Input
                                        value={stat.value}
                                        onChange={(e) => updateStat(i, 'value', e.target.value)}
                                        placeholder="2,000+"
                                        className="w-28"
                                    />
                                    <Input
                                        value={stat.label}
                                        onChange={(e) => updateStat(i, 'label', e.target.value)}
                                        placeholder="Học viên"
                                        className="flex-1"
                                    />
                                    <button onClick={() => removeStat(i)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Hiển thị tối đa 3 số liệu. Để trống để ẩn.</p>
                    </div>

                    {/* Primary CTA */}
                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Nút chính (Primary)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Text</Label>
                                <Input value={exit.primaryText} onChange={(e) => setExit({ ...exit, primaryText: e.target.value })} placeholder="Khám phá ngay" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Link</Label>
                                <Input value={exit.primaryLink} onChange={(e) => setExit({ ...exit, primaryLink: e.target.value })} placeholder="/san-pham" />
                            </div>
                        </div>
                    </div>

                    {/* Secondary CTA */}
                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Nút phụ (Secondary)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Text</Label>
                                <Input value={exit.secondaryText} onChange={(e) => setExit({ ...exit, secondaryText: e.target.value })} placeholder="Chat tư vấn miễn phí" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Link</Label>
                                <Input value={exit.secondaryLink} onChange={(e) => setExit({ ...exit, secondaryLink: e.target.value })} placeholder="https://zalo.me/..." />
                            </div>
                        </div>
                    </div>

                    {/* Idle timeout */}
                    <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Trigger theo thời gian</p>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Hiển thị sau khi không tương tác (giây)</Label>
                            <Input type="number" value={exit.idleTimeout} onChange={(e) => setExit({ ...exit, idleTimeout: parseInt(e.target.value) || 0 })} placeholder="0" />
                            <p className="text-xs text-muted-foreground">
                                {exit.idleTimeout > 0
                                    ? `Hiện popup sau ${exit.idleTimeout}s không tương tác (desktop + mobile)`
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
                    <p><strong>FOMO Notification:</strong> Popup nhỏ góc dưới-trái, random xoay danh sách hành động. Chỉ trên trang chủ và landing page.</p>
                    <p><strong>Exit-Intent Modal:</strong> Hiển thị khi rời trang hoặc sau thời gian không tương tác. 1 lần/session. Chỉ trên trang chủ và landing page.</p>
                    <p><strong>Social Proof:</strong> Các số liệu (học viên, sản phẩm, đánh giá) tăng độ tin cậy và tạo FOMO. Nên dùng 3 số liệu.</p>
                </CardContent>
            </Card>
        </div>
    );
}
