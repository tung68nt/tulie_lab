'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowLeft, ArrowRight, Timer, TrendingDown } from 'lucide-react';
import { Section } from '@/types/sections';
import { useSectionPreview } from '@/components/SectionRenderer';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// Helper component for displaying time units
// Helper component for displaying time units
function TimeUnit({ value, label, className }: { value: number; label: string; className?: string }) {
    return (
        <div className={`flex flex-col items-center gap-0.5 ${className}`}>
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center relative shadow-xl overflow-hidden group border border-white/10">
                {/* Modern Glassmorphism Background */}
                <div className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-md" />

                <span className="relative z-10 text-lg md:text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-[7px] md:text-[8px] uppercase font-bold text-neutral-500 tracking-wider drop-shadow-sm px-1">
                {label}
            </span>
        </div>
    );
}

export function SalesCountdownSection({ section }: { section: Section }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const INITIAL_MINUTES = 39;
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [isSticky, setIsSticky] = useState(false); // This state is no longer used due to portal
    const isPreview = useSectionPreview();

    useEffect(() => {
        if (section.highlight) {
            setTargetDate(new Date(section.highlight));
        } else {
            const duration = (section as any).duration || (section as any).settings?.duration || INITIAL_MINUTES;
            setTargetDate(new Date(new Date().getTime() + duration * 60 * 1000));
        }

        // Measure height and set global CSS variable
        const updateHeight = () => {
            const h = document.getElementById('sales-countdown-section')?.offsetHeight || 0;
            document.documentElement.style.setProperty('--countdown-height', `${h}px`);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
            document.documentElement.style.setProperty('--countdown-height', '0px');
        };
    }, []);

    const ctaLink = section.ctaLink || '/register';
    const ctaText = section.ctaText || 'Đăng ký ngay';

    useEffect(() => {
        if (!targetDate) return;

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return newTimeLeft;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const content = (
        <section id="sales-countdown-section" className="w-full bg-[#0a0a0a] text-white py-2 md:py-3 border-b border-yellow-500/20 shadow-2xl overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 via-transparent to-yellow-900/10 animate-pulse-slow pointer-events-none" />

            <div className="container relative z-10 px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 lg:gap-12">
                    {/* Urgency Badge - Hidden on very small screens */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">Ưu đãi sắp hết</span>
                    </div>

                    {/* Countdown */}
                    {/* Countdown */}
                    <div className="flex items-start gap-1.5 md:gap-2">
                        <TimeUnit value={timeLeft.days} label="ngày" className={timeLeft.days > 0 ? "animate-breathe" : ""} />
                        <div className="h-9 md:h-12 flex items-center justify-center">
                            <span className="text-sm font-bold text-yellow-500/40 animate-pulse -mt-1">:</span>
                        </div>
                        <TimeUnit value={timeLeft.hours} label="giờ" className={timeLeft.hours > 0 || timeLeft.days > 0 ? "animate-breathe" : ""} />
                        <div className="h-9 md:h-12 flex items-center justify-center">
                            <span className="text-sm font-bold text-yellow-500/40 animate-pulse -mt-1">:</span>
                        </div>
                        <TimeUnit value={timeLeft.minutes} label="phút" className={timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0 ? "animate-breathe" : ""} />
                        <div className="h-9 md:h-12 flex items-center justify-center">
                            <span className="text-sm font-bold text-yellow-500/40 animate-pulse -mt-1">:</span>
                        </div>
                        <TimeUnit value={timeLeft.seconds} label="giây" className="animate-breathe" />
                    </div>

                    {/* Price & CTA Bundle */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl md:text-5xl font-bold text-yellow-500 drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)] tracking-tighter">
                                999.000<span className="text-lg align-top ml-0.5 text-yellow-600 font-semibold">đ</span>
                            </span>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-xs line-through text-white/40 leading-none mb-1">4.500.000đ</span>
                                <span className="bg-yellow-500 text-black text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded leading-none">-78%</span>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            onClick={() => {
                                const el = document.getElementById('payment-section');
                                if (el) {
                                    const offset = 120;
                                    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                                    window.scrollTo({
                                        top: elementPosition - offset,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-9 px-6 rounded-lg shadow-lg hover:scale-105 transition-all text-xs"
                        >
                            {(ctaText.includes('50%') || ctaText.includes('tư vấn') || ctaText === 'Đăng ký ngay') ? 'Đăng ký ngay' : ctaText}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
    if (!mounted) return null;

    // Use portal only if NOT in preview mode
    const portalTarget = typeof document !== 'undefined' ? document.getElementById('top-banner-portal') : null;
    if (portalTarget && !isPreview) {
        return createPortal(content, portalTarget);
    }

    return content;
}
