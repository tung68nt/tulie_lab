'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';

export function DynamicFavicon() {
    const { settings } = useSettings();

    useEffect(() => {
        if (settings?.site_favicon) {
            // Remove existing favicon links
            const existingLinks = document.querySelectorAll('link[rel="icon"]');
            existingLinks.forEach(link => link.remove());

            // Add new favicon link
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = settings.site_favicon;
            document.head.appendChild(link);
        }
    }, [settings?.site_favicon]);

    return null;
}
