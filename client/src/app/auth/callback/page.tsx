'use client';
import { Loader2 } from 'lucide-react';

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
                // Google OAuth2 returns authorization code as query parameter: ?code=...&state=...
                const queryParams = new URLSearchParams(window.location.search);
                const code = queryParams.get('code');

                // Also check hash fragment for backward compatibility
                const hash = window.location.hash;
                const hashParams = new URLSearchParams(hash.substring(1));
                const hashToken = hashParams.get('access_token');

                const tokenOrCode = code || hashToken;

                if (!tokenOrCode) {
                    // Check for error from Google
                    const error = queryParams.get('error');
                    if (error) {
                        console.error('Google OAuth error:', error);
                        addToast(`Đăng nhập thất bại: ${error}`, 'error');
                    } else {
                        console.error('No authorization code found in URL');
                        addToast('Đăng nhập thất bại: Không tìm thấy mã xác thực.', 'error');
                    }
                    router.push('/login');
                    return;
                }

                setProcessed(true);
                await verifyGoogleToken(tokenOrCode);

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
                <Loader2 className="animate-spin w-8 h-8 text-primary " />
                <p className="text-muted-foreground animate-pulse">Đang hoàn tất đăng nhập...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="animate-spin w-8 h-8 text-primary " />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
