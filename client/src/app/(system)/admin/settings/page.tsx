'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Upload, Send, Key, RefreshCw, Copy, Check } from 'lucide-react';
import { Switch } from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function AdminSettingsPage() {
    const { addToast } = useToast();
    const { updateSettings: globalUpdateSettings } = useSettings();
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
        if (!confirm('Tạo lại API Key? Key cũ sẽ không còn hiệu lực.')) return;
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
            await api.admin.settings.update(settings);
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
                handleChange('site_logo', url);
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
                handleChange('site_favicon', url);
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

    if (fetching) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Cài đặt hệ thống"
                subtitle="Quản lý các thông số hệ thống và thông tin liên hệ."
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
                                <label className="text-sm font-medium">Logo Website</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={settings.site_logo || ''}
                                        onChange={(e) => handleChange('site_logo', e.target.value)}
                                        placeholder="Nhập URL hoặc tải file lên"
                                        className="flex-1"
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
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
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
                                <label className="text-sm font-medium">Tên Website</label>
                                <Input
                                    value={settings.site_name || ''}
                                    onChange={(e) => handleChange('site_name', e.target.value)}
                                    placeholder="Academy Tulie"
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <Switch
                                        id="show_site_name"
                                        checked={settings.show_site_name === 'true'}
                                        onChange={(checked) => handleChange('show_site_name', checked ? 'true' : 'false')}
                                    />
                                    <label htmlFor="show_site_name" className="text-sm cursor-pointer select-none" onClick={() => handleChange('show_site_name', settings.show_site_name === 'true' ? 'false' : 'true')}>
                                        Hiển thị tên website cạnh Logo
                                    </label>
                                </div>
                            </div>

                            {/* Favicon Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Favicon</label>
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
                                    <div className="p-4 border rounded-lg inline-flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">Preview:</p>
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
                            <CardTitle>Cấu hình Admin & Thanh toán</CardTitle>
                            <CardDescription>
                                Cấu hình nhận thông báo và cổng thanh toán SePay.
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

                            <hr className="my-4" />

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold">Cấu hình SePay (Đồng bộ giao dịch)</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">SePay API Key</label>
                                        <Input
                                            type="password"
                                            value={settings.SEPAY_API_KEY || ''}
                                            onChange={(e) => handleChange('SEPAY_API_KEY', e.target.value)}
                                            placeholder="Lấy từ sepay.vn -> Cài đặt API"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Key này dùng để gọi API đồng bộ giao dịch thủ công.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Số tài khoản ngân hàng</label>
                                        <Input
                                            value={settings.bank_account_no || ''}
                                            onChange={(e) => handleChange('bank_account_no', e.target.value)}
                                            placeholder="Ví dụ: 104002106705"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Số tài khoản dùng để lọc giao dịch khi đồng bộ.</p>
                                    </div>
                                </div>
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
                                <h4 className="text-xs font-bold tracking-wider text-muted-foreground">Các loại thông báo</h4>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Groups settings but shows more info */}
                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-bold block truncate">Đơn hàng & Thanh toán</label>
                                                <p className="text-[10px] text-muted-foreground">Thông báo đơn hàng mới hoặc giao dịch thành công.</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_orders === 'true'}
                                                onChange={(checked) => handleChange('telegram_notify_orders', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="mt-auto bg-muted/50 p-3 rounded-lg border border-dashed text-[10px] font-mono text-muted-foreground leading-relaxed">
                                            <p className="font-bold text-blue-500 mb-1">Mẫu tin nhắn:</p>
                                            🔔 <b>Đơn hàng mới!</b><br />
                                            Mã: <code>#ABC123</code><br />
                                            Khách: Nguyễn Văn A<br />
                                            Tiền: 500.000 ₫
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-bold block truncate">Đăng ký thành viên</label>
                                                <p className="text-[10px] text-muted-foreground">Thông báo khi có tài khoản mới đăng ký.</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_registrations === 'true'}
                                                onChange={(checked) => handleChange('telegram_notify_registrations', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="mt-auto bg-muted/50 p-3 rounded-lg border border-dashed text-[10px] font-mono text-muted-foreground leading-relaxed">
                                            <p className="font-bold text-blue-500 mb-1">Mẫu tin nhắn:</p>
                                            👤 <b>Thành viên mới!</b><br />
                                            Tên: Nguyễn Văn A<br />
                                            Email: user@example.com
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-bold block truncate">Cảnh báo bảo mật</label>
                                                <p className="text-[10px] text-muted-foreground">Thông báo đăng nhập lỗi hoặc truy cập lạ.</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_security === 'true'}
                                                onChange={(checked) => handleChange('telegram_notify_security', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="mt-auto bg-muted/50 p-3 rounded-lg border border-dashed text-[10px] font-mono text-muted-foreground leading-relaxed">
                                            <p className="font-bold text-red-500 mb-1">Mẫu tin nhắn:</p>
                                            ⚠️ <b>Cảnh báo Bảo mật!</b><br />
                                            Hành vi: FAILED_LOGIN<br />
                                            IP: <code>1.2.3.4</code>
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded-xl space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-0.5 min-w-0">
                                                <label className="text-sm font-bold block truncate">Báo cáo & Nhắc nhở</label>
                                                <p className="text-[10px] text-muted-foreground">Cảnh báo đơn pending và học viên "ngủ đông".</p>
                                            </div>
                                            <Switch
                                                checked={settings.telegram_notify_reports === 'true'}
                                                onChange={(checked) => handleChange('telegram_notify_reports', checked ? 'true' : 'false')}
                                            />
                                        </div>
                                        <div className="mt-auto bg-muted/50 p-3 rounded-lg border border-dashed text-[10px] font-mono text-muted-foreground leading-relaxed">
                                            <p className="font-bold text-amber-500 mb-1">Mẫu tin nhắn:</p>
                                            📊 <b>Báo cáo định kỳ</b><br />
                                            ⏳ <b>Đơn pending:</b> 5 đơn<br />
                                            😴 <b>Nghỉ học lâu:</b> 12 người (&gt;14d)
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
                                            className="font-mono text-xs pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
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
                </div>
            </form>
        </div>
    );
}
