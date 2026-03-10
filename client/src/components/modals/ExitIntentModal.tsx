'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Gamepad2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

export function ExitIntentModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
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
    }, [hasShown]);

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
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-[#0c0c0e] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-8 md:p-12 text-center"
                    >
                        {/* Header Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Khoan đã!
                        </div>

                        {/* Title & Agitation */}
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
                            🔴 ĐỪNG BỎ VỀ TAY TRẮNG...
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base font-medium mb-8 leading-relaxed">
                            Có phải bạn vẫn đang lăn tăn: <br />
                            <span className="text-white italic">"Liệu mình có thực sự làm được không?"</span>
                        </p>

                        <div className="text-zinc-500 text-xs md:text-sm mb-10 leading-relaxed max-w-md mx-auto">
                            Bạn chưa vội mua cũng được. Nhưng đừng để sự nghi ngờ cản trở cơ hội của mình.
                            Hãy để <span className="text-cyan-400 font-bold">The Tulie Lab</span> giúp bạn
                            kiểm tra <span className="text-green-500 font-bold">miễn phí</span> xem ý tưởng
                            của bạn có tiềm năng hay không nhé! 👇
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-4">
                            {/* Option 1 */}
                            <button
                                className="w-full group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/50 hover:bg-zinc-800/80 transition-all duration-300"
                            >
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-500 text-[10px] font-bold flex items-center justify-center">1</span>
                                    <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-orange-400 transition-colors">Tôi muốn tự kiểm tra</span>
                                    <span className="bg-green-500/20 text-green-500 text-[8px] px-1.5 py-0.5 rounded-sm font-bold">ƯU TIÊN</span>
                                </div>

                                <div className="mt-4 flex flex-col items-center">
                                    <p className="text-xs text-zinc-400 mb-2 font-medium">🎮 CHƠI GAME "MÁY DÒ Ý TƯỞNG" - Kết quả sau 30s</p>
                                    <div className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-3 rounded-xl font-black text-sm md:text-base shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                                        <Gamepad2 className="w-5 h-5" />
                                        THẨM ĐỊNH Ý TƯỞNG FREE NGAY
                                    </div>
                                </div>
                            </button>

                            {/* Option 2 */}
                            <button
                                className="w-full group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all duration-300"
                            >
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-500 text-[10px] font-bold flex items-center justify-center">2</span>
                                    <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-cyan-400 transition-colors">Tôi cần người tư vấn</span>
                                </div>

                                <div className="mt-4 flex flex-col items-center">
                                    <p className="text-xs text-zinc-400 mb-2 font-medium">💬 Gặp khó ở đâu, nhắn Zalo mình gỡ rối ở đó</p>
                                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-black text-sm md:text-base shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        CHAT VỚI FOUNDER (0393137755)
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Footer Text */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-8 text-zinc-600 hover:text-white text-xs font-medium transition-colors"
                        >
                            Không, tôi muốn tiếp tục xem trang
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full text-zinc-600 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
