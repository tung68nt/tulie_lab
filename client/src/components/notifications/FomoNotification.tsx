'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FomoEvent {
    id: string;
    name: string;
    location: string;
    action: string;
    time: string;
    isReal?: boolean;
}

const MOCK_NAMES = ['Anh T.', 'Chị H.', 'Minh N.', 'Linh V.', 'Hoàng D.', 'Thảo P.', 'Dũng K.', 'Trang L.', 'Quỳnh N.', 'Sơn B.'];
const MOCK_LOCATIONS = ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Vũng Tàu', 'Bình Dương', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Quảng Ninh', 'Huế'];
const MOCK_ACTIONS = [
    'vừa đăng ký khóa Vibe Coding',
    'vừa đặt mua Ebook Google Sheets Pro',
    'vừa tham gia cộng đồng Solo Founder',
    'vừa nhận tư vấn lộ trình 1:1',
    'vừa kích hoạt gói Hội viên Pro'
];

interface FomoNotificationProps {
    className?: string;
    showEvery?: number; // ms
    duration?: number; // ms
}

export function FomoNotification({ className, showEvery = 25000, duration = 6000 }: FomoNotificationProps) {
    const [currentEvent, setCurrentEvent] = useState<FomoEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [realEvents, setRealEvents] = useState<FomoEvent[]>([]);

    useEffect(() => {
        const fetchRealEvents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/recent`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setRealEvents(data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch real FOMO data', error);
            }
        };
        fetchRealEvents();
    }, []);

    const generateMockEvent = useCallback((): FomoEvent => {
        return {
            id: Math.random().toString(36).substring(7),
            name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
            location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
            action: MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)],
            time: 'Vừa xong',
            isReal: false,
        };
    }, []);

    const showNext = useCallback(() => {
        let nextEvent: FomoEvent;

        if (realEvents.length > 0) {
            // 70% Real data if available, 30% Mock for diversity
            if (Math.random() > 0.3) {
                nextEvent = realEvents[Math.floor(Math.random() * realEvents.length)];
            } else {
                nextEvent = generateMockEvent();
            }
        } else {
            nextEvent = generateMockEvent();
        }

        setCurrentEvent(nextEvent);
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
        }, duration);
    }, [duration, generateMockEvent, realEvents]);

    useEffect(() => {
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
    }, [showEvery, showNext]);

    return (
        <div className={cn("fixed bottom-6 left-6 z-[100] pointer-events-none", className)}>
            <AnimatePresence>
                {isVisible && currentEvent && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="pointer-events-auto group relative w-72 md:w-80 overflow-hidden rounded-2xl bg-[#09090b]/90 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] flex items-center p-4 gap-4"
                    >
                        {/* Left Icon Area */}
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-[#09090b] flex items-center justify-center animate-pulse" />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-1.5 mb-1">
                                <span className="text-[13px] font-bold text-cyan-400">
                                    {currentEvent.name}
                                </span>
                                <span className="text-[12px] text-zinc-300">đến từ</span>
                                <span className="text-[13px] font-bold text-zinc-100">
                                    {currentEvent.location}
                                </span>
                            </div>
                            <p className="text-[12px] text-zinc-400 font-medium leading-tight mb-1">
                                {currentEvent.action}
                            </p>
                            <span className="text-[10px] text-zinc-500 block">
                                {currentEvent.time}
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="self-start p-1 rounded-full text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Glass Overlay Glow */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 blur-2xl rounded-full" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
