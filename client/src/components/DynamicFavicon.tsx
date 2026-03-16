'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';

export function DynamicFavicon() {
    const { settings } = useSettings();

    useEffect(() => {
        if (!settings?.site_favicon) return;

        const faviconUrl = settings.site_favicon.includes('?')
            ? `${settings.site_favicon}&t=${Date.now()}`
            : `${settings.site_favicon}?t=${Date.now()}`;

        // Update main favicon
        const currentFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (currentFavicon) {
            if (currentFavicon.href !== faviconUrl) {
                currentFavicon.href = faviconUrl;
            }
        } else {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/x-icon';
            link.href = faviconUrl;
            document.head.appendChild(link);
        }

        // Update shortcut icon
        const currentShortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
        if (currentShortcut) {
            if (currentShortcut.href !== faviconUrl) {
                currentShortcut.href = faviconUrl;
            }
        } else {
            const shortcutLink = document.createElement('link');
            shortcutLink.rel = 'shortcut icon';
            shortcutLink.type = 'image/x-icon';
            shortcutLink.href = faviconUrl;
            document.head.appendChild(shortcutLink);
        }
    }, [settings?.site_favicon]);

    return null;
}
