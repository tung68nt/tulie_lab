'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { api, getMediaUrl } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Upload, Send, Key, RefreshCw, Copy, Check, Settings, Plus, Trash2, Edit2, CreditCard, Mail } from 'lucide-react';
import { Switch } from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useConfirm } from '@/components/ConfirmDialog';
import { Textarea } from '@/components/Textarea';
import { Info } from 'lucide-react';

const DEFAULT_TEMPLATES = {
    telegram_template_order: `🔔 <b>Đơn hàng mới!</b>
━━━━━━━━━━━━━━━━━━
<b>Mã:</b> <b>#{{code}}</b>
<b>Khách:</b> {{customer}}
<b>Tiền:</b> {{amount}}
<b>Trạng thái:</b> <b>{{status}}</b>
<b>Nội dung:</b> {{items}}
━━━━━━━━━━━━━━━━━━
<i>Hệ thống {{academy}}</i>`,
    telegram_template_security: `⚠️ <b>Cảnh báo Bảo mật!</b>
━━━━━━━━━━━━━━━━━━
<b>Hành vi:</b> <b>{{action}}</b>
<b>Chi tiết:</b> {{details}}
<b>IP:</b> {{ip}}
<b>Thời gian:</b> {{time}}
━━━━━━━━━━━━━━━━━━
<i>Vui lòng kiểm tra Admin Panel ngay!</i>`,
    telegram_template_registration: `👤 <b>Thành viên mới!</b>
━━━━━━━━━━━━━━━━━━
<b>Tên:</b> {{name}}
<b>Email:</b> {{email}}
<b>Thời gian:</b> {{time}}
━━━━━━━━━━━━━━━━━━`,
    telegram_template_report: `<b>📊 BÁO CÁO KINH DOANH & HỆ THỐNG</b>
━━━━━━━━━━━━━━━━━━
💰 <b>Kết quả {{title}}:</b>
- Doanh thu: <b>{{revenue}}</b>
- Đơn hàng: <b>{{paidOrders}}</b>/{{totalOrders}} (Thành công/Tổng)
- Thành viên mới: <b>{{newUsers}}</b>

⏳ <b>Tình hình tồn đọng:</b>
- Đơn hàng pending: <b>{{pendingOrders}}</b> đơn
- Học viên "ngủ đông": <b>{{inactiveUsers}}</b> người (>14 ngày)

🛡️ <b>Bảo mật & Sức khỏe:</b>
- Cảnh báo bảo mật: <b>{{securityRisks}}</b>
- Trạng thái: <b>{{systemStatus}}</b>
━━━━━━━━━━━━━━━━━━
<i>Hệ thống {{academy}} - {{time}}</i>`
};

