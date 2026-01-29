'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: Date;
    title?: string;
    onExpire?: () => void;
}

export function CountdownTimer({ targetDate, title = "Ưu đãi kết thúc sau:", onExpire }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                if (onExpire) onExpire();
                return null; // Expired
            }
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (!remaining) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onExpire]);

    if (!timeLeft) return null;

    return (
        <div className="flex flex-col items-center p-4 bg-primary/10 rounded-xl border border-primary/20 animate-pulse-slow">
            {title && <p className="text-sm font-semibold text-primary mb-2 tracking-wider">{title}</p>}
            <div className="flex items-center gap-3 text-foreground">
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-bold bg-background px-2 py-1 rounded shadow-sm min-w-[2ch]">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Ngày</span>
                </div>
                <span className="text-xl font-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-bold bg-background px-2 py-1 rounded shadow-sm min-w-[2ch]">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Giờ</span>
                </div>
                <span className="text-xl font-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-bold bg-background px-2 py-1 rounded shadow-sm min-w-[2ch]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Phút</span>
                </div>
                <span className="text-xl font-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-bold bg-background px-2 py-1 rounded shadow-sm min-w-[2ch]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 text-center">Giây</span>
                </div>
            </div>
        </div>
    );
}
