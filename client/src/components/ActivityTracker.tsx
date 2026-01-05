'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export function ActivityTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastPathRef = useRef<string | null>(null);

    useEffect(() => {
        const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        // Avoid duplicate logging for strict mode or rapid updates
        if (lastPathRef.current === currentPath) return;
        lastPathRef.current = currentPath;

        // Debounce slightly to ensure we don't log rapid redirects
        const timer = setTimeout(() => {
            logView(currentPath);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    const logView = async (path: string) => {
        try {
            // Only log if it's not a static asset or API call (redundant check for client router but good practice)
            if (path.startsWith('/_next') || path.startsWith('/api')) return;

            // Log to backend
            await api.activity.log('view_page', {
                path: path,
                metadata: {
                    title: document.title
                }
            });
        } catch (error) {
            // Silently fail to not disturb user
            console.warn('Failed to log activity', error);
        }
    };

    return null;
}
