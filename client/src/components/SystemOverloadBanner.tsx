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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 99999,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                color: '#fff',
                padding: '0',
                borderBottom: '2px solid rgba(255, 165, 0, 0.6)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                animation: 'slideDown 0.4s ease-out',
            }}
        >
            <style>{`
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                @keyframes progress-shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
            }}>
                {/* Icon */}
                <div style={{
                    fontSize: '28px',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                    flexShrink: 0,
                }}>
                    ⚡
                </div>

                {/* Message */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{
                        fontWeight: 700,
                        fontSize: '15px',
                        marginBottom: '4px',
                        letterSpacing: '0.3px',
                    }}>
                        Hệ thống đang quá tải
                    </div>
                    <div style={{
                        fontSize: '13px',
                        opacity: 0.85,
                        lineHeight: 1.4,
                    }}>
                        {overloadInfo.message || 'Hệ thống đang xử lý quá nhiều yêu cầu.'}{' '}
                        Vui lòng đợi <strong style={{ color: '#ffd700' }}>{countdown}s</strong> rồi thử lại.
                    </div>
                </div>

                {/* Retry button */}
                <button
                    onClick={() => {
                        setIsVisible(false);
                        window.location.reload();
                    }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(4px)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                >
                    Tải lại trang
                </button>

                {/* Close button */}
                <button
                    onClick={() => setIsVisible(false)}
                    aria-label="Đóng thông báo"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        fontSize: '20px',
                        padding: '4px',
                        lineHeight: 1,
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; }}
                >
                    ✕
                </button>
            </div>

            {/* Progress bar showing time until auto-dismiss */}
            <div style={{
                height: '3px',
                background: 'rgba(255, 215, 0, 0.4)',
                overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
                    width: `${(countdown / (overloadInfo.retryAfter || 30)) * 100}%`,
                    transition: 'width 1s linear',
                }} />
            </div>
        </div>
    );
}
