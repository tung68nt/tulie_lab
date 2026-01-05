'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navLinks = [
        // Dashboard
        { href: '/admin', label: 'Tổng quan', exact: true },

        // Khóa học & Nội dung học
        { href: '/admin/courses', label: 'Workshop' },
        { href: '/admin/categories', label: 'Chuyên mục' },
        { href: '/admin/bundles', label: 'Combo' },
        { href: '/admin/instructors', label: 'Consultant' },

        // Thương mại
        { href: '/admin/orders', label: 'Đơn hàng' },
        { href: '/admin/coupons', label: 'Coupon' },
        { href: '/admin/webhooks', label: 'Cổng thanh toán' },

        // Member
        { href: '/admin/users', label: 'Member' },
        { href: '/admin/notifications', label: 'Thông báo' },
        { href: '/admin/contact', label: 'Liên hệ' },

        // Nội dung website
        { href: '/admin/content', label: 'Nội dung' },
        { href: '/admin/blog', label: 'Bài viết' },
        { href: '/admin/footer', label: 'Footer' },

        // Hệ thống
        { href: '/admin/security', label: 'Bảo mật' },
        { href: '/admin/emails', label: 'Email' },
        { href: '/admin/settings', label: 'Cài đặt' },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname?.startsWith(href);
    };

    return (
        /* Background layer - allow overflow for border extensions */
        <div className="w-full bg-muted/20 min-h-[calc(100vh-64px)] overflow-visible">
            {/* Container matching navbar */}
            <div className="max-w-[1200px] mx-auto px-4 overflow-visible">
                {/* Admin box with borders - use relative for pseudo-element */}
                <div className="relative bg-background border-l border-r border-border min-h-[calc(100vh-64px)] overflow-visible">
                    {/* Extend borders up to navbar using absolute positioned elements */}
                    <div className="absolute -top-16 left-[-1px] w-px h-16 bg-border z-40"></div>
                    <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border z-40"></div>
                    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                        {/* Sidebar */}
                        <aside className="w-full border-r border-border md:w-52 shrink-0 relative overflow-visible">
                            {/* Extend sidebar border up */}
                            <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border z-40"></div>
                            <div className="sticky top-16 flex flex-col">
                                <div className="px-6 py-10 border-b bg-muted/20">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground leading-none">Quản trị</span>
                                        <span className="text-2xl font-bold text-foreground tracking-tight">Hệ thống LMS</span>
                                    </div>
                                </div>
                                <nav className="flex-1 px-3 py-6 flex flex-col min-h-0">
                                    <div className="space-y-1">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full ${isActive(link.href, link.exact)
                                                    ? 'bg-foreground text-background font-bold'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-4 pb-4 border-t px-2">
                                        <Link href="/">
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground pl-2 h-9 text-sm font-medium">
                                                ← Về trang chủ
                                            </Button>
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        </aside>

                        {/* Main content */}
                        <main className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
                            <div className="mx-auto max-w-6xl">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div >
    );
}

