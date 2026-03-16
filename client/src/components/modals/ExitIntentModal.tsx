'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight, Zap, Users, TrendingUp, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';

interface FeaturedItem {
    title: string;
    price: string;
    originalPrice?: string;
    link: string;
    badge?: string;
}

interface ExitConfig {
    enabled: boolean;
    theme: 'dark' | 'light';
    highlight: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
    featuredItems: FeaturedItem[];
    featuredTitle: string;
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    secondaryLink: string;
    idleTimeout: number;
}

const DEFAULT_CONFIG: ExitConfig = {
    enabled: true,
    theme: 'dark',
    highlight: '🔥 Hơn 500+ học viên đã tham gia tuần này',
    title: 'Chờ chút — Đừng bỏ lỡ!',
    description: 'Bạn đang cách một bước để sở hữu bộ công cụ & khoá học giúp tự động hóa công việc, tiết kiệm hàng chục giờ mỗi tuần.',
    stats: [
        { value: '2,000+', label: 'Học viên' },
        { value: '50+', label: 'Sản phẩm số' },
        { value: '4.9/5', label: 'Đánh giá' },
    ],
    featuredTitle: '⭐ Khoá học bán chạy nhất',
    featuredItems: [
        { title: 'Vibe Coding cho người mới', price: '499K', originalPrice: '990K', link: '/courses', badge: 'Best Seller' },
        { title: 'Hệ thống Quản lý Nhân sự (HRM)', price: '299K', originalPrice: '599K', link: '/san-pham', badge: 'Hot' },
        { title: 'AI Content Generator Template', price: '199K', link: '/san-pham', badge: '' },
    ],
    primaryText: 'Xem tất cả sản phẩm',
    primaryLink: '/san-pham',
    secondaryText: 'Chat tư vấn miễn phí',
    secondaryLink: 'https://zalo.me/0393137755',
    idleTimeout: 0,
};

