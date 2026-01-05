'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';

interface FooterLink {
    label: string;
    href: string;
}

interface SocialLink {
    platform: string;
    url: string;
    icon?: string;
}

interface FooterData {
    companyName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
    logoUrl: string;
    quickLinks: FooterLink[];
    policyLinks: FooterLink[];
    socialLinks: SocialLink[];
    certificationImage: string;
    certificationLink: string;
    copyrightText: string;
}

const defaultFooterData: FooterData = {
    companyName: 'The Tulie Lab',
    tagline: 'Giải pháp đào tạo và phát triển năng lực với AI',
    address: 'Tầng 2 Tòa A Chelsea Residences, 48 Trần Kim Xuyến, Cầu Giấy, Hà Nội',
    phone: '0978.863.775',
    email: 'support@tulielab.vn',
    taxId: '',
    logoUrl: '/images/logo.png',
    quickLinks: [
        { label: 'Về chúng tôi', href: '/about' },
        { label: 'Các khóa học', href: '/courses' },
        { label: 'Giảng viên', href: '/instructors' },
        { label: 'Blog & Bài viết', href: '/blog' },
        { label: 'Liên hệ', href: '/contact' },
    ],
    policyLinks: [
        { label: 'Điều khoản sử dụng', href: '/terms' },
        { label: 'Chính sách bảo mật', href: '/privacy' },
        { label: 'Chính sách hoàn tiền', href: '/refund' },
        { label: 'Hướng dẫn thanh toán', href: '/payment-guide' },
    ],
    socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/tulielab', icon: 'facebook' },
        { platform: 'YouTube', url: 'https://youtube.com/@tulielab', icon: 'youtube' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/tulielab', icon: 'linkedin' },
        { platform: 'TikTok', url: 'https://tiktok.com/@tulielab', icon: 'tiktok' },
    ],
    certificationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bo_Cong_Thuong_Vietnam.svg/200px-Bo_Cong_Thuong_Vietnam.svg.png',
    certificationLink: 'http://online.gov.vn/',
    copyrightText: 'The Tulie Lab. Bảo lưu mọi quyền.',
};

