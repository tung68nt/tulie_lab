'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';
import { AdminGuard } from '@/components/AdminGuard';
import { ChevronDown, ChevronRight, LayoutDashboard, ScrollText, ShoppingBag, Settings, BookOpen, Palette, Megaphone } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    type NavGroup = {
        title?: string;
        icon?: any;
        items: {
            href: string;
            label: string;
            exact?: boolean;
        }[];
    };

    const navGroups: NavGroup[] = [
        {
            items: [
                { href: '/admin', label: 'Tổng quan', exact: true },
            ]
        },
        {
            title: 'Whiteboard',
            icon: Palette,
            items: [
                { href: '/whiteboard', label: 'Bảng vẽ của tôi' },
                { href: '/admin/whiteboards', label: 'Quản lý & Thống kê' },
            ]
        },
        {
            title: 'LMS (Đào tạo)',
            icon: BookOpen,
            items: [
                { href: '/admin/courses', label: 'Khóa học' },
                { href: '/admin/bundles', label: 'Combo / Bundle' },
                { href: '/admin/categories', label: 'Chuyên mục' },
                { href: '/admin/ebooks', label: 'Ebooks' },
                { href: '/admin/events', label: 'Sự kiện' },
                { href: '/admin/journeys', label: 'Lộ trình học' },
                { href: '/admin/learning-analytics', label: 'Phân tích học tập' },
                { href: '/admin/mentoring', label: 'Lịch Mentoring' },
                { href: '/admin/submissions', label: 'Duyệt bài nộp' },
            ]
        },
        {
            title: 'Shop (Cửa hàng)',
            icon: ShoppingBag,
            items: [
                { href: '/admin/products', label: 'Sản phẩm số' },
                { href: '/admin/pricing-addons', label: 'Gói Add-on' },
                { href: '/admin/memberships', label: 'Gói cước' },
                { href: '/admin/coupons', label: 'Mã giảm giá' },
                { href: '/admin/activation-codes', label: 'Mã kích hoạt' },
                { href: '/admin/product-classifications', label: 'Phân loại SP' },
                { href: '/admin/orders', label: 'Đơn hàng' },
                { href: '/admin/payments', label: 'Lịch sử giao dịch' },
                { href: '/admin/webhooks', label: 'Cổng thanh toán' },
            ]
        },
        {
            title: 'Marketing (Tiếp thị)',
            icon: Megaphone,
            items: [
                { href: '/admin/marketing', label: 'Tổng quan' },
                { href: '/admin/marketing/settings', label: 'Cấu hình API' },
                { href: '/admin/marketing/campaigns', label: 'Danh sách Chiến dịch' },
            ]
        },
        {
            title: 'Info (Nội dung)',
            icon: ScrollText,
            items: [
                { href: '/admin/landing-pages', label: 'Landing Pages' },
                { href: '/admin/sections', label: 'Thư viện Section' },
                { href: '/admin/policies', label: 'Chính sách' },
                { href: '/admin/instructors', label: 'Giảng viên' },
                { href: '/admin/system-pages', label: 'Trang thông tin' },
                { href: '/admin/blog', label: 'Bài viết / Blog' },
                { href: '/admin/contact', label: 'Liên hệ / Leads' },
                { href: '/admin/docs', label: 'Hệ thống Docs' },
                { href: '/admin/links', label: 'Rút gọn Link' },
                { href: '/admin/footer', label: 'Footer' },
            ]
        },
        {
            title: 'System (Hệ thống)',
            icon: Settings,
            items: [
                { href: '/admin/users', label: 'Thành viên' },
                { href: '/admin/notifications', label: 'Thông báo' },
                { href: '/admin/emails', label: 'Emails & Templates' },
                { href: '/admin/security', label: 'Bảo mật' },
                { href: '/admin/menu', label: 'Menu / Navigation' },
                { href: '/admin/media', label: 'Kho Media' },
                { href: '/admin/settings', label: 'Cài đặt chung' },
            ]
        }
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname?.startsWith(href);
    };

    return (
        <AdminGuard>
            {/* Background layer - allow overflow for border extensions */}
            <div className="w-full bg-muted/20 min-h-[calc(100vh-64px)] overflow-visible">
                {/* Container matching navbar */}
                <div className="max-w-[1400px] mx-auto px-4 overflow-visible">
                    {/* Admin box with borders - use relative for pseudo-element */}
                    <div className="relative bg-background border-l border-r border-border min-h-[calc(100vh-64px)] overflow-visible">
                        {/* Extend borders up to navbar using absolute positioned elements */}
                        <div className="absolute -top-16 left-[-1px] w-px h-16 bg-border z-40 pointer-events-none"></div>
                        <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border z-40 pointer-events-none"></div>
                        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                            {/* Sidebar */}
                            <aside className="w-full border-r border-border md:w-64 shrink-0 relative overflow-visible">
                                {/* Extend sidebar border up */}
                                <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border z-40 pointer-events-none"></div>
                                <div className="sticky top-16 flex flex-col h-[calc(100vh-64px)]">
                                    <div className="px-6 pt-14 pb-6 border-b bg-muted/20">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-muted-foreground leading-none font-medium">Quản lý</span>
                                            <span className="text-xl font-semibold text-foreground tracking-tight">Hệ thống Tulie</span>
                                        </div>
                                    </div>
                                    <nav className="flex-1 px-4 py-6 flex flex-col min-h-0 overflow-y-auto">
                                        <div className="space-y-4">
                                            {navGroups.map((group, groupIndex) => (
                                                <CollapsibleGroup
                                                    key={groupIndex}
                                                    group={group}
                                                    isActive={isActive}
                                                    defaultOpen={false}
                                                />
                                            ))}
                                        </div>
                                    </nav>

                                    <div className="p-4 border-t bg-background">
                                        <Link href="/">
                                            <Button as="div" variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground pl-2 h-9 text-sm font-medium">
                                                ← Về trang chủ
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </aside>

                            {/* Main content */}
                            <main className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
                                <div className="mx-auto max-w-[1400px]">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}

function CollapsibleGroup({
    group,
    isActive,
    defaultOpen = false
}: {
    group: any,
    isActive: (href: string, exact?: boolean) => boolean,
    defaultOpen?: boolean
}) {
    // If no title, it's the dashboard group - render items directly
    if (!group.title) {
        return (
            <div className="space-y-1">
                {group.items.map((link: any) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 w-full ${isActive(link.href, link.exact)
                            ? 'bg-foreground text-background font-semibold shadow-sm'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground font-semibold'
                            }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        {link.label}
                    </Link>
                ))}
            </div>
        );
    }

    const hasActiveChild = group.items.some((item: any) => isActive(item.href, item.exact));
    const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveChild);
    const Icon = group.icon;

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-md transition-colors ${hasActiveChild ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{group.title}</span>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
            </button>

            {isOpen && (
                <div className="space-y-1 pl-4 border-l border-border/50 ml-2">
                    {group.items.map((link: any) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all duration-500 w-full ${isActive(link.href, link.exact)
                                ? 'bg-secondary text-secondary-foreground font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
