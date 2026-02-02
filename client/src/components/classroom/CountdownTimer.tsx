'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/Card';

interface CountdownTimerProps {
    targetDate: string; // ISO string
    onComplete?: () => void;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer({ targetDate, onComplete, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                if (!isCompleted) {
                    setIsCompleted(true);
                    onComplete?.();
                }
            }

            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate, isCompleted, onComplete]);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-background text-foreground border-2 border-primary/20 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-sm">
                {value < 10 ? `0${value}` : value}
            </div>
            <span className="text-xs uppercase tracking-wide text-muted-foreground mt-2 font-medium">
                {label}
            </span>
        </div>
    );

    if (isCompleted) {
        return (
            <div className={cn("text-center animate-pulse", className)}>
                <h3 className="text-2xl font-bold text-green-500">Đã bắt đầu!</h3>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center justify-center gap-3 md:gap-6", className)}>
            <TimeUnit value={timeLeft.days} label="Ngày" />
            <span className="text-2xl font-bold text-muted-foreground -mt-6">:</span>
            <TimeUnit value={timeLeft.hours} label="Giờ" />
            <span className="text-2xl font-bold text-muted-foreground -mt-6">:</span>
            <TimeUnit value={timeLeft.minutes} label="Phút" />
            <span className="text-2xl font-bold text-muted-foreground -mt-6">:</span>
            <TimeUnit value={timeLeft.seconds} label="Giây" />
        </div>
    );
}
