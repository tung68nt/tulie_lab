import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
    const { settings } = useSettings();
    const shouldShowText = showText && settings.show_site_name === 'true';

    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            {/* Logo icon or Image */}
            {/* Logo icon or Image */}
            {settings.site_logo ? (
                <div className="relative h-10 w-auto transition-transform hover:scale-105">
                    <img src={settings.site_logo} alt="Logo" className="h-full w-auto object-contain" />
                </div>
            ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground dark:bg-white transition-transform hover:scale-105">
                    <svg
                        className="h-5 w-5 text-background dark:text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {/* Lab flask icon */}
                        <path d="M7 2v2h1v14a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4h1V2H7zm4 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm2-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-5H10V4h4v3z" />
                    </svg>
                </div>
            )}

            {shouldShowText && (
                <span className="text-lg font-bold text-foreground dark:text-white tracking-tight">
                    {settings.site_name}
                </span>
            )}
        </Link>
    );
}
