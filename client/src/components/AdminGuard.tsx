'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                // Not logged in - redirect to login
                router.replace('/login?redirect=/admin');
            } else if (!isAdmin) {
                // Logged in but not admin - redirect to home
                router.replace('/?error=unauthorized');
            }
        }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-black"></div>
                    <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    // If not authenticated or not admin, show nothing (redirect will happen)
    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-6xl">🔒</div>
                    <p className="text-lg font-semibold text-foreground">Không có quyền truy cập</p>
                    <p className="text-muted-foreground">Bạn cần đăng nhập với tài khoản Admin</p>
                </div>
            </div>
        );
    }

    // User is authenticated and is admin - render children
    return <>{children}</>;
}
