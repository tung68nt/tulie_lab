'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface FomoEvent {
    id: string;
    name: string;
    location: string;
    action: string;
    time: string;
}

interface FomoConfig {
    enabled: boolean;
    actions: string[];
    showEvery: number;
    duration: number;
}

const NAMES = ['Anh T.', 'Chị H.', 'Minh N.', 'Linh V.', 'Hoàng D.', 'Thảo P.', 'Dũng K.', 'Trang L.', 'Quỳnh N.', 'Sơn B.'];
const LOCATIONS = ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Vũng Tàu', 'Bình Dương', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Quảng Ninh', 'Huế'];
const TIME_LABELS = ['Vừa xong', '2 phút trước', '5 phút trước', '8 phút trước', '12 phút trước'];

// Fallback nội dung mặc định (dùng khi chưa cấu hình từ admin)
const DEFAULT_ACTIONS = [
    'vừa đăng ký khóa Vibe Coding cho người mới',
    'vừa mua Hệ thống Quản lý Nhân sự (HRM)',
    'vừa mua Automation Email Marketing Script',
    'vừa mua AI Content Generator Template',
    'vừa mua Hệ thống Quản lý Tài chính Đa kênh',
];

interface FomoNotificationProps {
    className?: string;
}

export function FomoNotification({ className }: FomoNotificationProps) {
    const [currentEvent, setCurrentEvent] = useState<FomoEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [config, setConfig] = useState<FomoConfig | null>(null);
    const [configLoaded, setConfigLoaded] = useState(false);

    // Fetch config from settings
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res: any = await api.settings.getPublic();
                if (res?.POPUP_FOMO_CONFIG) {
                    const parsed = JSON.parse(res.POPUP_FOMO_CONFIG);
                    setConfig(parsed);
                } else {
                    // No config saved yet → use defaults (enabled)
                    setConfig({ enabled: true, actions: DEFAULT_ACTIONS, showEvery: 25000, duration: 6000 });
                }
            } catch {
                // Fallback on error
                setConfig({ enabled: true, actions: DEFAULT_ACTIONS, showEvery: 25000, duration: 6000 });
            }
            setConfigLoaded(true);
        };
        loadConfig();
    }, []);

    const actions = config?.actions?.length ? config.actions : DEFAULT_ACTIONS;
    const showEvery = config?.showEvery || 25000;
    const duration = config?.duration || 6000;

    const generateEvent = useCallback((): FomoEvent => {
        return {
            id: Math.random().toString(36).substring(7),
            name: NAMES[Math.floor(Math.random() * NAMES.length)],
            location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            time: TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)],
        };
    }, [actions]);

    const showNext = useCallback(() => {
        setCurrentEvent(generateEvent());
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
        }, duration);
    }, [duration, generateEvent]);

    useEffect(() => {
        if (!configLoaded || !config?.enabled) return;

        const initialDelay = setTimeout(() => {
            showNext();
        }, 5000);

        const interval = setInterval(() => {
            showNext();
        }, showEvery);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, [configLoaded, config?.enabled, showEvery, showNext]);

    // Don't render if disabled or config not loaded
    if (!configLoaded || !config?.enabled) return null;

    return (
        <div className={cn("fixed bottom-6 left-6 z-[100] pointer-events-none", className)}>
            <AnimatePresence>
                {isVisible && currentEvent && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="pointer-events-auto group relative w-72 md:w-80 overflow-hidden rounded-lg bg-black backdrop-blur-md border border-zinc-800 shadow-lg flex items-center p-3.5 gap-3.5"
                    >
                        {/* Left Icon Area */}
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-zinc-900" />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-1.5 mb-0.5">
                                <span className="text-[13px] font-semibold text-zinc-100">
                                    {currentEvent.name}
                                </span>
                                <span className="text-[12px] text-zinc-400">đến từ</span>
                                <span className="text-[13px] font-semibold text-zinc-200">
                                    {currentEvent.location}
                                </span>
                            </div>
                            <p className="text-[12px] text-zinc-400 font-medium leading-tight mb-0.5">
                                {currentEvent.action}
                            </p>
                            <span className="text-[10px] text-zinc-500 block">
                                {currentEvent.time}
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="self-start p-1 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
