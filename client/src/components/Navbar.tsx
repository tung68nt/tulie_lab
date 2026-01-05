'use client';

import Link from 'next/link';
import { Button } from './Button';
import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { NotificationMenu } from '@/components/NotificationMenu';

interface UserProfile {
    id: string;
    name?: string;
    fullName?: string;
    email: string;
    role: string;
    orders?: Array<{ id: string; status: string }>;
    avatar?: string;
}

export function Navbar() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. Upload file
            const uploadResult = await api.uploads.single(file);
            if (uploadResult.success) {
                const avatarUrl = uploadResult.file.url;

                // 2. Update profile
                await api.users.updateProfile({ avatar: avatarUrl });

                // 3. Update local state
                if (user) {
                    setUser({ ...user, avatar: avatarUrl });
                }

                // 4. Force check auth to sync across tabs/components
                window.dispatchEvent(new Event('auth-change'));
            }
        } catch (error) {
            console.error('Failed to update avatar:', error);
            alert('Lỗi khi cập nhật ảnh đại diện');
        } finally {
            // Reset input so same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = '';
            setDropdownOpen(false);
        }
    };

    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            let userData: UserProfile | null = null;

            // First try to get user from getMe (token check)
            try {
                const meResult: any = await api.auth.getMe();
                // Handle both { user: {...} } and direct user object responses
                if (meResult?.user) {
                    userData = meResult.user;
                } else if (meResult?.id && meResult?.email) {
                    userData = meResult;
                }
            } catch (e) {
                // getMe failed, try getProfile
            }

            // Fallback to getProfile
            if (!userData) {
                try {
                    const profileResult: any = await api.users.getProfile();
                    // Handle both { user: {...} } and direct user object responses
                    if (profileResult?.user) {
                        userData = profileResult.user;
                    } else if (profileResult?.id && profileResult?.email) {
                        userData = profileResult;
                    }
                } catch (e) {
                    // Not logged in
                }
            }


            if (userData) {
                setUser(userData);

                // Count pending orders for cart badge
                try {
                    const ordersResult: any = await api.users.getOrders();
                    const orders = Array.isArray(ordersResult) ? ordersResult : ordersResult?.orders || [];
                    const pendingCount = orders.filter((o: any) => o.status === 'PENDING').length;
                    setPendingOrdersCount(pendingCount);
                } catch (e) {
                    // Orders fetch failed
                }
            } else {
                setUser(null);
                setPendingOrdersCount(0);
            }
        } catch (error) {
            console.warn('Navbar: Auth check failed');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();

        // Re-check auth when window gains focus (user might have logged in/out in another tab)
        const handleFocus = () => checkAuth();
        window.addEventListener('focus', handleFocus);

        // Also listen for storage events (localStorage changes)
        const handleStorage = () => checkAuth();
        window.addEventListener('storage', handleStorage);
        // Custom event for same-tab updates
        window.addEventListener('auth-change', handleStorage);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('auth-change', handleStorage);
        };
    }, [checkAuth]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, []);

    const handleLogout = async () => {
        try {
            await api.auth.logout();
        } catch (e) {
            // Logout might fail but we should still clear local state
        }
        setUser(null);
        setPendingOrdersCount(0);
        setMobileMenuOpen(false);
        // Clear any local storage tokens
        localStorage.removeItem('token');
        // Redirect to login
        window.location.href = '/login';
    };

    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'ADMIN';

    const navLinks = [
        { href: '/', label: 'Trang chủ' },
        { href: '/about', label: 'Giới thiệu' },
        { href: '/courses', label: 'Workshop' },
        { href: '/instructors', label: 'Consultant' },
        { href: '/blog', label: 'Bài viết' },
        { href: '/contact', label: 'Liên hệ' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
                <div className="container flex h-16 items-center">
                    <div className="mr-8">
                        <Logo />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="mr-4 hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                                {link.label}
                            </Link>
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
                                                {(user.name || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
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
                            {loading ? (
                                // Loading skeleton
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
                                    <div className="h-4 w-20 animate-pulse rounded bg-muted hidden sm:block"></div>
                                </div>
                            ) : isLoggedIn && user ? (
                                <>
                                    <NotificationMenu />
                                    {/* User Dropdown */}
                                    <div className="relative ml-2" ref={dropdownRef}>
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 hover:bg-muted/50 rounded-full pl-2 pr-1 py-1 transition-colors outline-none"
                                        >
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs text-muted-foreground">Xin chào!</div>
                                                <div className="text-sm font-medium leading-none">
                                                    {user?.name || user?.fullName || user?.email?.split('@')[0]}
                                                </div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                                                {user?.avatar ? (
                                                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="font-medium text-sm">
                                                        {(user?.name || user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div className={`absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-lg transition-all duration-200 ease-out transform origin-top-right z-50 overflow-hidden ${dropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                            <div className="p-2 border-b bg-muted/30">
                                                <p className="text-sm font-medium">{user?.name || user?.fullName}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                            </div>
                                            <div className="p-1">
                                                {isAdmin && (
                                                    <Link href="/admin" className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onClick={() => setDropdownOpen(false)}>
                                                        Quản trị hệ thống
                                                    </Link>
                                                )}
                                                <Link href="/dashboard" className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onClick={() => setDropdownOpen(false)}>
                                                    Khoá học của tôi
                                                </Link>
                                                <Link href="/profile" className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onClick={() => setDropdownOpen(false)}>
                                                    Hồ sơ của tôi
                                                </Link>
                                                <Link href="/orders" className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onClick={() => setDropdownOpen(false)}>
                                                    Lịch sử đơn hàng
                                                    {pendingOrdersCount > 0 && <span className="ml-auto bg-foreground text-background text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{pendingOrdersCount}</span>}
                                                </Link>
                                                <div className="h-px bg-muted my-1" />
                                                <button
                                                    className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                    onClick={handleLogout}
                                                >
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
                                        <Button variant="ghost" size="sm">Đăng nhập</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">Bắt đầu ngay</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer (Fade Down) - Below Navbar (z-49) */}
            <div className={`fixed inset-x-0 top-16 bottom-0 z-[49] md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer Content - Full width dropdown, fade down animation */}
                <div className={`absolute top-0 inset-x-0 bg-background border-b border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>

                    {/* Navigation Links & User Menu */}
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 max-h-[70vh]">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-3 px-4 text-base font-medium hover:bg-muted rounded-md transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Drawer Footer (Guest Only) */}
                    {!isLoggedIn && !loading && (
                        <div className="p-4 border-t border-border bg-background">
                            <div className="space-y-4">
                                <div className="text-center pb-2">
                                    <h4 className="font-bold text-base mb-1">Chào mừng bạn!</h4>
                                    <p className="text-sm text-muted-foreground">Đăng nhập để tiếp tục hành trình học tập.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full h-10">Đăng nhập</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full h-10 shadow-none">Đăng ký</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile User Menu Drawer (Fade Down) - Below Navbar (z-49) */}
            <div className={`fixed inset-x-0 top-16 bottom-0 z-[49] md:hidden ${dropdownOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${dropdownOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setDropdownOpen(false)}
                />

                {/* Drawer Content - Full width dropdown, fade down animation */}
                <div className={`absolute top-0 inset-x-0 bg-background border-b border-border flex flex-col shadow-lg transition-all duration-300 ease-in-out ${dropdownOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                    <div className="p-4 border-b bg-muted/30">
                        <p className="font-semibold text-base">Xin chào, {user?.name || user?.fullName}!</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {isAdmin && (
                            <Link href="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-base font-medium hover:bg-muted transition-colors text-primary">
                                Quản trị hệ thống
                            </Link>
                        )}
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-base hover:bg-muted transition-colors">
                            Hồ sơ cá nhân
                        </Link>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-base hover:bg-muted transition-colors">
                            Khoá học của tôi
                        </Link>
                        <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-4 py-3 text-base hover:bg-muted transition-colors">
                            <span>Lịch sử đơn hàng</span>
                            {pendingOrdersCount > 0 && <span className="bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">{pendingOrdersCount}</span>}
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
