'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Settings {
    site_name: string;
    site_logo: string;
    site_favicon: string;
    show_site_name: string; // 'true' or 'false'
}

const defaultSettings: Settings = {
    site_name: 'The Tulie Lab',
    site_logo: '',
    site_favicon: '',
    show_site_name: 'true'
};

const SettingsContext = createContext<{ settings: Settings, updateSettings: () => Promise<void> }>({
    settings: defaultSettings,
    updateSettings: async () => { }
});

export const SettingsProvider = ({ children, initialSettings }: { children: React.ReactNode, initialSettings?: Settings }) => {
    const [settings, setSettings] = useState<Settings>(initialSettings || defaultSettings);

    const fetchSettings = async () => {
        try {
            const res: any = await api.settings.getPublic();
            if (res) {
                setSettings({
                    site_name: res.site_name || defaultSettings.site_name,
                    site_logo: res.site_logo || defaultSettings.site_logo,
                    site_favicon: res.site_favicon || defaultSettings.site_favicon,
                    show_site_name: res.show_site_name || defaultSettings.show_site_name
                });

                // Update favicon dynamically
                if (res.site_favicon && typeof document !== 'undefined') {
                    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
                    if (link) {
                        link.href = res.site_favicon;
                    } else {
                        const newLink = document.createElement('link');
                        newLink.rel = 'icon';
                        newLink.href = res.site_favicon;
                        document.head.appendChild(newLink);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    useEffect(() => {
        // Only fetch if no initial settings provided (or to keep fresh)
        // If we provide initialSettings, we might skip the effect or just use it for updates
        // For now, keeping it to ensuring latest client-side updates, but initial render is fast.
        if (!initialSettings) {
            fetchSettings();
        }
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
