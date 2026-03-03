'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { Sun, Moon, Rocket, BookOpen, Package, User, Key, FileText, LogOut, Palette, Home } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { NotificationMenu } from '@/components/NotificationMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { useTheme } from 'next-themes';

interface NavLinkItem {
    label: string;
    href: string;
    isExternal?: boolean;
    icon?: React.ReactNode;
    children?: { label: string; href: string; isExternal?: boolean }[];
}

function NavMenuItem({ link, pathname }: { link: NavLinkItem, pathname: string }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [pathname]);

    const handleMouseEnter = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 150);
    };

    const isActive = pathname === link.href || (link.children?.some(c => pathname === c.href));

    if (link.children) {
        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {link.href && link.href !== '#' ? (
                    <Link
                        href={link.href}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground font-semibold' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground font-medium'}`}
                    >
                        {link.label}
                        <svg className={`w-3.5 h-3.5 opacity-50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isActive ? 'stroke-[2.5px]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </Link>
                ) : (
                    <div
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 cursor-default ${isActive ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground font-semibold' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground font-medium'}`}
                    >
                        {link.label}
                        <svg className={`w-3.5 h-3.5 opacity-50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isActive ? 'stroke-[2.5px]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}

                {/* Dropdown Menu */}
                <div className={`absolute top-[calc(100%-4px)] left-0 pt-3 w-56 transition-all duration-200 origin-top z-[100] ${isDropdownOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}>
                    <div className="bg-popover border border-border/60 rounded-xl shadow-2xl overflow-hidden p-1.5 backdrop-blur-xl">
                        {link.children.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href}
                                target={child.isExternal ? '_blank' : undefined}
                                rel={child.isExternal ? 'noopener noreferrer' : undefined}
                                className={`block px-3 py-2 text-sm rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${pathname === child.href ? 'bg-accent/50 font-semibold text-foreground' : 'text-muted-foreground'
                                    }`}
                            >
                                {child.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={link.href}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            className={`transition-all duration-200 px-3 py-2 rounded-md ${isActive ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground font-semibold' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground font-medium'}`}
            title={link.label}
        >
            {link.icon ? link.icon : link.label}
        </Link>
    );
}

export function Navbar() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const { addToast } = useToast();
    const pathname = usePathname();
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };



    // Fetch pending orders count when user is present
    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                try {
                    const ordersResult: any = await api.users.getMyOrders();
                    const orders = Array.isArray(ordersResult) ? ordersResult : ordersResult?.orders || [];
                    const pendingCount = orders.filter((o: any) => o.status === 'PENDING').length;
                    setPendingOrdersCount(pendingCount);
                } catch (e) {
                    console.error('Failed to fetch orders count', e);
                }
            };
            fetchOrders();
        } else {
            setPendingOrdersCount(0);
        }
    }, [user]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. Upload file
            const uploadResult: any = await api.uploads.single(file);
            if (uploadResult.success) {
                const avatarUrl = uploadResult.data.url;

                // 2. Update profile
                await api.users.updateProfile({ avatar: avatarUrl });

                // 3. Force reload to update context
                window.location.reload();
            }

        } catch (error) {
            console.error('Failed to update avatar:', error);
            addToast('Lỗi khi cập nhật ảnh đại diện', 'error');
        } finally {
            // Reset input so same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = '';
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            setMobileMenuOpen(false);
            setDropdownOpen(false);
            await logout();
            window.location.href = '/login';
        } catch (e) {
            console.error('Logout failed', e);
            window.location.href = '/login';
        }
    };

    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'ADMIN';

    // Helper to get initials
    const getInitials = () => {
        if (!user) return 'U';
        if (user.name) return user.name.charAt(0).toUpperCase();
        return user.email.charAt(0).toUpperCase();
    };

    const getDisplayName = () => {
        if (!user) return '';
        if (user.name) return user.name;
        if (user.email) return user.email.split('@')[0];
        return 'Người dùng';
    };

    // Default fallback menu
    const DEFAULT_NAV_LINKS: NavLinkItem[] = [
        { label: 'Trang chủ', href: '/', icon: <Home className="w-5 h-5" /> },
        {
            label: 'Ứng dụng',
            href: '#',
            children: [
                { label: 'Vibe coding', href: '/vibe-coding' },
                { label: 'Ứng dụng AI', href: '/ai' },
                { label: 'Google Sheets & Apps Script', href: '/google-sheets' },
            ],
        },
        {
            label: 'Khoá học',
            href: '/courses',
            children: [
                { label: 'Khoá học', href: '/courses' },
                { label: 'Lộ trình học (Combo)', href: '/combos' },
                { label: 'Lịch hoạt động', href: '/calendar' },
                { label: 'Người hướng dẫn', href: '/instructors' },
            ],
        },
        {
            label: 'Kho template',
            href: '/shop',
            children: [
                { label: 'Cửa hàng', href: '/shop' },
                { label: 'Bảng giá', href: '/pricing' },
            ],
        },
        { label: 'Bài viết', href: '/blog' },
        { label: 'Tài liệu', href: '/docs' },
        { label: 'Liên hệ', href: '/contact' },
    ];

    const [navLinks, setNavLinks] = useState<NavLinkItem[]>(DEFAULT_NAV_LINKS);

    // Moved early return logic to the end to prevent Hook violation

    // Fetch dynamic menu from CMS with caching
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // 1. Try to load from cache first
                const cached = localStorage.getItem('navbar_menu_cache');
                if (cached) {
                    try {
                        const parsedCache = JSON.parse(cached);
                        if (Array.isArray(parsedCache) && parsedCache.length > 0) {
                            setNavLinks(parsedCache);
                        }
                    } catch (e) {
                        console.error('Failed to parse cached menu', e);
                    }
                }

                // 2. Fetch fresh data
                const data = await api.cms.get(['navbar_menu']) as any;
                if (data?.navbar_menu) {
                    const parsed = JSON.parse(data.navbar_menu);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setNavLinks(parsed);
                        // 3. Update cache
                        localStorage.setItem('navbar_menu_cache', JSON.stringify(parsed));
                    }
                }
            } catch (error) {
                console.log('Using default navbar menu (API failed)');
            }
        };
        fetchMenu();
    }, []);

    // Hide navbar for whiteboard editor (paths containing /whiteboard/ followed by ID)
    // We want to show navbar on /whiteboard (list page) but hide on /whiteboard/[id]
    const isWhiteboardEditor = pathname?.includes('/whiteboard/') && pathname.split('/whiteboard/')[1]?.length > 0;

    if (isWhiteboardEditor) {
        return null;
    }

    return (
        <>
            <nav className="sticky top-[var(--countdown-height,0px)] inset-x-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-20 items-center">
                    <div className="mr-8">
                        <Logo />
                    </div>


                    <div className="mr-4 hidden md:flex items-center space-x-1 text-sm font-medium relative z-50">
                        {navLinks.map((link) => (
                            <NavMenuItem
                                key={link.href + link.label}
                                link={link}
                                pathname={pathname}
                            />
                        ))}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="flex flex-1 items-center justify-end gap-2">

                        {/* Mobile Layout */}
                        <div className="flex flex-1 items-center justify-end md:hidden gap-3">
                            {/* Mobile User Avatar */}
                            {isLoggedIn && user && (
                                <div className="relative">
                                    <button
                                        onClick={() => { setDropdownOpen(!dropdownOpen); setMobileMenuOpen(false); }}
                                        className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border relative z-[60]"
                                    >
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="font-medium text-xs">
                                                {getInitials()}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Mobile Menu Button (opens/toggles full menu) */}
                            <button
                                className="p-2 hover:bg-muted rounded-full transition-colors relative z-[60]"
                                onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setDropdownOpen(false); }}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <ThemeToggle />
                            {authLoading ? (
                                // Loading skeleton
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
                                    <div className="h-4 w-20 animate-pulse rounded bg-muted hidden sm:block"></div>
                                </div>
                            ) : isLoggedIn && user ? (
                                <>
                                    <NotificationMenu />
                                    {/* User Dropdown */}
                                    <div className="relative ml-2">
                                        {dropdownOpen && (
                                            <div
                                                className="fixed inset-0 z-40 bg-transparent"
                                                onClick={() => setDropdownOpen(false)}
                                            />
                                        )}
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 hover:bg-muted/50 rounded-full pl-2 pr-1 py-1 transition-colors outline-none relative z-50"
                                        >
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs text-muted-foreground">Xin chào!</div>
                                                <div className="text-sm font-medium leading-none">
                                                    {getDisplayName()}
                                                </div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                                                {user?.avatar ? (
                                                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="font-medium text-sm">
                                                        {getInitials()}
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div className={`absolute right-0 top-full mt-3 w-64 rounded-2xl border border-zinc-200 bg-white shadow-2xl transition-all duration-300 ease-out transform origin-top-right z-50 overflow-hidden ${dropdownOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}>
                                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-zinc-200">
                                                        {user?.avatar ? (
                                                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-base">
                                                                {getInitials()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-zinc-900 truncate leading-tight">{getDisplayName()}</p>
                                                        <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start gap-1">
                                                    {(() => {
                                                        const activeSub = (Array.isArray(user?.subscriptions) ? user.subscriptions : []).find(s => s.status?.toUpperCase() === 'ACTIVE' && new Date(s.endDate) > new Date());
                                                        const isAdmin = user?.role === 'ADMIN';

                                                        return (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-medium text-zinc-900">Gói cước:</span>
                                                                <div className="flex flex-wrap justify-start gap-2">
                                                                    {isAdmin && (
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-zinc-100 text-zinc-900 border border-zinc-200">
                                                                            Admin
                                                                        </span>
                                                                    )}

                                                                    {activeSub ? (
                                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${((activeSub as any).product?.slug || '').includes('premium')
                                                                            ? 'bg-amber-100 text-amber-900 border-amber-200'
                                                                            : 'bg-zinc-100 text-zinc-900 border-zinc-200'
                                                                            }`}>
                                                                            {((activeSub as any).product?.title || '').replace(/Pro/i, 'Premium')}
                                                                        </span>
                                                                    ) : (
                                                                        !isAdmin && (
                                                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-zinc-100 text-zinc-500 border border-zinc-200">
                                                                                Member
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {(() => {
                                                        const activeSub = Array.isArray(user?.subscriptions) ? user?.subscriptions?.find(s => s.status?.toUpperCase() === 'ACTIVE' && new Date(s.endDate) > new Date()) : undefined;
                                                        if (activeSub) {
                                                            const date = new Date(activeSub.endDate);
                                                            return !isNaN(date.getTime()) ? (
                                                                <span className="text-[10px] font-medium text-zinc-900">
                                                                    Hết hạn: {date.toLocaleDateString('vi-VN')}
                                                                </span>
                                                            ) : null;
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="p-2 space-y-0.5">
                                                {isAdmin && (
                                                    <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                        <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                            <Rocket size={14} />
                                                        </div>
                                                        Quản trị hệ thống
                                                    </Link>
                                                )}
                                                <Link href="/whiteboard" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <Palette size={14} />
                                                    </div>
                                                    Bảng trắng
                                                </Link>
                                                <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <BookOpen size={14} />
                                                    </div>
                                                    Khoá học của tôi
                                                </Link>
                                                <Link href="/my-products" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <Package size={14} />
                                                    </div>
                                                    Sản phẩm số của tôi
                                                </Link>
                                                <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <User size={14} />
                                                    </div>
                                                    Hồ sơ của tôi
                                                </Link>
                                                <Link href="/activate" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <Key size={14} />
                                                    </div>
                                                    Kích hoạt bằng mã
                                                </Link>
                                                <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <FileText size={14} />
                                                    </div>
                                                    Lịch sử đơn hàng
                                                    {pendingOrdersCount > 0 && <span className="ml-auto bg-zinc-900 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{pendingOrdersCount}</span>}
                                                </Link>

                                                <div className="h-px bg-zinc-100 my-1.5 mx-1" />

                                                <button
                                                    className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                                                    onClick={handleLogout}
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-zinc-400">
                                                        <LogOut size={14} />
                                                    </div>
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </>
                            ) : (
                                // Not logged in state
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <Button as="div" variant="ghost" size="sm">Đăng nhập</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button as="div" size="sm">Bắt đầu ngay</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer (Fade Down) - Below Navbar (z-49) */}
            <div className={`fixed inset-x-0 top-20 bottom-0 z-[49] md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer Content - Full width dropdown, fade down animation */}
                <div className={`absolute top-0 inset-x-0 bg-background border-b border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>

                    {/* Navigation Links & User Menu */}
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 max-h-[70vh]">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href || (link.children?.some(c => pathname === c.href));

                            if (link.children) {
                                return (
                                    <div key={link.href} className="space-y-1">
                                        {link.href && link.href !== '#' ? (
                                            <Link
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block px-4 py-3 text-base font-bold text-foreground hover:bg-muted rounded-lg transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <div className="px-4 py-3 text-base font-bold text-foreground">
                                                {link.label}
                                            </div>
                                        )}
                                        <div className="ml-4 border-l-2 border-border/60 pl-2 space-y-1 my-1">
                                            {link.children.map(child => {
                                                const isChildActive = pathname === child.href;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        target={child.isExternal ? '_blank' : undefined}
                                                        rel={child.isExternal ? 'noopener noreferrer' : undefined}
                                                        className={`block py-2 px-4 text-[15px] rounded-md transition-colors ${isChildActive
                                                            ? 'text-primary font-semibold bg-primary/5'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                                            }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    target={link.isExternal ? '_blank' : undefined}
                                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                                    className={`block py-3 px-4 text-base font-bold rounded-lg transition-colors ${isActive ? 'bg-muted text-foreground' : 'text-foreground/80 hover:bg-muted'}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle Row */}
                        <div className="px-4 py-4 mt-2 border-t border-dashed border-border flex items-center justify-between">
                            <span className="font-medium text-muted-foreground">Giao diện</span>
                            <div className="scale-110 origin-right">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>

                    {/* Drawer Footer (Guest Only) */}
                    {!isLoggedIn && !authLoading && (
                        <div className="p-4 border-t border-border bg-background">
                            <div className="space-y-4">
                                <div className="text-center pb-2">
                                    <h4 className="font-bold text-base mb-1">Chào mừng bạn!</h4>
                                    <p className="text-sm text-muted-foreground">Đăng nhập để tiếp tục hành trình học tập.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/login">
                                        <Button as="div" variant="outline" className="w-full h-10">Đăng nhập</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button as="div" className="w-full h-10 shadow-none">Đăng ký</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile User Menu Drawer (Fade Down) - Below Navbar (z-49) */}
            <div className={`fixed inset-x-0 top-20 bottom-0 z-[49] md:hidden ${dropdownOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${dropdownOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setDropdownOpen(false)}
                />

                {/* Drawer Content - Full width dropdown, fade down animation */}
                <div className={`absolute top-0 inset-x-0 bg-background border-b border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out ${dropdownOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                    <div className="p-4 border-b bg-muted/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-base">Xin chào, {getDisplayName()}!</p>
                                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                            </div>
                            {(() => {
                                const activeSub = Array.isArray(user?.subscriptions) ? user?.subscriptions?.find(s => s.status?.toUpperCase() === 'ACTIVE' && new Date(s.endDate) > new Date()) : undefined;
                                const isAdmin = user?.role === 'ADMIN';

                                let tierLabel = 'Free';
                                let tagClass = 'bg-zinc-100 text-zinc-600';

                                if (isAdmin) {
                                    tierLabel = 'Admin';
                                    tagClass = 'bg-zinc-900 text-white';
                                } else if (activeSub) {
                                    const title = ((activeSub as any).product?.title || '').toLowerCase();
                                    const slug = ((activeSub as any).product?.slug || '').toLowerCase();

                                    if (title.includes('basic') || slug.includes('basic')) {
                                        tierLabel = 'Basic';
                                        tagClass = 'bg-zinc-100 text-zinc-900 border border-zinc-200';
                                    } else {
                                        tierLabel = 'Premium';
                                        tagClass = 'bg-zinc-900 text-white';
                                    }
                                }

                                return (
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${tagClass}`}>
                                        {tierLabel}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {isAdmin && (
                            <Link href="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-base font-medium hover:bg-muted transition-colors text-primary">
                                Quản trị hệ thống
                            </Link>
                        )}
                        <Link href="/activate" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-base hover:bg-muted transition-colors">
                            Kích hoạt bằng mã
                        </Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-base hover:bg-muted transition-colors">
                            Hồ sơ cá nhân
                        </Link>
                        <Link href="/whiteboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-base hover:bg-muted transition-colors">
                            Bảng trắng cộng tác
                        </Link>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-base hover:bg-muted transition-colors">
                            Khoá học của tôi
                        </Link>
                        <Link href="/my-products" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-base hover:bg-muted transition-colors">
                            Sản phẩm số của tôi
                        </Link>
                        <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-4 py-2.5 text-base hover:bg-muted transition-colors">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                Giỏ hàng / Đơn hàng
                            </span>
                            {pendingOrdersCount > 0 && <span className="bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{pendingOrdersCount}</span>}
                        </Link>
                        <div className="h-px bg-border my-2 mx-4"></div>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-base text-foreground hover:bg-muted transition-colors">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
