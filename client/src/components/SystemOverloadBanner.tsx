'use client';

import { useEffect, useState, useCallback } from 'react';

interface OverloadEvent {
    status: number;
    message: string;
    retryAfter: number;
    systemStatus?: {
        status: string;
        memory?: string;
        cpu?: string;
    };
}

/**
 * SystemOverloadBanner
 * 
 * Listens for 'system-overloaded' events from the API client and shows
 * a non-intrusive but visible banner at the top of the page.
 * 
 * Auto-dismisses after the retryAfter period.
 * Includes a countdown timer so users know when to try again.
 */
export default function SystemOverloadBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [overloadInfo, setOverloadInfo] = useState<OverloadEvent | null>(null);
    const [countdown, setCountdown] = useState(0);

    const handleOverload = useCallback((event: Event) => {
        const detail = (event as CustomEvent<OverloadEvent>).detail;
        setOverloadInfo(detail);
        setCountdown(detail.retryAfter || 30);
        setIsVisible(true);
    }, []);

    // Listen for overload events
    useEffect(() => {
        window.addEventListener('system-overloaded', handleOverload);
        return () => window.removeEventListener('system-overloaded', handleOverload);
    }, [handleOverload]);

    // Countdown timer
    useEffect(() => {
        if (!isVisible || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setIsVisible(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible, countdown]);

    if (!isVisible || !overloadInfo) return null;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-6"
        >
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm pointer-events-none" />

            <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden w-full max-w-[600px] pointer-events-auto animate-in fade-in zoom-in-95 duration-500">
                <div className="px-10 py-12 flex flex-col items-center text-center gap-8">
                    {/* Minimal status indicator */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/20 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                        </div>
                        <h2 className="text-[20px] font-bold text-white tracking-tight">Hệ thống đang quá tải</h2>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2">
                        <p className="text-[15px] text-white/70 leading-relaxed max-w-[400px]">
                            {overloadInfo.message || 'Hệ thống đang xử lý lượng truy cập lớn hơn bình thường.'}
                        </p>
                        <p className="text-[14px] text-white/40 font-normal">
                            Vui lòng đợi {countdown} giây để hệ thống ổn định lại.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-2">
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                window.location.reload();
                            }}
                            className="bg-white text-black hover:bg-zinc-200 w-full sm:flex-1 h-12 rounded-2xl text-[14px] font-bold transition-all active:scale-95 shadow-xl shadow-white/5"
                        >
                            Tải lại trang
                        </button>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-[13px] font-semibold text-white/30 hover:text-white transition-colors h-12 px-6"
                        >
                            Bỏ qua
                        </button>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="h-[2px] bg-white/5 w-full">
                    <div
                        className="h-full bg-white/40 transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                        style={{ width: `${(countdown / (overloadInfo.retryAfter || 30)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
