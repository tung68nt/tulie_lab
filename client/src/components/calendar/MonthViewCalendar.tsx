'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Event {
    date: string;
    time: string;
    title: string;
    type: string;
    link: string;
}

interface MonthViewCalendarProps {
    events: Event[];
}

export function MonthViewCalendar({ events }: MonthViewCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // Mock starting at Oct 2025 based on sample data

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month); // 0 (Sun) to 6 (Sat)

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    const getEventsForDay = (day: number) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === dateString);
    };

    return (
        <div className="bg-card border rounded-2xl overflow-hidden shadow-xl">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b bg-muted/30">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="h-12 w-12 flex items-center justify-center hover:bg-muted rounded-xl transition-colors border shadow-sm"
                        aria-label="Tháng trước"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="h-12 w-12 flex items-center justify-center hover:bg-muted rounded-xl transition-colors border shadow-sm"
                        aria-label="Tháng sau"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-7 mb-4">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                        <div key={day} className="text-center text-xs font-bold text-muted-foreground tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {blanks.map((i) => (
                        <div key={`blank-${i}`} className="aspect-square bg-muted/10 rounded-lg" />
                    ))}
                    {days.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "min-h-[100px] sm:min-h-[120px] p-2 border rounded-xl flex flex-col items-start justify-start relative transition-all duration-300 group hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                                    hasEvents ? "border-primary/20 bg-primary/5" : "border-muted/40 bg-card"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                    hasEvents ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                                )}>
                                    {day}
                                </span>

                                {hasEvents && (
                                    <div className="w-full space-y-1.5 overflow-hidden">
                                        {dayEvents.slice(0, 2).map((e, idx) => (
                                            <a
                                                key={idx}
                                                href={e.link}
                                                onClick={(ev) => ev.stopPropagation()}
                                                className="block w-full px-2 py-1 rounded bg-background/80 border border-primary/10 hover:border-primary/40 hover:bg-background transition-all"
                                            >
                                                <div className="text-[9px] font-bold text-primary/70 leading-none mb-0.5">{e.time}</div>
                                                <div className="text-[10px] sm:text-[11px] font-bold leading-tight truncate group-hover:text-primary transition-colors">
                                                    {e.title}
                                                </div>
                                            </a>
                                        ))}

                                        {dayEvents.length > 2 && (
                                            <div className="text-[10px] font-bold text-muted-foreground/60 px-2 animate-pulse">
                                                +{dayEvents.length - 2} sự kiện khác...
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Hover Event Info Tooltip */}
                                {hasEvents && (
                                    <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-2xl bg-popover text-popover-foreground shadow-2xl border opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-md 
                                        after:content-[''] after:absolute after:top-full after:left-0 after:right-0 after:h-6 after:bg-transparent">
                                        <div className="text-sm font-bold text-primary mb-3 flex justify-between items-center border-b pb-2 border-primary/10">
                                            <span>Sự kiện ngày {day}</span>
                                            <span className="bg-primary/5 px-2 py-0.5 rounded text-[10px] font-medium text-primary/70">{dayNames[new Date(year, month, day).getDay()]}</span>
                                        </div>
                                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                            {dayEvents.map((e, idx) => (
                                                <div key={idx} className="group/item pb-3 border-b last:border-0 last:pb-0 border-muted/50">
                                                    <div className="flex justify-between items-start gap-2 mb-1.5">
                                                        <span className="text-[10px] font-bold text-muted-foreground">{e.time}</span>
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{e.type.toLowerCase()}</span>
                                                    </div>
                                                    <div className="font-bold text-sm leading-tight mb-3 group-hover/item:text-primary transition-colors text-foreground">
                                                        {e.title}
                                                    </div>
                                                    <a
                                                        href={e.link}
                                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:gap-2 transition-all"
                                                        onClick={(ev) => ev.stopPropagation()}
                                                    >
                                                        Xem chi tiết
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Tooltip arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-popover border-r border-b rotate-45 -mt-2 shadow-xl"></div>
                                    </div>
                                )}
                            </div>

                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="px-6 py-4 bg-muted/20 border-t flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    <span>Có sự kiện</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded border border-muted-foreground/30"></div>
                    <span>Ngày trống</span>
                </div>
            </div>
        </div>
    );
}
