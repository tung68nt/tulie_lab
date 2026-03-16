'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FomoNotification } from './FomoNotification';
import { ExitIntentModal } from '../modals/ExitIntentModal';

export function LandingPageNotifications() {
    const pathname = usePathname();

    // Only show on landing pages or home
    // Landing pages follow the pattern /p/[slug]
    const isLandingPage = pathname === '/' || pathname.startsWith('/p/');

    if (!isLandingPage) return null;

    return (
        <>
            <FomoNotification />
            <ExitIntentModal />
        </>
    );
}
