
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
    const { settings } = useSettings();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const shouldShowText = showText && settings.show_site_name === 'true';
    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

    // Use dark logo if available and in dark mode, otherwise fallback to site_logo
    // If user asked for "option logo negative", we might need a new setting.
    // For now, let's look for a setting named `site_logo_dark` or similar if it existed.
    // If not, we might need to assume the user wants us to ADD this capability.
    // But since I can't easily change the backend schema right now without more info,
    // I will try to use a CSS filter for now if requested, or just `text-foreground`.

    // Actually, I'll just apply `text-foreground` which handles text.
    // For the image, if it's black text on transparent, it needs inversion in dark mode.
    // I'll add a class `dark:invert` if it's a standard black logo, but that's risky.
    // Let's assume the user has a `site_logo_dark` setting or I should add it to the type definition in a view.

    // Let's stick to the current plan: Use `text-foreground` for the text part.
    // For the image: if `settings.site_logo` is used, render it. 
    // If the user wants a "negative" logo, they might mean "white text" version.

    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            {settings.site_logo ? (
                <div className="relative h-10 w-auto transition-transform hover:scale-105">
                    {/* 
                        If we had a site_logo_dark: 
                        <img src={isDark && settings.site_logo_dark ? settings.site_logo_dark : settings.site_logo} ... />
                        For now, I will assume the standard logo is used. 
                        If the user specifically asked for "option logo negative", 
                        maybe I should just flip the colors using CSS if it's dark mode?
                        Let's try adding `dark:invert` to the image if the user wants it white in dark mode? 
                        No, that inverts colors (red becomes cyan). 
                        Let's wait for `SettingsContext` view to see if I can add a field.
                     */}
                    <img
                        src={settings.site_logo}
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
                    {settings.site_name}
                </span>
            )}
        </Link>
    );
}
