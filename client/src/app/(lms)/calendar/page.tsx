
'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { Section } from '@/types/sections';
import { CTASection } from '@/components/info/sections/CTASection';
import Link from 'next/link';
import { Calendar as CalendarIcon, List as ListIcon, ExternalLink } from 'lucide-react';
import { MonthViewCalendar } from '@/components/calendar/MonthViewCalendar';
import { api } from '@/lib/api';

interface Event {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    type: 'WEBINAR' | 'WORKSHOP' | 'COURSE' | 'MEETUP' | 'OTHER';
    link?: string;
    isActive: boolean;
}

const EVENT_TYPE_LABELS: Record<Event['type'], string> = {
    WEBINAR: 'Webinar',
    WORKSHOP: 'Workshop',
    COURSE: 'Khóa học',
    MEETUP: 'Meetup',
    OTHER: 'Khác'
};

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<'list' | 'month'>('month');
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res = await api.events.getUpcoming() as Event[];
            setEvents(res);
        } catch (error) {
            console.error('Failed to load events', error);
        } finally {
            setLoading(false);
        }
    };

    const formatEventForCalendar = (event: Event) => ({
        date: event.date.split('T')[0],
        time: event.time || '',
        title: event.title,
        type: EVENT_TYPE_LABELS[event.type],
        link: event.link || '#'
    });

    const calendarEvents = events.map(formatEventForCalendar);

    const heroSection: Section = {
        id: 'calendar-hero',
        type: 'hero',
        title: 'Lịch hoạt động',
        subtitle: 'Đừng bỏ lỡ các sự kiện nổi bật',
        content: 'Cập nhật lịch khai giảng, webinar và workshop mới nhất từ The Tulie Lab.',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop',
        buttons: [],
        isVisible: true,
        order: 1
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <HeroSection section={heroSection} />

                <div className="container py-12 max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h2 className="text-3xl font-bold tracking-tight">Sự kiện sắp tới</h2>

                        <div className="flex bg-muted p-1 rounded-xl border shadow-inner">
                            <button
                                onClick={() => setViewMode('month')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'month'
                                    ? 'bg-card text-primary shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <CalendarIcon className="w-4 h-4" />
                                Xem tháng
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'list'
                                    ? 'bg-card text-primary shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <ListIcon className="w-4 h-4" />
                                Danh sách
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Đang tải...</div>
                    ) : viewMode === 'month' ? (
                        <MonthViewCalendar events={calendarEvents} />
                    ) : (
                        <div className="space-y-4">
                            {calendarEvents.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                                    Hiện chưa có sự kiện nào được lên lịch.
                                </div>
                            ) : (
                                calendarEvents.map((event, index) => (
                                <Link
                                    key={index}
                                    href={event.link}
                                    className="flex flex-col md:flex-row items-start md:items-center p-6 border rounded-2xl hover:border-primary/50 transition-all bg-card hover:shadow-lg group"
                                >
                                    <div className="md:w-32 flex-shrink-0 mb-4 md:mb-0">
                                        <div className="text-xl font-bold text-primary">{event.date}</div>
                                        <div className="text-sm text-muted-foreground font-medium">{event.time}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-secondary text-secondary-foreground mb-2 uppercase tracking-wide">
                                            {event.type}
                                        </div>
                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                                    </div>
                                    <div className="mt-6 md:mt-0">
                                        <div className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-primary border-2 border-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                                            <span>Xem chi tiết</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            )))}
                        </div>
                    )}
                </div>

                <CTASection section={{
                    id: 'calendar-cta',
                    type: 'cta',
                    title: 'Không tìm thấy lịch phù hợp?',
                    subtitle: 'Liên hệ với chúng tôi để được tư vấn lộ trình riêng.',
                    buttons: [{ label: 'Liên hệ tư vấn', href: '/contact', variant: 'primary' }],
                    isVisible: true,
                    order: 3
                }} />
            </main >
        </div >
    );
}

