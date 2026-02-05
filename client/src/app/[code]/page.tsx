'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function RedirectPage() {
    const { code } = useParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const resolveAndRedirect = async () => {
            if (!code) return;

            try {
                const link = await api.shortLinks.resolve(code as string);
                if (link?.originalUrl) {
                    window.location.href = link.originalUrl;
                } else {
                    setError('Liên kết không hợp lệ hoặc đã bị xóa.');
                }
            } catch (err: any) {
                if (err instanceof ApiError && err.status === 404) {
                    setError('Liên kết không tồn tại (404).');
                } else {
                    setError('Đã có lỗi xảy ra khi xử lý liên kết.');
                }
                console.error('Redirect error:', err);
            }
        };

        resolveAndRedirect();
    }, [code]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="text-6xl font-black text-zinc-100 uppercase tracking-tighter">404</div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Không tìm thấy liên kết</h1>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        {error} Vui lòng kiểm tra lại đường dẫn hoặc liên hệ với chúng tôi để được hỗ trợ.
                    </p>
                    <div className="pt-4">
                        <button
                            onClick={() => router.push('/')}
                            className="bg-zinc-950 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                        >
                            Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="space-y-8 text-center">
                <div className="relative">
                    <LoadingSpinner />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-zinc-100 animate-ping opacity-20" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Đang chuyển hướng...</h2>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">vui lòng chờ trong giây lát</p>
                </div>
            </div>
        </div>
    );
}
