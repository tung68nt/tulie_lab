'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface ExitConfig {
    enabled: boolean;
    title: string;
    description: string;
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    secondaryLink: string;
}

const DEFAULT_CONFIG: ExitConfig = {
    enabled: true,
    title: 'Chờ chút nhé!',
    description: 'Bạn có thể đang bỏ lỡ các công cụ và khoá học giúp tối ưu công việc. Hãy xem qua sản phẩm của chúng mình trước khi rời đi.',
    primaryText: 'Xem sản phẩm',
    primaryLink: '/san-pham',
    secondaryText: 'Chat với tư vấn viên',
    secondaryLink: 'https://zalo.me/0393137755',
};

export function ExitIntentModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [config, setConfig] = useState<ExitConfig>(DEFAULT_CONFIG);
    const [configLoaded, setConfigLoaded] = useState(false);

    // Fetch config from settings
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

    useEffect(() => {
        if (!configLoaded || !config.enabled) return;

        // Check if shown in this session
        const shown = sessionStorage.getItem('exit_intent_shown');
        if (shown) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Trigger when mouse leaves the top of the viewport
            if (e.clientY <= 0 && !hasShown) {
                setIsOpen(true);
                setHasShown(true);
                sessionStorage.setItem('exit_intent_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown, configLoaded, config.enabled]);

    // Don't render if disabled or config not loaded
    if (!configLoaded || !config.enabled) return null;

    const isExternal = config.secondaryLink?.startsWith('http');

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
                        className="relative w-full max-w-md overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl p-6 md:p-8"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-semibold text-zinc-100 mb-3">
                            {config.title}
                        </h2>

                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                            {config.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                            <a
                                href={config.primaryLink}
                                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-zinc-900 text-zinc-100 text-sm font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all"
                            >
                                {config.primaryText}
                                <ArrowRight className="w-4 h-4" />
                            </a>

                            <a
                                href={config.secondaryLink}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="flex items-center justify-center gap-2 w-full h-11 rounded-md border border-zinc-700 bg-transparent text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
