import React from 'react';
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Metadata } from 'next';
import { DEFAULT_CALENDAR_SECTIONS } from '@/lib/defaultContent';

export const metadata: Metadata = {
    title: 'Lịch hoạt động | The Tulie Lab',
    description: 'Cập nhật lịch khai giảng, webinar và workshop mới nhất từ The Tulie Lab.',
};

export const dynamic = 'force-dynamic';

export default function CalendarPage() {
    return <LandingPageRenderer slug="calendar" fallbackSections={DEFAULT_CALENDAR_SECTIONS} />;
}

