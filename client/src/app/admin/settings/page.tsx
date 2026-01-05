'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Upload } from 'lucide-react';
import { Switch } from '@/components/Switch';

export default function AdminSettingsPage() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadSettings();
    }, []);

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
            handleChange('site_logo', result.file.url);
            addToast('Logo đã được tải lên', 'success');
        } catch (error: any) {
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
            handleChange('site_favicon', result.file.url);
            addToast('Favicon đã được tải lên', 'success');
        } catch (error: any) {
            addToast(error.message || 'Tải favicon thất bại', 'error');
        } finally {
            setUploadingFavicon(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
                    <p className="text-muted-foreground">Quản lý các thông số hệ thống và thông tin liên hệ.</p>
                </div>
            </div>

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
                            <CardTitle>Cấu hình Admin</CardTitle>
                            <CardDescription>
                                Cấu hình nhận thông báo hệ thống.
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

                    <div className="flex justify-end">
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
