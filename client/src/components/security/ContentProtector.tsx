'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

import { usePathname } from 'next/navigation';

export function ContentProtector() {
    const { addToast } = useToast();
    const pathname = usePathname();
    // Only protect content in learning area
    const isProtected = pathname?.startsWith('/learn') || pathname?.startsWith('/admin/courses/preview');

    useEffect(() => {
        if (!isProtected) return;

        const logSecurity = async (action: string, details: string) => {
            try {
                await api.post('/security/log', { action, details });
            } catch (e) {
                // Ignore log errors
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            logSecurity('RIGHT_CLICK', 'User attempted to right-click');
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            addToast('Nội dung được bảo vệ bản quyền.', 'warning');
            logSecurity('COPY_PASTE', 'User attempted to copy content');
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                logSecurity('DEVTOOLS', 'F12 pressed');
                addToast('Chức năng này bị vô hiệu hóa để bảo vệ nội dung.', 'warning');
                return;
            }

            // Ctrl+Shift+I (Windows) or Cmd+Opt+I (Mac) - DevTools
            if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                logSecurity('DEVTOOLS', 'Inspection shortcut pressed');
                addToast('Chức năng này bị vô hiệu hóa để bảo vệ nội dung.', 'warning');
                return;
            }

            // Ctrl+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                logSecurity('DEVTOOLS', 'View Source shortcut pressed');
                return;
            }

            // Print Screen prevention is hard/impossible in browser but we can clear clipboard?
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('copy', handleCopy);
        window.addEventListener('cut', handleCopy);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('copy', handleCopy);
            window.removeEventListener('cut', handleCopy);
        };
    }, [addToast, isProtected]);

    return null; // Invisible component
}
