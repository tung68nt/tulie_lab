
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

// Map hostnames to specific branding (Logo and Site Name)
// This allows different domains to have unique identities while sharing the same app.
const DOMAIN_BRANDING: Record<string, { logo: string; name: string }> = {
    'thelab.tulie.vn': {
        logo: '/images/logos/thelab.png',
        name: 'The Tulie Lab'
    },
    'tulielab.academy': {
        logo: '/images/logos/tulielab.png',
        name: 'Tulie Academy'
    },
    'tungnguyen.academy': {
        logo: '/images/logos/tungnguyen.png',
        name: 'Tùng Nguyễn Academy'
    }
};

export function Logo({ className = "", showText = true }: LogoProps) {
    const { settings } = useSettings();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [hostname, setHostname] = useState<string>("");

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            setHostname(window.location.hostname);
        }
    }, []);

    // Get branding based on domain, fallback to settings from CMS
    const currentBranding = DOMAIN_BRANDING[hostname];
    const siteLogo = currentBranding?.logo || settings.site_logo;
    const siteName = currentBranding?.name || settings.site_name;

    const shouldShowText = showText && settings.show_site_name === 'true';
    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            {siteLogo ? (
                <div className="relative h-8 w-auto transition-transform hover:scale-105">
                    <img
                        src={siteLogo}
                        alt="Logo"
                        width="150"
                        height="40"
                        className={`h-full w-auto object-contain ${isDark ? 'dark:brightness-0 dark:invert' : ''}`}
                    />
                </div>
            ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105">
                    <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 2v2h1v14a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4h1V2H7zm4 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-5H10V4h4v3z" />
                    </svg>
                </div>
            )}

            {shouldShowText && (
                <span className="text-lg font-bold text-foreground tracking-tight">
                    {siteName}
                </span>
            )}
        </Link>
    );
}
