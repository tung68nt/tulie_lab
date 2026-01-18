'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        birthDate: '',
        address: '',
        city: '',
        occupation: '',
        company: '',
        allowEmailMarketing: true,
        allowSMSMarketing: false
    });

    // Avatar refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile: any = await api.users.getProfile();
                setUser(profile);
                setFormData({
                    name: profile.name || '',
                    phone: profile.phone || '',
                    birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
                    address: profile.address || '',
                    city: profile.city || '',
                    occupation: profile.occupation || '',
                    company: profile.company || '',
                    allowEmailMarketing: profile.allowEmailMarketing ?? true,
                    allowSMSMarketing: profile.allowSMSMarketing ?? false
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            setSaving(true);
            await api.users.updateProfile({
                ...formData,
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null
            });
            addToast('Cập nhật thông tin thành công', 'success');

            // Dispatch event to update Navbar
            window.dispatchEvent(new Event('auth-change'));

            // Update local state
            setUser({ ...user, ...formData });
        } catch (error) {
            console.error(error);
            addToast('Có lỗi xảy ra', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            addToast('File quá lớn (max 5MB)', 'error');
            return;
        }

        try {
            // Upload file
            const uploadRes = await api.uploads.single(file);

            if (uploadRes.success) {
                const avatarUrl = uploadRes.file.url;

                // Update profile with new avatar
                await api.users.updateProfile({ avatar: avatarUrl });

                // Update local state
                setUser({ ...user, avatar: avatarUrl });

                // Dispatch event for other components (Navbar)
                window.dispatchEvent(new Event('auth-change'));

                addToast('Cập nhật avatar thành công', 'success');
            }
        } catch (error) {
            console.error(error);
            addToast('Upload thất bại', 'error');
        } finally {
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
    );

    if (!user) return <div className="container py-10">Vui lòng đăng nhập</div>;

    return (
        <div className="container py-10 max-w-2xl min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>

            <div className="grid gap-6">
                {/* Avatar Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ảnh đại diện</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div
                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="text-white font-medium text-sm">Đổi ảnh</span>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Tải ảnh mới
                        </Button>
                    </CardContent>
                </Card>

                {/* Basic Info Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <Input value={user.email} disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Họ tên</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập họ tên của bạn"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Số điện thoại</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0901234567"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Ngày sinh</label>
                                <Input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Address & Work Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Địa chỉ & Công việc</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Địa chỉ</label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Số nhà, đường, quận/huyện"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Thành phố</label>
                            <Input
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="TP. Hồ Chí Minh"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Nghề nghiệp</label>
                                <Input
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    placeholder="Developer, Designer..."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Công ty</label>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Tên công ty"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end mb-20">
                    <Button onClick={handleUpdateProfile} disabled={saving} size="lg">
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
