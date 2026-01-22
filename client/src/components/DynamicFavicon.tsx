'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';

export function DynamicFavicon() {
    const { settings } = useSettings();

    useEffect(() => {
        if (settings?.site_favicon) {
            // Remove all existing favicon links (including apple-touch-icon, shortcut icon, etc.)
            const existingLinks = document.querySelectorAll('link[rel*="icon"]');
            existingLinks.forEach(link => link.remove());

            // Add cache-busting parameter to force browser to reload
            const faviconUrl = settings.site_favicon.includes('?')
                ? `${settings.site_favicon}&t=${Date.now()}`
                : `${settings.site_favicon}?t=${Date.now()}`;

            // Add new favicon link
            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/x-icon';
            link.href = faviconUrl;
            document.head.appendChild(link);

            // Also add shortcut icon for better compatibility
            const shortcutLink = document.createElement('link');
            shortcutLink.rel = 'shortcut icon';
            shortcutLink.type = 'image/x-icon';
            shortcutLink.href = faviconUrl;
            document.head.appendChild(shortcutLink);
        }
    }, [settings?.site_favicon]);

    return null;
}
