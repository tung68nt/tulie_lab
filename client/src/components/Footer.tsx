'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { MapPin, Phone, Mail, FileText } from 'lucide-react';

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
    taxId?: string;
    logoUrl?: string;
    quickLinks: FooterLink[];
    policyLinks: FooterLink[];
    socialLinks: SocialLink[];
    certificationImage: string;
    certificationLink: string;
    copyrightText: string;
}

const defaultFooterData: FooterData = {
    companyName: 'CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE',
    tagline: 'Giải pháp đào tạo và phát triển năng lực với AI',
    address: 'Tầng 4, Tòa nhà SHG, Số 8 Quang Trung, Phường Hà Đông, Thành phố Hà Nội, Việt Nam',
    phone: '098.898.4554',
    email: 'support@tulielab.vn',
    taxId: '0110386298',
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
    ],
    certificationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bo_Cong_Thuong_Vietnam.svg/200px-Bo_Cong_Thuong_Vietnam.svg.png',
    certificationLink: 'http://online.gov.vn/',
    copyrightText: 'The Tulie Lab. Bảo lưu mọi quyền.',
};

// Social Icons
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

export function Footer() {
    const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);

    useEffect(() => {
        const loadFooterData = async () => {
            try {
                const cms = await api.cms.get(['footer_settings']) as any;
                if (cms && cms.footer_settings) {
                    setFooterData(JSON.parse(cms.footer_settings));
                }
            } catch (e) {
                // Use defaults if CMS fails
            }
        };
        loadFooterData();
    }, []);

    return (
        <footer className="border-t bg-background">
            <div className="container py-12 md:py-16">
                {footerData.logoUrl && (
                    <div className="mb-4">
                        <img src={footerData.logoUrl} alt={footerData.companyName} className="h-10 w-auto object-contain" />
                    </div>
                )}
                <div className="grid gap-8 md:grid-cols-5">
                    {/* Left - Company Info */}
                    <div className="space-y-4 md:col-span-2">

                        <h3 className="text-sm font-bold uppercase tracking-wide">{footerData.companyName}</h3>
                        <p className="text-sm text-muted-foreground">
                            {footerData.tagline}
                        </p>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p className="flex items-start gap-3">
                                <MapPin size={18} className="shrink-0 text-foreground/70" />
                                <span>{footerData.address}</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone size={18} className="shrink-0 text-foreground/70" />
                                <a href={`tel:${footerData.phone.replace(/\./g, '')}`} className="hover:text-foreground transition-colors">
                                    {footerData.phone}
                                </a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail size={18} className="shrink-0 text-foreground/70" />
                                <a href={`mailto:${footerData.email}`} className="hover:text-foreground transition-colors">
                                    {footerData.email}
                                </a>
                            </p>
                            {footerData.taxId && (
                                <p className="flex items-center gap-3">
                                    <FileText size={18} className="shrink-0 text-foreground/70" />
                                    <span>{footerData.taxId}</span>
                                </p>
                            )}
                        </div>
                        {/* Certification Badge */}
                        {footerData.certificationImage && (
                            <div className="pt-2">
                                <a href={footerData.certificationLink} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={footerData.certificationImage}
                                        alt="Đã thông báo Bộ Công Thương"
                                        className="h-16 object-contain hover:opacity-80 transition-opacity"
                                    />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Middle - Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold tracking-wide">Liên kết</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {footerData.quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-foreground transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right - Policies */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold tracking-wide">Chính sách</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {footerData.policyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-foreground transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold tracking-wide">Theo dõi The Tulie Lab</h4>
                        <div className="flex flex-wrap gap-3">
                            {footerData.socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                                    title={link.platform}
                                >
                                    <SocialIcon type={link.icon || 'facebook'} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Copyright only */}
                <div className="mt-12 pt-6 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} {footerData.copyrightText}
                    </p>
                </div>
            </div>
        </footer>
    );
}
