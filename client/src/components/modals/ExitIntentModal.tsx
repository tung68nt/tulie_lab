'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

interface ExitConfig {
    enabled: boolean;
    highlight: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    secondaryLink: string;
    idleTimeout: number;
}

const DEFAULT_CONFIG: ExitConfig = {
    enabled: true,
    highlight: '🔥 Hơn 500+ học viên đã tham gia tuần này',
    title: 'Chờ chút — Đừng bỏ lỡ!',
    description: 'Bạn đang cách một bước để sở hữu bộ công cụ & khoá học giúp tự động hóa công việc, tiết kiệm hàng chục giờ mỗi tuần.',
    stats: [
        { value: '2,000+', label: 'Học viên' },
        { value: '50+', label: 'Sản phẩm số' },
        { value: '4.9/5', label: 'Đánh giá' },
    ],
    primaryText: 'Khám phá ngay',
    primaryLink: '/san-pham',
    secondaryText: 'Chat tư vấn miễn phí',
    secondaryLink: 'https://zalo.me/0393137755',
    idleTimeout: 0,
};

export function ExitIntentModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [config, setConfig] = useState<ExitConfig>(DEFAULT_CONFIG);
    const [configLoaded, setConfigLoaded] = useState(false);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res: any = await api.settings.getPublic();
                if (res?.POPUP_EXIT_CONFIG) {
                    const parsed = JSON.parse(res.POPUP_EXIT_CONFIG);
                    setConfig({ ...DEFAULT_CONFIG, ...parsed });
                }
            } catch {
                // Fallback to defaults
            }
            setConfigLoaded(true);
        };
        loadConfig();
    }, []);

    const showModal = () => {
        if (hasShown) return;
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
    };

    // Mouse leave trigger (desktop)
    useEffect(() => {
        if (!configLoaded || !config.enabled) return;

        const shown = sessionStorage.getItem('exit_intent_shown');
        if (shown) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                showModal();
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown, configLoaded, config.enabled]);

    // Idle timeout trigger (desktop + mobile)
    useEffect(() => {
        if (!configLoaded || !config.enabled || hasShown) return;
        if (!config.idleTimeout || config.idleTimeout <= 0) return;

        const shown = sessionStorage.getItem('exit_intent_shown');
        if (shown) return;

        let idleTimer: ReturnType<typeof setTimeout>;

        const resetIdle = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                showModal();
            }, config.idleTimeout * 1000);
        };

        const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(e => document.addEventListener(e, resetIdle, { passive: true }));

        idleTimer = setTimeout(() => {
            showModal();
        }, config.idleTimeout * 1000);

        return () => {
            clearTimeout(idleTimer);
            events.forEach(e => document.removeEventListener(e, resetIdle));
        };
    }, [configLoaded, config.enabled, config.idleTimeout, hasShown]);

    if (!configLoaded || !config.enabled) return null;

    const isExternal = config.secondaryLink?.startsWith('http');
    const statIcons = [Users, TrendingUp, Zap];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl"
                    >
                        {/* Highlight banner */}
                        {config.highlight && (
                            <div className="px-6 py-2.5 bg-zinc-800/80 border-b border-zinc-700/50 text-center">
                                <span className="text-xs font-semibold text-zinc-300">{config.highlight}</span>
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Title */}
                            <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-2">
                                {config.title}
                            </h2>

                            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
                                {config.description}
                            </p>

                            {/* Stats row */}
                            {config.stats && config.stats.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {config.stats.map((stat, i) => {
                                        const Icon = statIcons[i % statIcons.length];
                                        return (
                                            <div key={i} className="text-center p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
                                                <Icon className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
                                                <div className="text-lg font-bold text-zinc-100">{stat.value}</div>
                                                <div className="text-[10px] text-zinc-500 font-medium">{stat.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <a
                                    href={config.primaryLink}
                                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-200 shadow-sm transition-all"
                                >
                                    {config.primaryText}
                                    <ArrowRight className="w-4 h-4" />
                                </a>

                                <a
                                    href={config.secondaryLink}
                                    target={isExternal ? '_blank' : undefined}
                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                    className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-zinc-700 bg-transparent text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {config.secondaryText}
                                </a>
                            </div>

                            {/* Dismiss */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-4 w-full text-center text-zinc-600 hover:text-zinc-400 text-xs font-medium transition-colors"
                            >
                                Không, cảm ơn
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
