'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

function AuthCallbackContent() {
    const router = useRouter();
    const { verifyGoogleToken } = useAuth();
    const { addToast } = useToast();
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        if (processed) return;

        const handleCallback = async () => {
            try {
                // Supabase returns auth data in the hash/fragment: #access_token=...&refresh_token=...
                const hash = window.location.hash;
                const params = new URLSearchParams(hash.substring(1)); // remove #
                const accessToken = params.get('access_token');

                // Also check query params just in case of different config
                const queryParams = new URLSearchParams(window.location.search);
                const queryToken = queryParams.get('access_token');

                const token = accessToken || queryToken;

                if (!token) {
                    console.error('No access token found in URL');
                    addToast('Đăng nhập thất bại: Không tìm thấy mã xác thực.', 'error');
                    router.push('/login');
                    return;
                }

                setProcessed(true);
                await verifyGoogleToken(token);

                // Dispatch event for other components to update
                window.dispatchEvent(new Event('auth-change'));

                addToast('Đăng nhập thành công!', 'success');

                // Redirect to dashboard or previous page
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const targetUrl = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
                router.push(targetUrl);

            } catch (error: any) {
                console.error('Auth callback error:', error);
                addToast(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.', 'error');
                router.push('/login');
            }
        };

        handleCallback();
    }, [router, verifyGoogleToken, addToast, processed]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground animate-pulse">Đang hoàn tất đăng nhập...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
