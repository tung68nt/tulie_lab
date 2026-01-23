'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Client Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background text-foreground">
            <h2 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra!</h2>
            <p className="text-muted-foreground mb-4">Chúng tôi rất tiếc về sự cố này.</p>

            {/* Debug Info */}
            <div className="max-w-2xl w-full bg-slate-900 text-red-400 p-4 rounded-lg overflow-auto text-left text-xs font-semibold mb-6 max-h-[400px]">
                <p className="font-bold text-red-500 mb-2">{error.name}: {error.message}</p>
                <pre className="whitespace-pre-wrap opacity-70">
                    {error.stack}
                </pre>
                {error.digest && <p className="mt-2 text-blue-400">Digest: {error.digest}</p>}
            </div>

            <div className="flex gap-4">
                <Button onClick={() => reset()} className="px-6">
                    Thử lại
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        // Hard reload to clear client state
                        window.location.href = '/';
                    }}
                    className="px-6"
                >
                    Tải lại trang
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Xoá bộ nhớ đệm
                </Button>
            </div>
        </div >
    );
}