// Theme-based class maps
const t = (theme: 'dark' | 'light') => {
    const d = theme === 'dark';
    return {
        modal: d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200',
        pattern: d ? 'opacity-[0.06]' : 'opacity-[0.04]',
        glow1: d ? 'bg-indigo-500/20 blur-[100px]' : 'bg-indigo-300/10 blur-[120px]',
        glow2: d ? 'bg-purple-500/15 blur-[100px]' : 'bg-purple-300/8 blur-[120px]',
        highlightBg: d ? 'bg-gradient-to-r from-zinc-800 to-zinc-800/50 border-zinc-700/50' : 'bg-gradient-to-r from-zinc-100 to-zinc-50 border-zinc-200',
        highlightText: d ? 'text-zinc-300' : 'text-zinc-600',
        close: d ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100',
        title: d ? 'text-zinc-100' : 'text-zinc-900',
        desc: d ? 'text-zinc-400' : 'text-zinc-500',
        statBg: d ? 'bg-zinc-800/60 border-zinc-700/40' : 'bg-zinc-50 border-zinc-200',
        statVal: d ? 'text-zinc-100' : 'text-zinc-900',
        statLabel: d ? 'text-zinc-500' : 'text-zinc-400',
        statIcon: d ? 'text-zinc-500' : 'text-zinc-400',
        featTitle: d ? 'text-zinc-400' : 'text-zinc-500',
        itemBg: d ? 'bg-zinc-800/40 border-zinc-700/30 hover:bg-zinc-800/70 hover:border-zinc-600/50' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300',
        itemIcon: d ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-200 text-zinc-500',
        itemTitle: d ? 'text-zinc-200' : 'text-zinc-800',
        itemPrice: d ? 'text-zinc-100' : 'text-zinc-900',
        itemOriginal: d ? 'text-zinc-500' : 'text-zinc-400',
        itemArrow: d ? 'text-zinc-600' : 'text-zinc-400',
        badge: d ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' : 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        primaryBtn: d ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800',
        secondaryBtn: d ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        dismiss: d ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600',
    };
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
            } catch {}
            setConfigLoaded(true);
        };
        loadConfig();
    }, []);

    const showModal = () => { if (hasShown) return; setIsOpen(true); setHasShown(true); sessionStorage.setItem('exit_intent_shown', 'true'); };

    useEffect(() => {
        if (!configLoaded || !config.enabled) return;
        const shown = sessionStorage.getItem('exit_intent_shown');
        if (shown) { setHasShown(true); return; }
        const handleMouseLeave = (e: MouseEvent) => { if (e.clientY <= 0 && !hasShown) showModal(); };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShown, configLoaded, config.enabled]);

    useEffect(() => {
        if (!configLoaded || !config.enabled || hasShown || !config.idleTimeout || config.idleTimeout <= 0) return;
        if (sessionStorage.getItem('exit_intent_shown')) return;
        let idleTimer: ReturnType<typeof setTimeout>;
        const resetIdle = () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => showModal(), config.idleTimeout * 1000); };
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(e => document.addEventListener(e, resetIdle, { passive: true }));
        idleTimer = setTimeout(() => showModal(), config.idleTimeout * 1000);
        return () => { clearTimeout(idleTimer); events.forEach(e => document.removeEventListener(e, resetIdle)); };
    }, [configLoaded, config.enabled, config.idleTimeout, hasShown]);

    if (!configLoaded || !config.enabled) return null;

    const isExternal = config.secondaryLink?.startsWith('http');
    const statIcons = [Users, TrendingUp, Zap];
    const c = t(config.theme || 'dark');

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`relative w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl max-h-[90vh] overflow-y-auto ${c.modal}`}
                    >
                        {/* Dot pattern background */}
                        <div className={`absolute inset-0 pointer-events-none ${c.pattern}`} style={{ backgroundImage: 'radial-gradient(circle, currentColor 0.8px, transparent 0.8px)', backgroundSize: '24px 24px' }} />
                        {/* Glow effects */}
                        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none ${c.glow1}`} />
                        <div className={`absolute -bottom-16 -left-16 w-36 h-36 rounded-full pointer-events-none ${c.glow2}`} />
                        {config.highlight && (
                            <div className={`px-6 py-2.5 border-b text-center sticky top-0 z-10 ${c.highlightBg}`}>
                                <span className={`text-xs font-semibold ${c.highlightText}`}>{config.highlight}</span>
                            </div>
                        )}
                        <div className="p-6 md:p-8">
                            <button onClick={() => setIsOpen(false)} className={`absolute top-3 right-3 p-1.5 rounded-md transition-colors z-20 ${c.close}`}><X className="w-4 h-4" /></button>
                            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${c.title}`}>{config.title}</h2>
                            <p className={`text-sm mb-5 leading-relaxed ${c.desc}`}>{config.description}</p>

                            {config.stats?.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {config.stats.map((stat, i) => {
                                        const Icon = statIcons[i % statIcons.length];
                                        return (
                                            <div key={i} className={`text-center p-3 rounded-lg border ${c.statBg}`}>
                                                <Icon className={`w-4 h-4 mx-auto mb-1 ${c.statIcon}`} />
                                                <div className={`text-lg font-bold ${c.statVal}`}>{stat.value}</div>
                                                <div className={`text-[10px] font-medium ${c.statLabel}`}>{stat.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {config.featuredItems?.length > 0 && (
                                <div className="mb-6">
                                    {config.featuredTitle && <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${c.featTitle}`}>{config.featuredTitle}</p>}
                                    <div className="space-y-2">
                                        {config.featuredItems.map((item, i) => (
                                            <a key={i} href={item.link} className={`flex items-center gap-3 p-3 rounded-lg border transition-all group ${c.itemBg}`}>
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.itemIcon}`}><ShoppingBag className="w-4 h-4" /></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-medium truncate ${c.itemTitle}`}>{item.title}</span>
                                                        {item.badge && <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${c.badge}`}>{item.badge}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`text-sm font-bold ${c.itemPrice}`}>{item.price}</span>
                                                        {item.originalPrice && <span className={`text-xs line-through ${c.itemOriginal}`}>{item.originalPrice}</span>}
                                                    </div>
                                                </div>
                                                <ArrowRight className={`w-4 h-4 shrink-0 ${c.itemArrow}`} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <a href={config.primaryLink} className={`flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-semibold shadow-sm transition-all ${c.primaryBtn}`}>
                                    {config.primaryText} <ArrowRight className="w-4 h-4" />
                                </a>
                                <a href={config.secondaryLink} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}
                                    className={`flex items-center justify-center gap-2 w-full h-11 rounded-lg border bg-transparent text-sm font-medium transition-colors ${c.secondaryBtn}`}>
                                    <MessageCircle className="w-4 h-4" /> {config.secondaryText}
                                </a>
                            </div>
                            <button onClick={() => setIsOpen(false)} className={`mt-4 w-full text-center text-xs font-medium transition-colors ${c.dismiss}`}>Không, cảm ơn</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