// Social Icons Helper
const SocialIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'facebook':
            return (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        case 'youtube':
            return (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
        case 'linkedin':
            return (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            );
        case 'tiktok':
            return (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
            );
        case 'instagram':
            return (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            );
        case 'twitter':
            return (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
        default:
            return null;
    }
};

export default function AdminFooterPage() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);

    // Temporary states for adding new items
    const [newQuickLink, setNewQuickLink] = useState({ label: '', href: '' });
    const [newPolicyLink, setNewPolicyLink] = useState({ label: '', href: '' });
    const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', icon: 'facebook' });

    useEffect(() => {
        const loadFooterData = async () => {
            try {
                const cms = await api.cms.get(['footer_settings']) as any;
                if (cms && cms.footer_settings) {
                    setFooterData(JSON.parse(cms.footer_settings));
                }
            } catch (e) {
                console.error('Failed to load footer data:', e);
            } finally {
                setLoading(false);
            }
        };
        loadFooterData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.admin.cms.update({
                key: 'footer_settings',
                value: JSON.stringify(footerData),
                type: 'json'
            });
            addToast('Đã lưu cài đặt footer!', 'success');
        } catch (e) {
            console.error(e);
            addToast('Lưu thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Quick Links handlers
    const addQuickLink = () => {
        if (newQuickLink.label && newQuickLink.href) {
            setFooterData(prev => ({
                ...prev,
                quickLinks: [...prev.quickLinks, { ...newQuickLink }]
            }));
            setNewQuickLink({ label: '', href: '' });
        }
    };

    const removeQuickLink = (index: number) => {
        setFooterData(prev => ({
            ...prev,
            quickLinks: prev.quickLinks.filter((_, i) => i !== index)
        }));
    };

    // Policy Links handlers
    const addPolicyLink = () => {
        if (newPolicyLink.label && newPolicyLink.href) {
            setFooterData(prev => ({
                ...prev,
                policyLinks: [...prev.policyLinks, { ...newPolicyLink }]
            }));
            setNewPolicyLink({ label: '', href: '' });
        }
    };

    const removePolicyLink = (index: number) => {
        setFooterData(prev => ({
            ...prev,
            policyLinks: prev.policyLinks.filter((_, i) => i !== index)
        }));
    };

    // Social Links handlers
    const addSocialLink = () => {
        if (newSocialLink.platform && newSocialLink.url) {
            setFooterData(prev => ({
                ...prev,
                socialLinks: [...prev.socialLinks, { ...newSocialLink }]
            }));
            setNewSocialLink({ platform: '', url: '', icon: 'facebook' });
        }
    };

    const removeSocialLink = (index: number) => {
        setFooterData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-pulse text-muted-foreground">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý Footer</h1>
                    <p className="text-muted-foreground">Thay đổi thông tin hiển thị ở cuối trang</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Company Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin công ty</CardTitle>
                        <CardDescription>Tên, mô tả và thông tin liên hệ</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên công ty</label>
                            <Input
                                value={footerData.companyName}
                                onChange={e => setFooterData({ ...footerData, companyName: e.target.value })}
                                placeholder="Tên công ty"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mô tả ngắn (Tagline)</label>
                            <Input
                                value={footerData.tagline}
                                onChange={e => setFooterData({ ...footerData, tagline: e.target.value })}
                                placeholder="Mô tả ngắn về công ty"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Địa chỉ</label>
                            <Input
                                value={footerData.address}
                                onChange={e => setFooterData({ ...footerData, address: e.target.value })}
                                placeholder="Địa chỉ văn phòng"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số điện thoại</label>
                                <Input
                                    value={footerData.phone}
                                    onChange={e => setFooterData({ ...footerData, phone: e.target.value })}
                                    placeholder="0xxx.xxx.xxx"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    value={footerData.email}
                                    onChange={e => setFooterData({ ...footerData, email: e.target.value })}
                                    placeholder="email@domain.com"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Logo URL</label>
                                <Input
                                    value={footerData.logoUrl || ''}
                                    onChange={e => setFooterData({ ...footerData, logoUrl: e.target.value })}
                                    placeholder="/images/logo.png hoặc https://..."
                                />
                                {footerData.logoUrl && (
                                    <div className="mt-2 inline-block">
                                        <div className="text-[10px] text-muted-foreground mb-1">Preview:</div>
                                        <img
                                            src={footerData.logoUrl}
                                            alt="Company Logo"
                                            className="h-12 object-contain"
                                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mã số thuế</label>
                                <Input
                                    value={footerData.taxId || ''}
                                    onChange={e => setFooterData({ ...footerData, taxId: e.target.value })}
                                    placeholder="0123456789"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Copyright</label>
                            <Input
                                value={footerData.copyrightText}
                                onChange={e => setFooterData({ ...footerData, copyrightText: e.target.value })}
                                placeholder="© 2026 Tên công ty"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Certification Badge */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chứng nhận Bộ Công Thương</CardTitle>
                        <CardDescription>Badge xác nhận đã đăng ký với Bộ Công Thương</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL ảnh chứng nhận</label>
                            <Input
                                value={footerData.certificationImage}
                                onChange={e => setFooterData({ ...footerData, certificationImage: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link khi click vào ảnh</label>
                            <Input
                                value={footerData.certificationLink}
                                onChange={e => setFooterData({ ...footerData, certificationLink: e.target.value })}
                                placeholder="http://online.gov.vn/..."
                            />
                        </div>
                        {footerData.certificationImage && (
                            <div className="pt-4">
                                <p className="text-sm text-muted-foreground mb-2">Xem trước:</p>
                                <a href={footerData.certificationLink} target="_blank" rel="noopener noreferrer" className="inline-block">
                                    <img
                                        src={footerData.certificationImage}
                                        alt="Chứng nhận Bộ Công Thương"
                                        className="h-16 object-contain hover:opacity-80 transition-opacity"
                                    />
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liên kết nhanh</CardTitle>
                        <CardDescription>Menu điều hướng chính</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Existing links */}
                        <div className="space-y-2">
                            {footerData.quickLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                                    <span className="flex-1 text-sm">{link.label}</span>
                                    <span className="text-xs text-muted-foreground">{link.href}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeQuickLink(index)}
                                        className="text-black hover:bg-black hover:text-white h-7 w-7 p-0 border border-black rounded transition-colors"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {/* Add new */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Tên hiển thị"
                                value={newQuickLink.label}
                                onChange={e => setNewQuickLink({ ...newQuickLink, label: e.target.value })}
                                className="flex-1"
                            />
                            <Input
                                placeholder="/duong-dan"
                                value={newQuickLink.href}
                                onChange={e => setNewQuickLink({ ...newQuickLink, href: e.target.value })}
                                className="flex-1"
                            />
                            <Button variant="outline" onClick={addQuickLink}>+</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Policy Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chính sách</CardTitle>
                        <CardDescription>Liên kết đến các trang chính sách</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Existing links */}
                        <div className="space-y-2">
                            {footerData.policyLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                                    <span className="flex-1 text-sm">{link.label}</span>
                                    <span className="text-xs text-muted-foreground">{link.href}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removePolicyLink(index)}
                                        className="text-black hover:bg-black hover:text-white h-7 w-7 p-0 border border-black rounded transition-colors"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {/* Add new */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Tên hiển thị"
                                value={newPolicyLink.label}
                                onChange={e => setNewPolicyLink({ ...newPolicyLink, label: e.target.value })}
                                className="flex-1"
                            />
                            <Input
                                placeholder="/duong-dan"
                                value={newPolicyLink.href}
                                onChange={e => setNewPolicyLink({ ...newPolicyLink, href: e.target.value })}
                                className="flex-1"
                            />
                            <Button variant="outline" onClick={addPolicyLink}>+</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Mạng xã hội</CardTitle>
                        <CardDescription>Liên kết đến các kênh social media</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Existing links */}
                        <div className="grid gap-2 md:grid-cols-2">
                            {footerData.socialLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 rounded border bg-muted/30">
                                    <span className="text-lg">
                                        {/* Icons removed per request */}
                                    </span>
                                    <span className="font-medium flex-1">{link.platform}</span>
                                    <span className="text-xs text-muted-foreground">{link.url}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSocialLink(index)}
                                        className="text-black hover:bg-black hover:text-white h-7 w-7 p-0 border border-black rounded transition-colors"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {/* Add new */}
                        <div className="flex gap-2 flex-wrap">
                            <select
                                value={newSocialLink.icon}
                                onChange={e => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            >
                                <option value="facebook">Facebook</option>
                                <option value="youtube">YouTube</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="tiktok">TikTok</option>
                                <option value="instagram">Instagram</option>
                                <option value="twitter">Twitter/X</option>
                            </select>
                            <Input
                                placeholder="Tên (VD: Facebook Page)"
                                value={newSocialLink.platform}
                                onChange={e => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                                className="flex-1 min-w-[150px]"
                            />
                            <Input
                                placeholder="https://..."
                                value={newSocialLink.url}
                                onChange={e => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                                className="flex-1 min-w-[200px]"
                            />
                            <Button variant="outline" onClick={addSocialLink}>+ Thêm</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