export default function AdminSettingsPage() {
    const { addToast } = useToast();
    const { updateSettings: globalUpdateSettings } = useSettings();
    const confirm = useConfirm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const [testLoading, setTestLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [domainBranding, setDomainBranding] = useState<any[]>([]);
    const [uploadingDomainLogo, setUploadingDomainLogo] = useState<number | null>(null);
    const [emailTestLoading, setEmailTestLoading] = useState(false);

    useEffect(() => {
        loadSettings();
        loadApiKey();
    }, []);

    const loadApiKey = async () => {
        try {
            const res = await api.admin.settings.getApiKey();
            setApiKey(res.apiKey);
        } catch (e) {
            console.error('Failed to load API key', e);
        }
    };

    const handleRegenerateKey = async () => {
        const confirmed = await confirm({
            title: 'Tạo lại API Key?',
            message: 'API Key cũ sẽ không còn hiệu lực. Các ứng dụng đang sử dụng key cũ sẽ bị ngắt kết nối.',
            variant: 'danger',
            confirmText: 'Tạo mới',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;
        setRegenerating(true);
        try {
            const res = await api.admin.settings.regenerateApiKey();
            setApiKey(res.apiKey);
            addToast('Đã tạo API Key mới', 'success');
        } catch (e: any) {
            addToast(e.message || 'Lỗi khi tạo lại Key', 'error');
        } finally {
            setRegenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        addToast('Đã sao chép vào bộ nhớ tạm', 'success');
    };

    const loadSettings = async () => {
        try {
            const res: any = await api.admin.settings.get();
            setSettings(res || {});
            if (res.domain_branding) {
                try {
                    setDomainBranding(JSON.parse(res.domain_branding));
                } catch (e) {
                    setDomainBranding([]);
                }
            }
        } catch (error) {
            console.error('Failed to load settings', error);
            addToast("Không thể tải cài đặt hệ thống.", 'error');
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalSettings = {
                ...settings,
                domain_branding: JSON.stringify(domainBranding)
            };
            await api.admin.settings.update(finalSettings);
            // Refresh global settings context so navbar updates
            await globalUpdateSettings();
            addToast("Cập nhật cài đặt thành công.", 'success');
        } catch (error: any) {
            addToast(error.message || "Không thể lưu cài đặt.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            const result: any = await api.uploads.single(file);
            const url = result?.data?.url;
            if (url) {
                handleChange('site_logo', getMediaUrl(url));
                addToast('Logo đã được tải lên', 'success');
            } else {
                throw new Error('Không nhận được URL từ server');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            addToast(error.message || 'Tải logo thất bại', 'error');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFavicon(true);
        try {
            const result: any = await api.uploads.single(file);
            const url = result?.data?.url;
            if (url) {
                handleChange('site_favicon', getMediaUrl(url));
                addToast('Favicon đã được tải lên', 'success');
            } else {
                throw new Error('Không nhận được URL từ server');
            }
        } catch (error: any) {
            console.error('Favicon upload error:', error);
            addToast(error.message || 'Tải favicon thất bại', 'error');
        } finally {
            setUploadingFavicon(false);
        }
    };

    const handleTestTelegram = async () => {
        setTestLoading(true);
        try {
            await api.admin.settings.testTelegram();
            addToast('Đã gửi tin nhắn thử nghiệm! Vui lòng kiểm tra Telegram của bạn.', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi kiểm tra kết nối', 'error');
        } finally {
            setTestLoading(false);
        }
    };

    const handleTestEmail = async () => {
        setEmailTestLoading(true);
        try {
            const res = await api.admin.settings.testEmail(settings.admin_notification_email);
            addToast(res.message || 'Đã gửi email thử nghiệm thành công!', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi gửi email thử nghiệm', 'error');
        } finally {
            setEmailTestLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Cài đặt hệ thống"
                subtitle="Cấu hình thông tin chung, SEO, và các tích hợp"
                icon={<Settings className="w-8 h-8" />}
            />

            <form onSubmit={handleSave}>
                <div className="grid gap-6">
                    {/* Website Branding */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thương hiệu Website</CardTitle>
                            <CardDescription>
                                Logo và nhận diện thương hiệu hiển thị trên website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Logo Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-foreground">Logo Website (Mặc định)</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.site_logo || ''}
                                        onChange={(e) => handleChange('site_logo', e.target.value)}
                                        placeholder="Nhập URL hoặc tải file lên"
                                        className="flex-1 bg-background"
                                    />
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={uploadingLogo}
                                    >
                                        {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Khuyến nghị PNG, kích thước 200x60px
                                </p>
                                {settings.site_logo && (
                                    <div className="p-4 border border-border rounded-lg bg-[url('/bg-check.png')] bg-muted/20">
                                        <p className="text-[10px] text-muted-foreground mb-2 font-semibold">Preview:</p>
                                        <img
                                            src={settings.site_logo}
                                            alt="Logo preview"
                                            className="max-h-16 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Site Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Tên Website (Mặc định)</label>
                                <Input
                                    value={settings.site_name || ''}
                                    onChange={(e) => handleChange('site_name', e.target.value)}
                                    placeholder="Tulie Academy"
                                    className="bg-background"
                                />
                                <div className="flex items-center gap-2 mt-2 font-semibold">
                                    <Switch
                                        id="show_site_name"
                                        checked={settings.show_site_name === 'true'}
                                        onCheckedChange={(checked) => handleChange('show_site_name', checked ? 'true' : 'false')}
                                    />
                                    <label htmlFor="show_site_name" className="text-sm cursor-pointer select-none">
                                        Hiển thị tên website cạnh Logo
                                    </label>
                                </div>
                            </div>

                            {/* Favicon Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Favicon (Mặc định)</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.site_favicon || ''}
                                        onChange={(e) => handleChange('site_favicon', e.target.value)}
                                        placeholder="Nhập URL hoặc tải file lên"
                                        className="flex-1"
                                    />
                                    <input
                                        ref={faviconInputRef}
                                        type="file"
                                        accept="image/*,.ico"
                                        className="hidden"
                                        onChange={handleFaviconUpload}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => faviconInputRef.current?.click()}
                                        disabled={uploadingFavicon}
                                    >
                                        {uploadingFavicon ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Khuyến nghị ICO hoặc PNG, kích thước 32x32px
                                </p>
                                {settings.site_favicon && (
                                    <div className="p-4 border border-border rounded-lg inline-flex items-center gap-2 bg-[url('/bg-check.png')] bg-muted/20">
                                        <p className="text-[10px] text-muted-foreground font-semibold">Preview:</p>
                                        <img
                                            src={settings.site_favicon}
                                            alt="Favicon preview"
                                            className="h-12 w-12 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <hr className="my-6" />

                            {/* Multi-domain Branding */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-semibold text-foreground">Cấu hình Đa tên miền</label>
                                        <p className="text-xs text-muted-foreground">Tự động đổi Logo & Tên theo tên miền truy cập.</p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="border-border font-semibold"
                                        onClick={() => setDomainBranding([...domainBranding, { domain: '', logo_url: '', site_name: '' }])}
                                    >
                                        Thêm tên miền
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {domainBranding.map((db, idx) => (
                                        <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-4 relative group">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setDomainBranding(domainBranding.filter((_, i) => i !== idx))}
                                            >
                                                Xóa
                                            </Button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-muted-foreground">Tên miền (Host)</label>
                                                    <Input
                                                        value={db.domain}
                                                        onChange={(e) => {
                                                            const newDB = [...domainBranding];
                                                            newDB[idx].domain = e.target.value;
                                                            setDomainBranding(newDB);
                                                        }}
                                                        onBlur={(e) => {
                                                            const normalized = e.target.value.toLowerCase()
                                                                .replace(/^(https?:\/\/)?(www\.)?/, '')
                                                                .replace(/\/$/, '');
                                                            if (normalized !== e.target.value) {
                                                                const newDB = [...domainBranding];
                                                                newDB[idx].domain = normalized;
                                                                setDomainBranding(newDB);
                                                            }
                                                        }}
                                                        placeholder="thelab.tulie.vn"
                                                        className="bg-background"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-muted-foreground">Tên hiển thị</label>
                                                    <Input
                                                        value={db.site_name}
                                                        onChange={(e) => {
                                                            const newDB = [...domainBranding];
                                                            newDB[idx].site_name = e.target.value;
                                                            setDomainBranding(newDB);
                                                        }}
                                                        placeholder="The Lab Tulie"
                                                        className="bg-background"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted-foreground">Logo URL</label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={db.logo_url}
                                                        onChange={(e) => {
                                                            const newDB = [...domainBranding];
                                                            newDB[idx].logo_url = e.target.value;
                                                            setDomainBranding(newDB);
                                                        }}
                                                        placeholder="https://..."
                                                        className="bg-background"
                                                    />
                                                    <input
                                                        id={`domain-logo-${idx}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setUploadingDomainLogo(idx);
                                                            try {
                                                                const result: any = await api.uploads.single(file);
                                                                if (result?.data?.url) {
                                                                    const newDB = [...domainBranding];
                                                                    newDB[idx].logo_url = getMediaUrl(result.data.url);
                                                                    setDomainBranding(newDB);
                                                                }
                                                            } catch (err) {
                                                                addToast('Lỗi tải ảnh', 'error');
                                                            } finally {
                                                                setUploadingDomainLogo(null);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => document.getElementById(`domain-logo-${idx}`)?.click()}
                                                        disabled={uploadingDomainLogo === idx}
                                                    >
                                                        {uploadingDomainLogo === idx ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                    </Button>
                                                </div>

                                                {db.logo_url && (
                                                    <div className="mt-2 p-3 border border-border rounded-lg bg-[url('/bg-check.png')] bg-muted/20 inline-flex items-center gap-3">
                                                        <span className="text-[10px] text-muted-foreground tracking-tight font-semibold">Preview:</span>
                                                        <div className="p-1.5 rounded overflow-hidden">
                                                            <img
                                                                src={db.logo_url}
                                                                alt="Logo preview"
                                                                className="max-h-8 object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {domainBranding.length === 0 && (
                                        <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm">
                                            Chưa có cấu hình tên miền riêng. Sử dụng mặc định.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin liên hệ (Public)</CardTitle>
                            <CardDescription>
                                Các thông tin này sẽ hiển thị trên trang Liên hệ và Footer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hotline (Hiển thị)</label>
                                <Input
                                    value={settings.contact_hotline || ''}
                                    onChange={(e) => handleChange('contact_hotline', e.target.value)}
                                    placeholder="Ví dụ: 1900 1234"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Zalo (SĐT hoặc Link)</label>
                                <Input
                                    value={settings.contact_zalo || ''}
                                    onChange={(e) => handleChange('contact_zalo', e.target.value)}
                                    placeholder="Ví dụ: 0912345678"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email liên hệ (Public)</label>
                                <Input
                                    value={settings.contact_email_public || ''}
                                    onChange={(e) => handleChange('contact_email_public', e.target.value)}
                                    placeholder="Ví dụ: contact@academy.com"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Cấu hình Admin & Thông báo
                            </CardTitle>
                            <CardDescription>
                                Cấu hình email và thông báo để nhận tin từ hệ thống.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email nhận thông báo Admin</label>
                                <Input
                                    value={settings.admin_notification_email || ''}
                                    onChange={(e) => handleChange('admin_notification_email', e.target.value)}
                                    placeholder="Email để nhận thông báo đơn hàng, contact..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Redundant SMTP section removed - moved to /admin/emails */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📧 Cấu hình Email & SMTP
                            </CardTitle>
                            <CardDescription>
                                Thiết lập máy chủ gửi email và quản lý template email.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-dashed rounded-xl bg-muted/20">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Cấu hình SMTP đã được chuyển đi</p>
                                    <p className="text-xs text-muted-foreground">Để quản lý cấu hình gửi email chuyên sâu hơn, vui lòng truy cập trang Email.</p>
                                </div>
                                <Link href="/admin/emails">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Mail className="w-4 h-4" />
                                        Đi tới cài đặt Email
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Thông báo Telegram
                            </CardTitle>
                            <CardDescription>
                                Cấu hình Bot Telegram để nhận thông báo tức thì về các hoạt động trên hệ thống.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Bot Token</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="password"
                                            value={settings.telegram_bot_token || ''}
                                            onChange={(e) => handleChange('telegram_bot_token', e.target.value)}
                                            placeholder="7890123456:AA..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleTestTelegram}
                                            disabled={testLoading || !settings.telegram_bot_token}
                                            className="whitespace-nowrap flex items-center gap-1"
                                        >
                                            {testLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={14} />}
                                            <span className="hidden sm:inline">Thử</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Chat ID</label>
                                    <Input
                                        value={settings.telegram_chat_id || ''}
                                        onChange={(e) => handleChange('telegram_chat_id', e.target.value)}
                                        placeholder="-100..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h4 className="text-xs font-bold text-muted-foreground">Các loại thông báo</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-bold block truncate">Đơn hàng & Thanh toán</label>
                                                <p className="text-[10px] text-muted-foreground">Thông báo đơn hàng mới hoặc giao dịch thành công.</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_orders === 'true'}
                                                onCheckedChange={(checked) => handleChange('telegram_notify_orders', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="space-y-2 mt-auto">
                                            <label className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                                                Mẫu tin nhắn (HTML):
                                                <div className="group relative">
                                                    <Info size={12} className="text-muted-foreground cursor-help" />
                                                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-[9px] rounded-md shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                        Biến khả dụng: {"{{code}}, {{customer}}, {{amount}}, {{status}}, {{items}}, {{academy}}"}
                                                    </div>
                                                </div>
                                            </label>
                                            <Textarea
                                                value={settings.telegram_template_order || DEFAULT_TEMPLATES.telegram_template_order}
                                                onChange={(e) => handleChange('telegram_template_order', e.target.value)}
                                                placeholder="Nhập mẫu tin nhắn..."
                                                className="text-xs font-mono h-24"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-semibold text-foreground block truncate">Đăng ký thành viên</label>
                                                <p className="text-[10px] text-muted-foreground">Thông báo khi có tài khoản mới đăng ký.</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_registrations === 'true'}
                                                onCheckedChange={(checked) => handleChange('telegram_notify_registrations', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="space-y-2 mt-auto">
                                            <label className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                                                Mẫu tin nhắn (HTML):
                                                <div className="group relative">
                                                    <Info size={12} className="text-muted-foreground cursor-help" />
                                                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-[9px] rounded-md shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                        Biến khả dụng: {"{{name}}, {{email}}, {{time}}, {{academy}}"}
                                                    </div>
                                                </div>
                                            </label>
                                            <Textarea
                                                value={settings.telegram_template_registration || DEFAULT_TEMPLATES.telegram_template_registration}
                                                onChange={(e) => handleChange('telegram_template_registration', e.target.value)}
                                                placeholder="Nhập mẫu tin nhắn..."
                                                className="text-xs font-mono h-24"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-semibold text-foreground block truncate">Cảnh báo bảo mật</label>
                                                <p className="text-[10px] text-muted-foreground">Thông báo đăng nhập lỗi hoặc truy cập lạ.</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_security === 'true'}
                                                onCheckedChange={(checked) => handleChange('telegram_notify_security', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="space-y-2 mt-auto">
                                            <label className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                                Mẫu tin nhắn (HTML):
                                                <div className="group relative">
                                                    <Info size={12} className="text-muted-foreground cursor-help" />
                                                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-[9px] rounded-md shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                        Biến khả dụng: {"{{action}}, {{details}}, {{ip}}, {{time}}, {{academy}}"}
                                                    </div>
                                                </div>
                                            </label>
                                            <Textarea
                                                value={settings.telegram_template_security || DEFAULT_TEMPLATES.telegram_template_security}
                                                onChange={(e) => handleChange('telegram_template_security', e.target.value)}
                                                placeholder="Nhập mẫu tin nhắn..."
                                                className="text-xs font-mono h-24"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-semibold text-foreground block truncate">Báo cáo & Nhắc nhở</label>
                                                <p className="text-[10px] text-muted-foreground">Cảnh báo đơn pending và học viên "ngủ đông".</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_reports === 'true'}
                                                onCheckedChange={(checked) => handleChange('telegram_notify_reports', checked ? 'true' : 'false')}
                                            />
                                        </div>

                                        {settings.telegram_notify_reports === 'true' && (
                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-muted-foreground">Tần suất (Giờ)</label>
                                                    <Input
                                                        type="number"
                                                        value={settings.telegram_report_frequency || '12'}
                                                        onChange={(e) => handleChange('telegram_report_frequency', e.target.value)}
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-muted-foreground">Giờ gửi (HH:mm)</label>
                                                    <Input
                                                        type="text"
                                                        value={settings.telegram_report_time || ''}
                                                        onChange={(e) => handleChange('telegram_report_time', e.target.value)}
                                                        placeholder="08:00"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <p className="col-span-2 text-[9px] text-muted-foreground italic font-inter">
                                                    * Nếu nhập Giờ gửi, Tần suất sẽ bị bỏ qua.
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-2 mt-auto">
                                            <label className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                                                Mẫu báo cáo (HTML):
                                                <div className="group relative">
                                                    <Info size={12} className="text-muted-foreground cursor-help" />
                                                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-[9px] rounded-md shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                        Biến khả dụng: {"{{title}}, {{revenue}}, {{paidOrders}}, {{totalOrders}}, {{newUsers}}, {{pendingOrders}}, {{inactiveUsers}}, {{securityRisks}}, {{systemStatus}}, {{time}}, {{academy}}"}
                                                    </div>
                                                </div>
                                            </label>
                                            <Textarea
                                                value={settings.telegram_template_report || DEFAULT_TEMPLATES.telegram_template_report}
                                                onChange={(e) => handleChange('telegram_template_report', e.target.value)}
                                                placeholder="Nhập mẫu tin nhắn..."
                                                className="text-xs font-mono h-32"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" /> Kết nối CRM & API
                            </CardTitle>
                            <CardDescription>
                                Sử dụng API Key này để kết nối với các hệ thống CRM bên ngoài (ví dụ: Zoho, HubSpot).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CRM API Key</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            type="text"
                                            readOnly
                                            value={apiKey || '••••••••••••••••••••••••••••••••'}
                                            className="font-inter text-xs pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleRegenerateKey}
                                        disabled={regenerating}
                                        className="gap-2"
                                    >
                                        <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
                                        <span>Làm mới</span>
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Giữ API Key này an toàn. Bạn có thể sử dụng endpoint <code>/api/crm/sync-order</code> để đồng bộ dữ liệu.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu cấu hình
                        </Button>
                    </div>
                </div >
            </form >
        </div >
    );
}
