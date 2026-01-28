'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Settings {
    site_name: string;
    site_logo: string;
    site_favicon: string;
    show_site_name: string; // 'true' or 'false'
    // Pricing
    pricing_membership_basic_sale?: string;
    pricing_membership_basic_original?: string;
    pricing_membership_basic_description?: string;
    pricing_membership_basic_features?: string;
    pricing_membership_premium_sale?: string;
    pricing_membership_premium_original?: string;
    pricing_membership_premium_description?: string;
    pricing_membership_premium_features?: string;
    pricing_single_sale?: string;
    pricing_single_original?: string;
    pricing_single_description?: string;
    pricing_vibe_coding_sale?: string;
    pricing_vibe_coding_original?: string;
    domain_branding?: string; // JSON stringified array of DomainBranding objects
}

export interface DomainBranding {
    id: string;
    domain: string;
    logoUrl: string;
    siteName: string;
}

const defaultSettings: Settings = {
    site_name: 'The Tulie Lab',
    site_logo: '',
    site_favicon: '',
    show_site_name: 'true',
    pricing_membership_basic_sale: '1.990k',
    pricing_membership_basic_original: '3.500k',
    pricing_membership_basic_description: 'Tải không giới hạn tất cả các templates',
    pricing_membership_basic_features: '["Tải không giới hạn", "Tiết kiệm 80%", "Update hàng tuần"]',
    pricing_membership_premium_sale: '4.990k',
    pricing_membership_premium_original: '15.000k',
    pricing_membership_premium_description: 'All-in-one + Tư vấn 1-1 trực tiếp',
    pricing_membership_premium_features: '["Tư vấn 1-1 trực tiếp", "Source code các dự án", "Hỗ trợ ưu tiên 24/7"]',
    pricing_single_sale: '250k',
    pricing_single_original: '500k',
    pricing_single_description: 'Sở hữu vĩnh viễn template này',
    pricing_vibe_coding_sale: '1.790k',
    pricing_vibe_coding_original: '3.500k',
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
                    ...defaultSettings,
                    ...res,
                });
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
