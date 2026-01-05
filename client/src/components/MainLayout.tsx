'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ContentProtector } from './security/ContentProtector';
import { ActivityTracker } from './ActivityTracker';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const isLearnPage = pathname?.startsWith('/learn');
    const isAdminPage = pathname?.startsWith('/admin');

    // Layout strategy:
    // Public pages: Full width (Sections handle their own containers)
    // Admin/Learn: Managed by their own layouts
    return (
        <div className="relative flex min-h-screen flex-col">
            <Suspense fallback={null}>
                <ActivityTracker />
                <ContentProtector />
            </Suspense>
            <Navbar />
            <main className={`flex-1 ${isLearnPage ? '' : 'pt-14'}`}>
                {children}
            </main>
            {!isLearnPage && <Footer />}
        </div>
    );
}
