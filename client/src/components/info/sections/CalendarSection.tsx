'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/types/sections';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Calendar as CalendarIcon, List as ListIcon, ExternalLink } from 'lucide-react';
import { MonthViewCalendar } from '@/components/calendar/MonthViewCalendar';
import { Button } from '@/components/Button';
import { SectionBackground } from '../SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { StandardSectionHeader } from '../StandardSectionHeader';

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

export const CalendarSection = ({ section }: { section: Section }) => {
    const [viewMode, setViewMode] = useState<'list' | 'month'>('month');
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res: any = await api.events.getUpcoming();
            setEvents(res.data || []);
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

    return (
        <section className="py-10 md:py-16 relative overflow-hidden transition-colors duration-300" id={section.id}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
            />
            <div className="container relative z-10 mx-auto px-4">
                <div className="relative">
                    <StandardSectionHeader
                        section={section}
                        tagOverride={section.tag || "Lịch khai giảng"}
                        align="center"
                        className="mb-4 md:mb-8"
                        subtitleOverride={section.subtitle || "Cập nhật lộ trình học tập và thời gian khai giảng các khóa học mới nhất."}
                        titleOverride={section.title || "Lịch Khai Giảng & Lộ Trình"}
                    />
                </div>

                <div className="flex justify-center md:justify-end mb-8 relative z-20">
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

                {/* If no title provided, still show toggle but simpler layout? 
                Actually the toggle was part of the header area. 
                Let's make sure the toggle is always visible.
            */}


                {loading ? (
                    <div className="text-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                        <p className="text-muted-foreground">Đang tải lịch hoạt động...</p>
                    </div>
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
                                        <div className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-secondary text-secondary-foreground mb-2">
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
        </section>
    );
};
