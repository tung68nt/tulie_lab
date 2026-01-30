'use client';

import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
    const { settings } = useSettings();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [hostname, setHostname] = useState<string>("");
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            setHostname(window.location.hostname);
        }
    }, []);

    // Parse domain branding from settings
    const domainBrandingList = useMemo(() => {
        if (!settings.domain_branding) return [];
        try {
            return JSON.parse(settings.domain_branding);
        } catch (e) {
            console.error('Failed to parse domain branding settings', e);
            return [];
        }
    }, [settings.domain_branding]);

    // Find branding for current hostname
    const currentBranding = useMemo(() => {
        if (!hostname) return null;

        // Normalize current hostname
        const normalizedHost = hostname.toLowerCase().replace(/^www\./, '');
        console.log('Current Hostname:', normalizedHost); // Debugging log

        const foundBranding = domainBrandingList.find((db: any) => {
            if (!db.domain) return false;

            // Normalize configured domain: strip protocol, www, and trailing slashes
            const normalizedConfigDomain = db.domain.toLowerCase()
                .replace(/^(https?:\/\/)?(www\.)?/, '')
                .replace(/\/$/, '');

            // Match exact domain or subdomains
            const isMatch = normalizedConfigDomain === normalizedHost ||
                normalizedHost.endsWith(`.${normalizedConfigDomain}`);

            if (isMatch) {
                console.log('Matched Branding Domain:', normalizedConfigDomain, 'with Host:', normalizedHost); // Debugging log
            }
            return isMatch;
        });

        if (!foundBranding) {
            console.log('No branding found for host:', normalizedHost); // Debugging log
        }
        return foundBranding;
    }, [hostname, domainBrandingList]);

    // Final logo and name logic with fallback
    // If imgError is true, we force fallback to default settings even if currentBranding exists
    const displayLogo = (!imgError && currentBranding?.logo_url) || settings.site_logo;
    const displayName = currentBranding?.site_name || settings.site_name;

    const shouldShowText = showText && settings.show_site_name === 'true';
    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

    // Reset error state if hostname changes or settings change
    useEffect(() => {
        setImgError(false);
    }, [hostname, settings.site_logo]);

    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            {displayLogo ? (
                <div className="relative h-8 w-auto transition-transform hover:scale-105">
                    <img
                        src={displayLogo}
                        alt="Logo"
                        width="150"
                        height="40"
                        className={`h-full w-auto object-contain ${isDark ? 'dark:brightness-0 dark:invert' : ''}`}
                        onError={() => {
                            // If the dynamic logo fails, set error to true to force fallback to default
                            if (currentBranding?.logo_url && displayLogo === currentBranding.logo_url) {
                                setImgError(true);
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105">
                    <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 2v2h1v14a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4h1V2H7zm4 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2-4c-.6.0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-5H10V4h4v3z" />
                    </svg>
                </div>
            )}

            {shouldShowText && (
                <span className="text-lg font-bold text-foreground tracking-tight">
                    {displayName}
                </span>
            )}
        </Link>
    );
}
