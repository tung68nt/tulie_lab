'use client';

import { Suspense } from 'react';
import { ContentProtector } from './system/security/ContentProtector';
import { ActivityTracker } from './ActivityTracker';
import { BackToTop } from './BackToTop';
import { LandingPageNotifications } from './notifications/LandingPageNotifications';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    // Layout strategy:
    // Public pages: Full width (Sections handle their own containers)
    // Admin/Learn: Managed by their own layouts
    return (
        <div className="relative flex min-h-screen flex-col overflow-clip">
            <div id="top-banner-portal" className="sticky top-0 z-[60]" />
            <Suspense fallback={null}>
                <ActivityTracker />
                <ContentProtector />
                <LandingPageNotifications />
            </Suspense>
            <main className="flex-1">
                {children}
            </main>
            <BackToTop />
        </div>
    );
}
