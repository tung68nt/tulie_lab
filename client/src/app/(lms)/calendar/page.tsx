
'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { Section } from '@/types/sections';
import { CTASection } from '@/components/info/sections/CTASection';
import Link from 'next/link';
import { Calendar as CalendarIcon, List as ListIcon, ExternalLink } from 'lucide-react';
import { MonthViewCalendar } from '@/components/calendar/MonthViewCalendar';

// Mock Events Data
const EVENTS = [
    { date: '2025-10-15', time: '20:00', title: 'Webinar: Nhập môn Vibe Coding', type: 'Webinar', link: '/courses/vibe-coding-intro' },
    { date: '2025-10-20', time: '19:30', title: 'Workshop: AI cho Marketing', type: 'Workshop', link: '/courses/ai-marketing-workshop' },
    { date: '2025-11-01', time: '09:00', title: 'Khai giảng: Master Apps Script K15', type: 'Course', link: '/courses/master-apps-script-k15' },
    { date: '2025-11-15', time: '20:00', title: 'Webinar: Next.js 15 & Turbopack', type: 'Webinar', link: '/courses/nextjs-turbopack-webinar' },
];

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState<'list' | 'month'>('month');

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

                <div className="container py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h2 className="text-3xl font-bold tracking-tight">Sự kiện sắp tới</h2>

                            <div className="flex bg-muted p-1 rounded-xl border shadow-inner">
                                <button
                                    onClick={() => setViewMode('month')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'month'
                                        ? 'bg-card text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <CalendarIcon className="w-4 h-4" />
                                    Xem tháng
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'list'
                                        ? 'bg-card text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <ListIcon className="w-4 h-4" />
                                    Danh sách
                                </button>
                            </div>
                        </div>

                        {viewMode === 'month' ? (
                            <MonthViewCalendar events={EVENTS} />
                        ) : (
                            <div className="space-y-4">
                                {EVENTS.map((event, index) => (
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
                                ))}
                            </div>
                        )}
                    </div>
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
            </main>
        </div>
    );
}

